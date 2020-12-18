/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

"use strict";

const fs = require("fs");
const path = require("path");
const readdirp = require("readdirp");

const SchemaDeserializer = require("@bentley/native-schema-locater").SchemaDeserializer;
const SchemaContext = require("@bentley/ecschema-metadata").SchemaContext;

const releasedSchemaPaths = getReleasedSchemaFolders(path.join(__dirname, "../../"))
const allSchemaPaths = getAllSchemaFolders(path.join(__dirname, "../../"));

/**
 * Creates a schema from the specified XML schema.
 * @param schemaInfo Object containing schema information.
 * @param outDir The directory in which to create the JSON file.
 * @returns The deserialized XML Schema used to create the JSON file.
 */
async function createSchemaJson(schemaInfo, outDir) {
  const schema = await deserializeXmlSchema(schemaInfo.path);
  const fileName = schemaInfo.name + ".ecschema.json";
  const outputPath = path.join(outDir, fileName);
  fs.writeFileSync(outputPath, JSON.stringify(schema.toJSON()));
  return schema;
}

/**
 * Deserializes an XML Schema from the file system
 * @param schemaPath The path to the schema XML file.
 */
async function deserializeXmlSchema(schemaPath) {
  const context = new SchemaContext();
  const deserializer = new SchemaDeserializer();
  let referencePaths = /released/i.test(schemaPath) ? releasedSchemaPaths : allSchemaPaths;
  return await deserializer.deserializeXmlFile(schemaPath, context, await referencePaths);
}

/**
 * Get a list of all released schema directories (typically used for reference search paths).
 * @param schemaDirectory Root directory path of bis-schemas
 * @returns List of released schema directory paths
 */
async function getReleasedSchemaFolders(schemaDirectory) {
  const filter = { fileFilter: "*.ecschema.xml", directoryFilter: ["!node_modules", "!.vscode", "!tools", "!test"] };
  const allSchemaDirs = (await readdirp.promise(schemaDirectory, filter)).map((schemaPath) => path.dirname(schemaPath.fullPath));
  return Array.from(new Set(allSchemaDirs.filter((schemaDir) => /released/i.test(schemaDir))).keys());
}

/**
 * Get a list of all schema directories (typically used for reference search paths).
 * @param schemaDirectory Root directory path of bis-schemas
 * @returns List of schema directory paths
 */
async function getAllSchemaFolders(schemaDirectory) {
  const filter = { fileFilter: "*.ecschema.xml", directoryFilter: ["!node_modules", "!.vscode", "!tools"] };
  const allSchemaDirs = (await readdirp.promise(schemaDirectory, filter)).map((schemaPath) => path.dirname(schemaPath.fullPath));
  return allSchemaDirs;
}

module.exports = {createSchemaJson};