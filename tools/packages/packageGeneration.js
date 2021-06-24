/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

"use strict";

const fs = require("fs");
const path = require("path");
const child_process = require('child_process');
const createSchemaJson = require("./schemaJsonCreator").createSchemaJson;

function parseVersionString(versionString, time) {
  const match = versionString.match(/(?<read>\d+)\.(?<write>\d+)\.(?<patch>\d+)((-dev|-beta)\.(?<betaVersion>\d+))?/);
  if (match) {
    const parsed = {
      read: parseInt(match.groups.read, 10).toString(), 
      write: parseInt(match.groups.write, 10).toString(), 
      patch: parseInt(match.groups.patch, 10).toString(),
      isBeta: !!match.groups.betaVersion,
      beta: !match.groups.betaVersion ? '0' : match.groups.betaVersion,
      time: new Date(time)
    };
    return parsed;
  }
  return undefined;
}

function versionToNumber(version) {
  return(version.read * 1000000) + (version.write * 10000) + (version.patch * 100) + +version.beta;
}

function parseNpmOutputAndSort(npmOutput) {
  let publishedVersions = [];
  for (const [v,time] of Object.entries(npmOutput)) {
    const pv = parseVersionString(v, time);
    if (pv) publishedVersions.push(pv);
    }
  return publishedVersions.sort((a, b) => (versionToNumber(b) - versionToNumber(a)));
}

function getPublishBlackList() {
  const fullPath = path.resolve(__dirname, "publishBlackList.json")
  if (!fs.existsSync(fullPath))
    return;

  let rawdata = fs.readFileSync(fullPath);
  let schemas = JSON.parse(rawdata);
  schemas.forEach(element => {if (element.allowInternal === undefined) {element.allowInternal = false};});
  return schemas;
}

function isBlackListed(schema, blackList) {
  if (!blackList)
    return false;

  const matches = blackList.filter((s) => s.name === schema.name);
  if (matches.length === 0)
    return false;

  const match = matches.find((s) => s.version === "*" || !schema.version || s.version === schema.version);
  if (!match)
    return false;

  return !match.allowInternal;
}

function getPublishedSchemas (packageName) {
  let npmOutput = {};
  try {
    npmOutput = JSON.parse(child_process.execSync(`npm view ${packageName} time --json`, {stdio:['inherit']}));
  } catch (e) {
    if (!e.message.includes("E404")) {
      throw e;
    }
    console.log(`Found no packages with name ${packageName}`);
  }
  return parseNpmOutputAndSort(npmOutput);
}

function formatPackageVersion(versionInfo) {
  return `${versionInfo.read}.${versionInfo.write}.${versionInfo.patch}${versionInfo.isBeta ? "-dev." + versionInfo.beta : ""}`;
}

async function buildPackage(outPath, packageJsonTemplate, versionInfo, schemaInfo) {
  console.log (`Building package ${versionInfo.packageName}.${versionInfo.packageVersion} for file ${schemaInfo.path}`);
  const packageDir = path.join(outPath, `${schemaInfo.name}.${versionInfo.packageVersion}`);
  if (!fs.existsSync(packageDir)) fs.mkdirSync(packageDir, {recursive: true});

  const pkgJson = packageJsonTemplate.replace('${PACKAGE_NAME}', versionInfo.packageName)
                                     .replace('${DOMAIN_NAME}', schemaInfo.name)
                                     .replace('${PACKAGE_VERSION}', versionInfo.packageVersion);

  fs.writeFileSync(path.join(packageDir, "package.json"), pkgJson);
  const schemaFileName = `${schemaInfo.name}.ecschema.xml`;
  const packageSchemaPath = path.join(packageDir, schemaFileName);
  fs.copyFileSync(schemaInfo.path, packageSchemaPath);
  fs.copyFileSync(path.resolve("./tools/packages/LICENSE.md"), path.join(packageDir, "LICENSE.md"));

  // create json schema
  await createSchemaJson(schemaInfo, packageDir);
  
  const readmeText = fs.readFileSync(path.resolve("./tools/packages/README.md.template"), 'utf8');
  var updatedReadme = readmeText.replace(/{package-name}/g, versionInfo.packageName);
  fs.writeFileSync(path.join(packageDir, "README.md"), updatedReadme);
}

function getReleaseVersion(schemaInfo, publishedVersions, alwaysGen) {
  const versionInfo = parseVersionString(schemaInfo.version);
  const matchingPublishedVersion = publishedVersions.find((pub) => 
    !pub.isBeta && versionInfo.read === pub.read && versionInfo.write === pub.write && versionInfo.patch === pub.patch);

  versionInfo.needToPublish = undefined === matchingPublishedVersion || alwaysGen;
  if (!versionInfo.needToPublish)
    console.log(`Found matching released package for ${schemaInfo.name}.${schemaInfo.version}, skipping package generation`);
  return versionInfo;
}

function getNextBetaVersion(schemaInfo, publishedVersions, alwaysGen) {
  const versionInfo = parseVersionString(schemaInfo.version);
  const latestPublishedBeta = publishedVersions.find((pub) => 
    pub.isBeta && versionInfo.read === pub.read && versionInfo.write === pub.write && versionInfo.patch === pub.patch);
  
  const matchingPublishedVersion = publishedVersions.find((pub) => 
    !pub.isBeta && versionInfo.read === pub.read && versionInfo.write === pub.write && versionInfo.patch === pub.patch);
  if (undefined !== matchingPublishedVersion) {
    console.log(`Found released version of ${schemaInfo.name}.${schemaInfo.version}, skipping beta package generation.`);
    versionInfo.needToPublish = false;
  } else if (undefined === latestPublishedBeta) {
    console.log (`Did not find any already published versions of ${schemaInfo.name}.${schemaInfo.version}.  Publishing -dev.1`)
    versionInfo.isBeta = true;
    versionInfo.beta = 1;
    versionInfo.needToPublish = true;
  } else {
    versionInfo.isBeta = true;
    versionInfo.beta = parseInt(latestPublishedBeta.beta) + 1;
    const gitModTime = new Date (child_process.spawnSync(`git`,[`log`, `-1`, `--format=%cI`, schemaInfo.path], {encoding: 'utf8'}).stdout.trimRight());
    versionInfo.needToPublish = gitModTime > latestPublishedBeta.time || alwaysGen;
    console.log(`Found beta version ${latestPublishedBeta.beta} for ${schemaInfo.name}.${schemaInfo.version}.  Local version changed ${gitModTime}, package published ${latestPublishedBeta.time}, ${versionInfo.needToPublish? "generating package": "skipping package generation"}.`)
  }
  return versionInfo;
}

function shouldPublish(schemaInfo, versionInfo) {
  if(schemaInfo.released) {
    // verify sha1 actually matches what is in the inventory
    if (schemaInfo.sha1 === undefined || schemaInfo.sha1 === null || schemaInfo.sha1 === "" || schemaInfo.sha1.length != 40) {
      console.log ("Sha1 not valid.");
      return false;
    }
    if (!/yes/i.test(schemaInfo.approved)) {
      console.log("Schema not marked as approved");
      return false;
    }
    if (versionInfo.isBeta) {
      console.log("version info says schema is beta but schema info says it should be released as non-beta");
      return false;
    }
  return true;
  }
  
  if (!versionInfo.isBeta) {
    console.log("version info says schema is not beta but schema info says it should released as beta");
    return false;
  }
  return true;
}

async function createPackages(inventoryPath, skipListPath, outDir, packageTemplatePath, skipBetaPackages, alwaysGen) {
  if (skipBetaPackages) console.log("Skipping beta packages because the '--skipBetaPackages' flag is set");

  // Always create the package output directory so we have something to publish.
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});

  const schemaInventory = JSON.parse(fs.readFileSync(inventoryPath));
  if (null === schemaInventory || undefined == schemaInventory)
    throw Error (`Could not load schema invetory file from '${inventoryPath}'`);
  
  const packageJsonTemplate = fs.readFileSync(packageTemplatePath, { encoding: 'utf8' });
  const skipList = skipListPath ? JSON.parse(fs.readFileSync(skipListPath, { encoding: 'utf8' })) : [];
  const publishBlackList = getPublishBlackList();

  for (const [name, schemaInfoList] of Object.entries(schemaInventory)) {
    if (skipList.find((schemaToSkip) => { return schemaToSkip.name === name })) {
      console.log(`Skipping ${name} because it is on the skip list`);
      continue;
    }

    let formattedName = name.replace(/([a-z]|[0-9]+D{0,1})([A-Z])/g, '$1-$2').toLowerCase();
    
    const packageName = `@bentley/${formattedName}-schema`;
    console.log(`Looking for packages published with the name ${packageName} for schema ${name}`);
    const publishedVersions = getPublishedSchemas(packageName);
    for (const schemaInfo of schemaInfoList) {
      if(!schemaInfo.path) {
        console.log(`Skipping ${schemaInfo.name}.${schemaInfo.version} because entry has no path defined.`);
        continue;
      }

      if (isBlackListed(schemaInfo, publishBlackList)) {
        console.log(`Skipping ${schemaInfo.name}.${schemaInfo.version} because it has been blacklisted for publishing.`);
        continue;
      }

      let versionInfo = {needToPublish: false};
      // if released check npm for package, build if does not exist
      if (schemaInfo.released) {
        versionInfo = getReleaseVersion(schemaInfo, publishedVersions, alwaysGen);
      } else if (!skipBetaPackages) {
        versionInfo = getNextBetaVersion(schemaInfo, publishedVersions, alwaysGen);
        // Even if needToPublish is true don't publish beta package if it's also in the released folder
        const released = schemaInfoList.find((info) => info.name === schemaInfo.name && info.version === schemaInfo.version && info.released === true);
        if (versionInfo.needToPublish)
          versionInfo.needToPublish = undefined === released;
      }
    
      if (versionInfo.needToPublish) {
        if(false === shouldPublish(schemaInfo, versionInfo)) {
          console.log(`Skipping package generation for ${schemaInfo.name}.${schemaInfo.version} because it is not valid.`);
          continue;
        }
        versionInfo.packageName = packageName;
        versionInfo.packageVersion = formatPackageVersion(versionInfo);
        await buildPackage(outDir, packageJsonTemplate, versionInfo, schemaInfo);      }
    }
  }
}

module.exports = {parseNpmOutputAndSort, formatPackageVersion, createPackages, shouldPublish, parseVersionString};
