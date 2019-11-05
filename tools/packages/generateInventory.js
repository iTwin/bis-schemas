/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

// This tool is designed to merge the information dumped by the 'signoff.py --getLaunchCodes --dumpJson' script
// with the schema information gathered from the bis-schemas repository.

"use strict";

const fs = require("fs");
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

async function getReleasedSchemas() {
  const allSchemas = await readdirp.promise(argv.BisRoot, {fileFilter: "*.ecschema.xml", directoryFilter: ["!docs", "!node_modules", "!tools", "!.vscode", "!cmaps"]});

  const schemaJSON = {};
  for (const entry of allSchemas) {
    const schemaInfo = {
      name: entry.basename.match(/\w+/)[0], 
      path: entry.path, 
      released: entry.path.includes("Released"), 
      version: entry.basename.match(/\d+\.\d+\.\d+/) !== null ? entry.basename.match(/\d+\.\d+\.\d+/)[0] : ""
    };
    
    if (schemaJSON[schemaInfo.name] == undefined) {
      schemaJSON[schemaInfo.name] = [];
    }
    schemaJSON[schemaInfo.name].push(schemaInfo);
  }

  const bisChecksumDump = JSON.parse (fs.readFileSync("BisChecksumDump.json"));
  for (const schemaChecksum of bisChecksumDump.schemas) {
    let version = schemaChecksum.comment.match(/(?<write>\d+)\.(?<read>\d+)\.(?<patch>\d+)(?<comment>.*)/)
    if (null === version) {
      version = "01.00.00";
    } else {
      schemaChecksum.comment = version.groups.comment;
      version = zeroPad(version.groups.write) + "." + zeroPad(version.groups.read) + "." + zeroPad(version.groups.patch);
    }
    schemaChecksum.version = version;
  }

  for (const schemaChecksum of bisChecksumDump.schemas) {
    const schemaInfo = schemaJSON[schemaChecksum.name];
    if (undefined === schemaInfo || null === schemaInfo) {
      schemaJSON[schemaChecksum.name] = [{...schemaChecksum}];
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

  for (const [name, schemaInfos] of Object.entries(schemaJSON)) {
    for (const schema of schemaInfos) {
      if (schema.released) continue;

      if (undefined === schema.comment) schema.comment = "";
      if (undefined === schema.sha1) schema.sha1 = "";
      if (undefined === schema.author) schema.author = "";
      if (undefined === schema.approved) schema.approved = "No";
      if (undefined === schema.date) schema.date = "Unknown";
      if (undefined === schema.dynamic) schema.dynamic = "No";
    }
  }
  fs.writeFileSync('SchemaInventory.json', JSON.stringify(schemaJSON, null, 2));
}

getReleasedSchemas();