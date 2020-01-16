/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

// This tool is designed to merge the information dumped by the 'signoff.py --getLaunchCodes --dumpJson' script
// with the schema information gathered from the bis-schemas repository.
// Usage:
// generateInventory.js --BisRoot <pathToRootOfBisSchemasRepo>
// Example:
//    node ./tools/packages/generateInventory.js --BisRoot .

"use strict";

const fs = require("fs-extra");
const readdirp = require("readdirp");
const argv = require("yargs").argv;

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

function zeroPad (digit) {
  if (1 === digit.length)
    return '0' + digit;
  return digit;
}

function createVersion(vRead, vWrite, vPatch) {
  return zeroPad(vRead) + "." + zeroPad(vWrite) + "." + zeroPad(vPatch);
}

async function getReleasedSchemas() {
  const allSchemas = await readdirp.promise(argv.BisRoot, {fileFilter: "*.ecschema.xml", directoryFilter: ["!docs", "!node_modules", "!tools", "!.vscode", "!cmaps", "!packageOut", "!Deprecated"]});

  // Create base inventory based on schema files in the bis-schemas repo
  const schemaInventory = {};
  for (const entry of allSchemas) {
    const schemaInfo = {
      name: entry.basename.match(/\w+/)[0], 
      path: entry.path, 
      released: entry.path.includes("Released"), 
      version: entry.basename.match(/\d+\.\d+\.\d+/) ? entry.basename.match(/\d+\.\d+\.\d+/)[0] : ""
    };
    
    if (!schemaInfo.released) schemaInfo.comment = "Working Copy";

    if (schemaInventory[schemaInfo.name] == undefined) {
      schemaInventory[schemaInfo.name] = [];
    }
    schemaInventory[schemaInfo.name].push(schemaInfo);
  }

  // Cleanup and merge information from the bis checksum wiki with information gathered from the bis-schemas repo
  const bisChecksumDump = JSON.parse (fs.readFileSync("BisChecksumDump.json"));
  for (const schemaChecksum of bisChecksumDump.schemas) {
    // Try to pull the version from the comment.  If no version set in comment assume it's 1.0.0
    let version = schemaChecksum.comment.match(/(?<read>\d+)\.(?<write>\d+)\.(?<patch>\d+)(?<comment>.*)/)
    if (!version) {
      version = "01.00.00";
    } else {
      schemaChecksum.comment = version.groups.comment;
      version = createVersion(version.groups.read, version.groups.write, version.groups.patch);
    }
    schemaChecksum.version = version;

    // Merge checksum info from bis checksum wiki into the list of schemas in the bis-schemas repo
    const schemaInfo = schemaInventory[schemaChecksum.name];
    if (undefined === schemaInfo || null === schemaInfo) {
      schemaInventory[schemaChecksum.name] = [{...schemaChecksum}];
      continue;
    }
    let checksumMerged = false;
    for (const schema of schemaInfo) {
      if (schema.version === schemaChecksum.version && schema.released) {
        Object.assign (schema, schemaChecksum);
        checksumMerged = true;
      }
    }
    if (!checksumMerged) {
      schemaInfo.push (schemaChecksum);
    }
  }

  for (const [name, schemaInfos] of Object.entries(schemaInventory)) {
    for (const schema of schemaInfos) {
      if (!schema.path) {
        if (!schema.comment && schema.approved !== "Yes") schema.comment = "Known Bad";
      continue;
      }

      // Get version from inside file and verify it matches or set version in info if not set
      const schemaXml = fs.readFileSync(schema.path).toString();
      const versionMatch = schemaXml.match(/<ECSchema .*version="(?<read>\d+)\.(?<write>\d+)(\.(?<patch>\d+))?/);
      if (!versionMatch || !versionMatch.groups.read || !versionMatch.groups.write) {
        throw new Error(`Could not find version in schema xml for file ${schema.path}`);
      }

      const version = !versionMatch.groups.patch ? createVersion (versionMatch.groups.read, "0", versionMatch.groups.write) : createVersion (versionMatch.groups.read, versionMatch.groups.write, versionMatch.groups.patch);
      if(!schema.version) {
        schema.version = version;
      } else if (schema.version !== version) {
        throw new Error (`The version in the file for schema ${schema.path} ${version} doesn't match the version recorded in the inventory ${schema.version}`);
      }

      // Set base attributes
      if (!schema.comment) schema.comment = "";
      if (!schema.sha1) schema.sha1 = "";
      if (!schema.author) schema.author = "";
      if (!schema.approved) schema.approved = "No";
      if (!schema.date) schema.date = "Unknown";
      if (!schema.dynamic) schema.dynamic = "No";
    }
  }
  fs.writeFileSync('SchemaInventory.json', JSON.stringify(schemaInventory, null, 2));
}

getReleasedSchemas();