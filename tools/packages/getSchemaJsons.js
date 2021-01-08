/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

"use strict";

const fs = require("fs");
const path = require("path");
const argv = require("yargs").argv;
const schemaInventory = require("../../SchemaInventory.json");
const createSchemaJson = require("./schemaJsonCreator").createSchemaJson;

const bisRootPath = path.join(__dirname, "../../");

async function main() {
  if(argv.latestReleasedVersions && argv.OutDir) {
    const outputPath = argv.OutDir;
    if (!fs.existsSync(outputPath)) {
      throw Error("Could not find schema validation output path.");
    }
    await getJsonSchemasOfLatestReleasedVersions(outputPath);
  } else if(argv.allReleasedVersions && argv.OutDir) {
    const outputPath = argv.OutDir;
    if (!fs.existsSync(outputPath)) {
      throw Error("Could not find schema validation output path.");
    }
    await getJsonSchemasOfAllReleasedVersions(outputPath);
  } else {
    throw Error ("Arguments are either incomplete or incorrect.");
  }
}

/**
 * Get json schemas of latest released schema versions
 * @param outputDir Folder path where output jsons will go
 */
async function getJsonSchemasOfLatestReleasedVersions(outputDir) {
  let schemaInfo = { name: "", path: ""}
  const schemaList = findLatestReleasedVersion(await generateReleasedSchemasList(bisRootPath));

  for (const schemaPath of schemaList) {
    if (!fs.existsSync(schemaPath))
      throw Error(`Schema ${schemaPath} does not exist`);
    const schemaName = path.basename(schemaPath).split(".ecschema.xml")[0];
    schemaInfo.name = schemaName;
    schemaInfo.path = schemaPath;
    console.log("\nGenerating json for " + schemaName);
    await createSchemaJson(schemaInfo, outputDir);
  }

}

/**
 * Get json schemas of all released schema versions
 * @param outputDir Folder path where output jsons will go
 */
async function getJsonSchemasOfAllReleasedVersions(outputDir) {
  let schemaInfo = { name: "", path: ""}
  const schemaList = await generateReleasedSchemasList(bisRootPath);

  for (const schemaPath of schemaList) {
    if (!fs.existsSync(schemaPath))
      throw Error(`Schema ${schemaPath} does not exist`);
    const schemaName = path.basename(schemaPath).split(".ecschema.xml")[0];
    schemaInfo.name = schemaName;
    schemaInfo.path = schemaPath;
    console.log("\nGenerating json for " + schemaName);
    await createSchemaJson(schemaInfo, outputDir);
  }

}

/**
 * Generate list of latest released version of schema files
 * @param bisRootPath Path of bis-schemas root
 * @returns Array of released schemas
 */
async function generateReleasedSchemasList(bisRootPath) {
  const releasedSchemas = [];
  for (const group in schemaInventory) {
    for (const schema of schemaInventory[group]) {
      if (schema.hasOwnProperty('path') && schema.released) {
        const completePath = path.join(bisRootPath, schema.path);
        releasedSchemas.push(completePath);
      }
    }
  }
  return releasedSchemas;
}

/**
 * Find latest released version of all schemas
 * @param releasedSchemas list of schemas having all released versions
 * @returns list of latest released versions
 */
function findLatestReleasedVersion(releasedSchemas) {
  const latestReleasedVersions = [];
  for (let index = 0; index < releasedSchemas.length; index++) {
    const schemaNameA = path.basename(releasedSchemas[index]).split(".")[0];
    let schemaNameB = "";
    if (index + 1 < releasedSchemas.length) {
      schemaNameB = path.basename(releasedSchemas[index + 1]).split(".")[0];
    }
    if (schemaNameA !== schemaNameB) {
      latestReleasedVersions.push(releasedSchemas[index]);
    }
  }
  return latestReleasedVersions.reverse();
}

/**
 * Calling Main
 */
main().then().catch((error) => {
  console.error(error);
  process.exit(1);
})