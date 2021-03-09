/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

// This tool publishes the packages found in the specified directory.  Fails if any package fails to publish all packages it can.
// Requires '--isRealRun' passed in to actually publish, else it does a dry run
// Usage:
// publishPackages.js --packages <directoryToSearchForPackages> [--isRealRun]
// Example:
//    node ./tools/packages/publishPackages.js --packages ./packageOut

"use strict";

const fs = require("fs");
const readdirp = require("readdirp");
const argv = require("yargs").argv;
const path = require("path");
const child_process = require('child_process');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

async function applyBlackList(packagePaths, isPublic) {
  const publishBlackList = getPublishBlackList();
  const filteredPaths = [];

  for (const packagePath of packagePaths) {
    const schemaPath = await readdirp.promise(packagePath, {
      fileFilter:"*.ecschema.xml", 
      type: 'files'
    });

    if (!schemaPath || schemaPath.length != 1)
      throw new Error(`Schema XML file not found in ${packagePath}`);

    const name = schemaPath[0].basename.match(/\w+/)[0]
    const version = getSchemaVersion(schemaPath[0].fullPath);
    if (!isBlackListed(name, version, isPublic, publishBlackList))
      filteredPaths.push(packagePath);
  }

  return filteredPaths;
}

function isBlackListed(schemaName, version, isPublic, blackList) {
  if (!blackList)
    return false;

  const matches = blackList.filter((s) => s.name === schemaName);
  if (matches.length === 0)
    return false;

  const match = matches.find((s) => s.version === "*" || s.version === version);
  if (!match)
    return false;

  return !match.allowInternal;
}

function getSchemaVersion(schemaPath) {
  const schemaXml = fs.readFileSync(schemaPath).toString();
  const versionMatch = schemaXml.match(/<ECSchema .*version="(?<read>\d+)\.(?<write>\d+)(\.(?<patch>\d+))?/);
  if (!versionMatch || !versionMatch.groups.read || !versionMatch.groups.write) {
    throw new Error(`Could not find version in schema xml for file ${schemaPath}`);
  }

  return !versionMatch.groups.patch ? createVersion (versionMatch.groups.read, "0", versionMatch.groups.write) : createVersion (versionMatch.groups.read, versionMatch.groups.write, versionMatch.groups.patch);
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

function zeroPad (digit) {
  if (1 === digit.length)
    return '0' + digit;
  return digit;
}

function createVersion(vRead, vWrite, vPatch) {
  return zeroPad(vRead) + "." + zeroPad(vWrite) + "." + zeroPad(vPatch);
}

async function publishPackages(searchDirectory, isPublic, isRealRun) {
  const allPackageJsons = await readdirp.promise(searchDirectory, {
    fileFilter: "package.json", 
    directoryFilter: ["!docs", "!node_modules", "!tools", "!.vscode", "!cmaps", "!packageOut", "!Deprecated", "!test"],
    type: 'files'
  });
  const allPackages = allPackageJsons.map((pkgJsonPath) => path.dirname(pkgJsonPath.fullPath)).sort();
  const filteredPackages = await applyBlackList(allPackages, isPublic);
  console.log(JSON.stringify(filteredPackages));

  const publishCommands = filteredPackages.map((pkg) => `npm publish ${pkg} --tag ${pkg.includes("-dev")? "beta": "latest"} --access public ${isRealRun? "":"--dry-run"}`);
  console.log(JSON.stringify(publishCommands));
  let hadFailures = false;
  publishCommands.forEach((command) => {
    let npmOutput = "";
    try {
      npmOutput = child_process.execSync(command, {stdio:['inherit'], encoding:'utf8'});
    } catch (e) {
      hadFailures = true;
      
      if (!e.message.includes("E403")) {
        throw e;
      }
      console.log(`Publish command failed: ${command}`);
      console.log(`Error: ${e.message}`);
    }
    console.log(npmOutput);
  });
  return hadFailures;
}


publishPackages(argv.packages, undefined !== argv.public, undefined !== argv.isRealRun);