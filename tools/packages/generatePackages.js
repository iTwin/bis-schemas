/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

// This tool creates an npm package for each schema.  Released released schemas should be 
// published with the latest tag and beta schemas are released with the next tag.  Use the option --skipBetaPackages to publish only released packages.
// Usage:
// node generatePackages.js --template <pathToPackageJsonTemplate> --outDir <pathToDirectoryToBuildPackages> --inventory <pathToSchemaInventory> [--skipBetaPackages]
// Example:
//    node ./tools/packages/generatePackages.js --inventory ./SchemaInventory.json --outDir ./packageOut --template ./tools/packages/package.json.template

"use strict";

const fs = require("fs");
const path = require("path");
const argv = require("yargs").argv;
const child_process = require('child_process');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

function parseVersionString(versionString, time) {
  const match = versionString.match(/(?<read>\d+)\.(?<write>\d+)\.(?<patch>\d+)(-beta\.(?<betaVersion>\d+))?/);
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
  let publishedVersions = [];
  for (const [v,time] of Object.entries(npmOutput)) {
    const pv = parseVersionString(v, time);
    if (pv) publishedVersions.push(pv);
    }
  return publishedVersions.sort((a, b) => (a.read - b.read)<<3 + (a.write -b.write)<<2 + (a.patch - b.patch)<<1 + a.beta - b.beta );
}

function formatPackageVersion(versionInfo) {
  return `${versionInfo.read}.${versionInfo.write}.${versionInfo.patch}${versionInfo.isBeta ? "-beta." + versionInfo.beta : ""}`;
}

function buildPackage(outPath, packageJsonTemplate, versionInfo, schemaInfo) {
  console.log (`Building package ${versionInfo.packageName}.${versionInfo.packageVersion} for file ${schemaInfo.path}`);
  const packageDir = path.join(outPath, `${schemaInfo.name}.${versionInfo.packageVersion}`);
  if (!fs.existsSync(packageDir)) fs.mkdirSync(packageDir, {recursive: true});

  const pkgJson = packageJsonTemplate.replace('${PACKAGE_NAME}', versionInfo.packageName)
                                     .replace('${DOMAIN_NAME}', schemaInfo.name)
                                     .replace('${PACKAGE_VERSION}', versionInfo.packageVersion);

  fs.writeFileSync(path.join(packageDir, "package.json"), pkgJson);
  const schemaFileName = `${schemaInfo.name}.${schemaInfo.version}.ecschema.xml`;
  const packageSchemaPath = path.join(packageDir, schemaFileName);
  fs.copyFileSync(schemaInfo.path, packageSchemaPath);
}

function getReleaseVersion(schemaInfo, publishedVersions) {
  const versionInfo = parseVersionString(schemaInfo.version);
  const matchingPublishedVersion = publishedVersions.find((pub) => 
    !pub.isBeta && versionInfo.read === pub.read && versionInfo.write === pub.write && versionInfo.patch === pub.patch);
  
  console.log(`Found matching released package for ${schemaInfo.name}.${schemaInfo.version}, skipping package generation`);
  versionInfo.needToPublish = undefined === matchingPublishedVersion;
  return versionInfo;
}

function getNextBetaVersion(schemaInfo, publishedVersions) {
  const versionInfo = parseVersionString(schemaInfo.version);
  const latestPublishedBeta = publishedVersions.find((pub) => 
    pub.isBeta && versionInfo.read === pub.read && versionInfo.write === pub.write && versionInfo.patch === pub.patch);
  
  const matchingPublishedVersion = publishedVersions.find((pub) => 
    !pub.isBeta && versionInfo.read === pub.read && versionInfo.write === pub.write && versionInfo.patch === pub.patch);
  if (undefined !== matchingPublishedVersion) {
    console.log(`Found released version of ${schemaInfo.name}.${schemaInfo.version}, skipping beta package generation.`);
    versionInfo.needToPublish = false;
  } else if (undefined === latestPublishedBeta) {
    console.log (`Did not find any already published versions of ${schemaInfo.name}.${schemaInfo.version}.  Publishing -beta.1`)
    versionInfo.isBeta = true;
    versionInfo.beta = 1;
    versionInfo.needToPublish = true;
  } else {
    versionInfo.beta = latestPublishedBeta.beta + 1;
    const gitModTime = new Date (child_process.spawnSync(`git`,[`log`, `-1`, `--format=%cI`, schemaInfo.path], {encoding: 'utf8'}).stdout.trimRight());
    versionInfo.needToPublish = gitModTime > latestPublishedBeta.time;
    console.log(`Found beta version ${latestPublishedBeta.beta} for ${schemaInfo.name}.${schemaInfo.version}.  Local version changed ${gitModTime}, package published ${latestPublishedBeta.time}, ${versionInfo.needToPublish? "generating package": "skipping package generation"}.`)
  }
  return versionInfo;
}

async function createPackages(inventoryPath, outDir, packageTemplatePath, skipBetaPackages) {
  if (skipBetaPackages) console.log("Skipping beta packages because the '--skipBetaPackages' flag is set");

  const schemaInventory = JSON.parse(fs.readFileSync(inventoryPath));
  if (null === schemaInventory || undefined == schemaInventory)
    throw Error (`Could not load schema invetory file from '${inventoryPath}'`);
  
  const packageJsonTemplate = fs.readFileSync(packageTemplatePath, {encoding: 'utf8'});

  for (const [name, schemaInfoList] of Object.entries(schemaInventory)) {
    const packageName = "@bentley/bis-" + name.toLowerCase();
    console.log(`Looking for packages published with the name ${packageName} for schema ${name}`);
    const publishedVersions = getPublishedSchemas(packageName);
    for (const schemaInfo of schemaInfoList) {
      if(!schemaInfo.path) {
        console.log(`Skipping ${schemaInfo.name}.${schemaInfo.version} because entry has no path defined.`);
        continue;
      }

      let versionInfo = {needToPublish: false};
      // if released check npm for package, build if does not exist
      if (schemaInfo.released) {
        versionInfo = getReleaseVersion(schemaInfo, publishedVersions);
      } else if (!skipBetaPackages) {
        versionInfo = getNextBetaVersion(schemaInfo, publishedVersions);
      }
    
      if (versionInfo.needToPublish) {
          versionInfo.packageName = packageName;
          versionInfo.packageVersion = formatPackageVersion(versionInfo);
          buildPackage(outDir, packageJsonTemplate, versionInfo, schemaInfo);
      }
    }
  }
}

createPackages(argv.inventory, argv.outDir, argv.template, undefined !== argv.skipBetaPackages);
