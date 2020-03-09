/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

"use strict";

const fs = require("fs-extra");
const readdirp = require("readdirp");
const path = require("path");

function zeroPad (digit) {
  if (1 === digit.length)
    return '0' + digit;
  return digit;
}

function createVersion(vRead, vWrite, vPatch) {
  return zeroPad(vRead) + "." + zeroPad(vWrite) + "." + zeroPad(vPatch);
}

/**
 * Generates a new SchemaInventory.json file containing schema information obtained from the 
 * BIS schemas repository that is merged with either the data in the provided BIS checksum dump
 * OR a previsously existing SchemaInventory.json file.
 * @param {*} bisRootDir 
 * @param {*} outputDir 
 * @param {*} bisChecksumDumpFile 
 */
async function generateInventory(bisRootDir, outputDir, bisChecksumDumpDir) {
  if (!fs.pathExistsSync(bisRootDir))
    throw new Error("The specified bis root directory does not exist.");

  if (!fs.pathExistsSync(outputDir))
    throw new Error("The specified output directory does not exist.");

  let mergeExistingInventory = bisChecksumDumpDir ? false : true;

  let existingInventoryPath;
  let checksumDumpPath;
  if (mergeExistingInventory) {
    existingInventoryPath = path.join(outputDir, 'SchemaInventory.json');
    if (!fs.existsSync(existingInventoryPath))
      throw new Error("An existing SchemaInventory.json could not be found in the provided output directory.");  
  }
  else {
    checksumDumpPath = path.join(bisChecksumDumpDir, 'BisChecksumDump.json');
    if (!fs.existsSync(checksumDumpPath))
      throw new Error("The BisChecksumDump.json file could not be found in the provided path.");
  }
  
  // Create base inventory based on schema files in the bis-schemas repo
  const repoInventory = await createBaseInventory(bisRootDir);

  if (mergeExistingInventory) {
    // Merge information from an existing SchemaInventory.json with information gathered from the bis-schemas repo
    const existinginventory = JSON.parse(fs.readFileSync(existingInventoryPath));
    mergeExistingInventoryIntoRepoInventory(repoInventory, existinginventory);
  } else {
    // Merge information from the bis checksum wiki with information gathered from the bis-schemas repo
    const bisChecksumDump = JSON.parse (fs.readFileSync(checksumDumpPath));
    mergeBisChecksumDump(repoInventory, bisChecksumDump);
  }
  
  // Cleanup entries
  cleanupInventoryEntries(repoInventory);

  fs.writeFileSync(path.join(outputDir, 'SchemaInventory.json'), JSON.stringify(repoInventory, null, 2));
}

/**
 * Creates an inventory of BIS schemas found in the provided directory and child directories.
 * @param {*} bisRootDir The directory holding the schemas.
 */
async function createBaseInventory(bisRootDir) {
  const allSchemas = await readdirp.promise(bisRootDir, {fileFilter: "*.ecschema.xml", directoryFilter: ["!docs", "!node_modules", "!tools", "!.vscode", "!cmaps", "!packageOut", "!Deprecated"]});

  // Create base inventory based on schema files in the bis-schemas repo
  const repoInventory = {};
  for (const entry of allSchemas) {
    const schemaInfo = {
      name: entry.basename.match(/\w+/)[0], 
      path: entry.path, 
      released: entry.path.includes("Released"), 
      version: entry.basename.match(/\d+\.\d+\.\d+/) ? entry.basename.match(/\d+\.\d+\.\d+/)[0] : ""
    };

    const version = getSchemaVersion(bisRootDir, schemaInfo.path);
    if (!schemaInfo.version) {
      schemaInfo.version = version;
    } else if (schemaInfo.version !== version) {
      throw new Error (`The version in the file for schema ${schemaInfo.path} ${version} doesn't match the version recorded in the inventory ${schemaInfo.version}.`);
    }
    
    
    if (!schemaInfo.released) 
      schemaInfo.comment = "Working Copy";

    if (repoInventory[schemaInfo.name] == undefined) {
      repoInventory[schemaInfo.name] = [];
    }
    repoInventory[schemaInfo.name].push(schemaInfo);
  }

  return repoInventory;
}

/**
 * Merges the existingInventory into the repoInventory object. The inventory JSON file is produced
 * from the repoInventory after this merge takes place. The existingInventory contains the schema 
 * information previously produced by generateInventory.
 * @param {*} repoInventory The current inventory generated from the BIS schemas reposository.
 * @param {*} existingInventory A previously generated inventory of the BIS schemas repository.
 */
function mergeExistingInventoryIntoRepoInventory(repoInventory, existingInventory) {
  for (const key in existingInventory) {
    const existingSchemas = existingInventory[key];
    for (const existingSchema of existingSchemas) {
      mergeExistingInventorySchemaIntoNewInventory(repoInventory, existingSchema);
    }
  }
}

/**
 * Merges the schema information in the provided bisChecksumDump into the repoInventory. 
 * @param {*} repoInventory The inventory of schema in the BIS schemas repository.
 * @param {*} bisChecksumDump The schema information obtained from the BIS schemas checksum WIKI page.
 */
function mergeBisChecksumDump(repoInventory, bisChecksumDump) {
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

    // Always assume schema from checksum dump is released
    schemaChecksum.released = true;

    // Merge checksum info from bis checksum wiki into the list of schemas in the bis-schemas repo
    mergeExistingInventorySchemaIntoNewInventory(repoInventory, schemaChecksum);
  }
}

/**
 * After the new schema inventory is created this method updates unset values to default values.
 * @param {*} inventory A newly created schema inventory (previous inventory merged with repository inventory)
 */
function cleanupInventoryEntries(inventory) {
  for (const [, schemaInfos] of Object.entries(inventory)) {
    for (const schema of schemaInfos) {
      if (!schema.path) {
        if (!schema.comment && schema.approved !== "Yes") 
          schema.comment = "Known Bad";
      continue;
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
}

function mergeExistingInventorySchemaIntoNewInventory(repoInventory, existingSchema) {
  // Merge existing info into the list of schemas in the bis-schemas repo
  const repoSchemas = repoInventory[existingSchema.name];
  if (undefined === repoSchemas || null === repoSchemas) {
    repoInventory[existingSchema.name] = [{...existingSchema}];
    return;
  }

  let inventoryMerged = false;
  for (const repoSchema of repoSchemas) {
    if (repoSchema.version === existingSchema.version && repoSchema.released === existingSchema.released) {
      Object.assign (repoSchema, existingSchema);
      inventoryMerged = true;
    }
  }

  if (!inventoryMerged) {
    repoSchemas.push (existingSchema);
  }
}

function getSchemaVersion(bisRootDir, schemaPath) {
  const fullPath = path.join(bisRootDir, schemaPath);
  const schemaXml = fs.readFileSync(fullPath).toString();
  const versionMatch = schemaXml.match(/<ECSchema .*version="(?<read>\d+)\.(?<write>\d+)(\.(?<patch>\d+))?/);
  if (!versionMatch || !versionMatch.groups.read || !versionMatch.groups.write) {
    throw new Error(`Could not find version in schema xml for file ${schemaPath}`);
  }

  return !versionMatch.groups.patch ? createVersion (versionMatch.groups.read, "0", versionMatch.groups.write) : createVersion (versionMatch.groups.read, versionMatch.groups.write, versionMatch.groups.patch);
}

module.exports = {generateInventory, createBaseInventory, mergeBisChecksumDump, mergeExistingInventoryIntoRepoInventory, cleanupInventoryEntries};