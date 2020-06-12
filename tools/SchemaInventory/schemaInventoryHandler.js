/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

"use strict";

const fs = require("fs-extra");
const readdirp = require("readdirp");
const path = require("path");
const computeSchemaChecksum = require("./computeSchemaChecksum");

async function validateSchemaInventory() {
  const bisRootDir = getBisRootPath();
  const existingInventoryPath = getInventoryPath();

  // Read existing inventory from file system
  const existingInventory = JSON.parse(fs.readFileSync(existingInventoryPath));

  // Create schema inventory from bis-schemas repository
  const repoInventory = await createRepositoryInventory(bisRootDir);

  const missingSchemas = [];

  for (const [name, schemaInfos] of Object.entries(repoInventory)) {
    const inventorySchemas = existingInventory[name];
    
    for (const schema of schemaInfos) {
      if (!schemaExistsInInventory(schema, inventorySchemas))
        missingSchemas.push(schema.path);
    }
  }

  if (missingSchemas.length > 0)
    throw new Error("SchemaInventory.json out of date. Run 'npm run updateSchemaInventory' in bis-schemas to update the inventory and check in the updated inventory. Missing schemas: " + missingSchemas.join(", "));
}

async function updateSchemaInventory() {
  const bisRootDir = getBisRootPath();
  const existingInventoryPath = getInventoryPath();

  // Read existing inventory from file system
  const existingInventory = JSON.parse(fs.readFileSync(existingInventoryPath));

  // Create schema inventory from bis-schemas repository
  const repoInventory = await createRepositoryInventory(bisRootDir);

  // get all possible reference directories (used for new released schema checksum generation)
  const schemaDirectories = await generateSchemaDirectoryLists(bisRootDir);

  let newEntries = false;
  for (const [name, schemaInfos] of Object.entries(repoInventory)) {
    const inventorySchemas = existingInventory[name];
    
    for (const schema of schemaInfos) {
      if (schemaExistsInInventory(schema, inventorySchemas))
        continue;

      newEntries = true;
      
      // Sets Sha1 and other release schema fields
      if (schema.released)
        await updateNewReleasedSchemaEntry(schema, schemaDirectories, bisRootDir);

      if (undefined === inventorySchemas || null === inventorySchemas) {
        existingInventory[schema.name] = [{...schema}];
        continue;
      }

      // Schema(s) with this name exist in inventory, so if new 
      // release schema, add entry and continue
      if (schema.released) {
        inventorySchemas.push(schema);
        continue;
      }

      // Handle WIP schemas
      let inventoryMerged = false;
      for (const inventorySchema of inventorySchemas) {
        if (inventorySchema.released)
          continue;
        // Existing WIP found, so replace with new
        Object.assign (inventorySchema, schema);
        inventoryMerged = true;
      }

      // No existing WIP schema found so push new WIP schema
      if (!inventoryMerged)
        inventorySchemas.push(schema);
    }
  }

  if (newEntries) {
    cleanupInventoryEntries(existingInventory);
    fs.writeFileSync(existingInventoryPath, JSON.stringify(existingInventory, null, 2));
  }
}

async function createRepositoryInventory(bisRootDir) {
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

async function updateNewReleasedSchemaEntry(schema, schemaDirectories, bisRootDir) {
  const sha1 = computeSchemaChecksum(schema, bisRootDir, schemaDirectories);
  const date = new Date();
  
  schema.comment = "";
  schema.verifier = "";
  schema.sha1 = sha1;
  schema.verified = "No";
  schema.author = require("os").userInfo().username;
  schema.date = date.toLocaleDateString('en-US');
  schema.dynamic = "No";
  schema.approved = "No";
}

function schemaExistsInInventory(schema, inventorySchemas) {
  if (!inventorySchemas)
    return false;

  for (const inventorySchema of inventorySchemas) {
    if (inventorySchema.version === schema.version && inventorySchema.released === schema.released) {
      return true;
    }
  }
  return false;
}

async function generateSchemaDirectoryLists(schemaDirectory) {
  const filter = { fileFilter: "*.ecschema.xml", directoryFilter: ["!node_modules", "!.vscode"] };
  const allSchemaDirs = (await readdirp.promise(schemaDirectory, filter)).map((schemaPath) => path.dirname(schemaPath.fullPath));
  return Array.from(new Set(allSchemaDirs.filter((schemaDir) => /released/i.test(schemaDir))).keys());
}

function getBisRootPath() {
  const bisRootPath = process.env.BisRootPath || path.join(__dirname, "../..");

  if (!fs.pathExistsSync(bisRootPath)) {
    throw Error("Could not find BIS root path.")
  }

  return bisRootPath;
}

function getInventoryPath() {
  const partialPath = process.env.InventoryPath || path.join(__dirname, "../..");
  let inventoryPath = path.join(partialPath, "SchemaInventory.json");
  if (!fs.existsSync(inventoryPath)) {
    throw Error("Could not find SchemaInventory.json.");
  }

  return inventoryPath;
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

/**
 * After the new schema inventory is created this method updates unset values to default values.
 * @param {*} inventory A newly created schema inventory (previous inventory merged with repository inventory)
 */
function cleanupInventoryEntries(inventory) {
  for (const [, schemaInfos] of Object.entries(inventory)) {
    for (const schema of schemaInfos) {
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

function zeroPad (digit) {
  if (1 === digit.length)
    return '0' + digit;
  return digit;
}

function createVersion(vRead, vWrite, vPatch) {
  return zeroPad(vRead) + "." + zeroPad(vWrite) + "." + zeroPad(vPatch);
}

module.exports = {updateSchemaInventory, validateSchemaInventory};