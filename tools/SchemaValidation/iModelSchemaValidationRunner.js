/*---------------------------------------------------------------------------------------------
* Copyright (c) 2020 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

// This tool is designed to validate all schemas in the bis-schema repository.

"use strict";

const path = require("path");
const readdirp = require("readdirp");
const argv = require("yargs").argv;
const fs = require("fs");
const rimraf = require("rimraf");
const chalk = require("chalk");
const Logger = require("@bentley/bentleyjs-core").Logger;
const LogLevel = require("@bentley/bentleyjs-core").LogLevel;
const SchemaGraphUtil = require("@bentley/ecschema-metadata").SchemaGraphUtil;
const validateSchema = require("@bentley/imodel-schema-validator").validateSchema;
const verifyIModelSchema = require("@bentley/imodel-schema-validator").verifyIModelSchema;
const iModelValidationResultTypes = require("@bentley/imodel-schema-validator").iModelValidationResultTypes;
const displayResults = require("@bentley/imodel-schema-validator").displayResults;
const StubSchemaXmlFileLocater = require("@bentley/ecschema-locaters").StubSchemaXmlFileLocater;
const SnapshotDb = require("@bentley/imodeljs-backend").SnapshotDb;
const IModelHost = require("@bentley/imodeljs-backend").IModelHost;
const BackendRequestContext = require("@bentley/imodeljs-backend").BackendRequestContext;

const bisSchemaRepo = getBisRootPath();
const tempDir = process.env.TMP;
const iModelDir = path.join(tempDir, "SchemaValidation", "Briefcases", "validation");
const iModelName = "testimodel";
const exportDir = path.join(iModelDir, iModelName, "exported");
const outputDir = path.join(iModelDir, iModelName, "logs");
const ignoreFile = path.join(bisSchemaRepo, "ignoreSchemaList.json");

async function validateIModelSchemas() {
  let ignoreList = JSON.parse(fs.readFileSync(ignoreFile).toString());
  Logger.initializeToConsole();
  Logger.setLevelDefault(LogLevel.Error);

  if (argv.released || !argv.wip)
    await validateReleasedSchemas(ignoreList, argv.released);
  
  if (argv.wip || !argv.released)
    await validateWipSchemas(ignoreList, argv.wip);
}

async function validateReleasedSchemas(ignoreList, singleSchemaName) {
  console.log(chalk.default.yellow("\nPerforming iModel Schema Validation on Released Schemas"));

  const results = [];
  const schemaDirectories = await generateSchemaDirectoryList(bisSchemaRepo);
  const schemaList = await generateReleasedSchemasList(bisSchemaRepo);

  for (const schemaPath of schemaList) {
    const key = getSchemaInfo(schemaPath);
    const schemaName = getVerifiedSchemaName(key.name, schemaPath);
    const schemaVersion = getVersionString(key.readVersion, key.writeVersion, key.minorVersion);

    if (singleSchemaName) {
      if (singleSchemaName !== schemaName)
        continue;
    } else if (excludeSchema(schemaName, schemaVersion, ignoreList)) {
      continue;
    }

    console.log("\nValidating Released Schema: " + schemaPath);

    await importAndExportSchema(schemaPath, schemaDirectories);

    const result = await verifyIModelSchema(exportDir, path.basename(schemaPath), false, bisSchemaRepo, outputDir);
    results.push(result);
  }

  displayResults(results, bisSchemaRepo);
}

async function validateWipSchemas(ignoreList, singleSchemaName) {
  console.log(chalk.default.yellow("\nPerforming iModel Schema Validation on Work In Progress Schemas"));

  const results = [];
  let schemaList = await generateWIPSchemasList(bisSchemaRepo);
  let schemaDirectories = await generateSchemaDirectoryList(bisSchemaRepo);

  // Add WIP schema folders
  schemaDirectories = schemaDirectories.concat(schemaList.map((schemaPath) => path.dirname(schemaPath)));

  for (const schemaPath of schemaList) {
    const key = getSchemaInfo(schemaPath);
    const schemaName = getVerifiedSchemaName(key.name, schemaPath);
    const schemaVersion = getVersionString(key.readVersion, key.writeVersion, key.minorVersion);

    if (singleSchemaName) {
      if (singleSchemaName !== schemaName)
        continue;
    } else if (excludeSchema(schemaName, schemaVersion, ignoreList)) {
      continue;
    }

    console.log("\nValidating Work In Progress Schema: " + schemaPath);

    await importAndExportSchema(schemaPath, schemaDirectories);

    const schemaXMLFile = generateSchemaXMLName(schemaName, schemaVersion);
    const validationResult = { name: schemaName, version: "" };
    await validateSchema(path.join(exportDir, schemaXMLFile), schemaDirectories, validationResult, outputDir);
    schemaDirectories = fixSchemaValidatorIssue(exportDir, schemaDirectories);
    if (validationResult.validator === iModelValidationResultTypes.Failed || validationResult.validator === iModelValidationResultTypes.Error) {
      results.push(validationResult);
    }
  }

  if (results.length > 0)
    console.log(chalk.default.red("\nWIP Schema validation failed.  Please see logs for more details"));
  else
    console.log(chalk.default.green("\nWIP Schema validation Succeeded"));
}

async function importAndExportSchema(schemaPath, schemaSearchPaths) {
  console.log("\nImporting and Exporting Schema: " + schemaPath);
  IModelHost.startup();
  const locater = new StubSchemaXmlFileLocater();
  locater.addSchemaSearchPaths(schemaSearchPaths);
  const loadedSchema = locater.loadSchema(schemaPath);
  const orderedSchemas = SchemaGraphUtil.buildDependencyOrderedSchemaList(loadedSchema);
  const schemaPaths = orderedSchemas.map((s) => s.schemaKey.fileName);
  const requestContext = new BackendRequestContext();
  const iModelPath = prepareOutputFile();
  const imodel = SnapshotDb.createEmpty(iModelPath, { rootSubject: { name: "test-imodel" } });
  try {
    await imodel.importSchemas(requestContext, schemaPaths);
  } catch (error) {
    throw new Error( `Failed to import schema ${wipSchema} because ${error.toString()}`);
  }
  imodel.saveChanges();
  imodel.nativeDb.exportSchemas(exportDir);
  imodel.close();
  IModelHost.shutdown();
}

/**
 * Prepare output file where imodel will be created
 * @returns Path of bim file
 */
function prepareOutputFile() {
  const outputDir = path.join(iModelDir, iModelName);
  const exportSchemaDir = path.join(outputDir, "exported");
  const logs = path.join(outputDir, "logs");

  if (fs.existsSync(outputDir)) {
    rimraf.sync(outputDir);
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(exportSchemaDir);
  fs.mkdirSync(logs);
  const outputFile = path.join(outputDir, iModelName + ".bim");
  return outputFile;
}

/**
 * Checks if the schema that needs validation is not present in ignore list
 * @param schemaName Name of schema
 * @param schemaVersion Schema version
 * @param excludeList List of schemas present in ignoreSchemaList.json
 * @returns Boolean based upon the decision
 */
function excludeSchema(schemaName, schemaVersion, excludeList) {
  if (!excludeList)
    return false;

  const matches = excludeList.filter((s) => s.name === schemaName);
  if (matches.length === 0)
    return false;

  if (matches.some((s) => s.version === "*"))
    return true;

  if (!schemaVersion)
    return true;

  if (matches.some((s) => s.version === schemaVersion))
    return true;

  return false;
}

/**
 * Get a list of all released schema directories (typically used for reference search paths).
 * @param schemaDirectory Root directory path of bis-schemas
 * @returns List of released schema directory paths
 */
async function generateSchemaDirectoryList(schemaDirectory) {
  const filter = { fileFilter: "*.ecschema.xml", directoryFilter: ["!node_modules", "!.vscode", "!tools"] };
  const allSchemaDirs = (await readdirp.promise(schemaDirectory, filter)).map((schemaPath) => path.dirname(schemaPath.fullPath));
  return Array.from(new Set(allSchemaDirs.filter((schemaDir) => /released/i.test(schemaDir))).keys());
}

/**
 * Generate list of latest released version of schema files
 * @param schemaDirectory Root directory path of bis-schemas
 * @returns List of schema paths with latest released versions
 */
async function generateReleasedSchemasList(schemaDirectory) {
  const filter = { fileFilter: "*.ecschema.xml", directoryFilter: ["!node_modules", "!.vscode", "!tools", "!Deprecated"] };
  const allSchemaDirs = (await readdirp.promise(schemaDirectory, filter)).map((schemaPath) => schemaPath.fullPath);
  return findLatestReleasedVersion(Array.from(new Set(allSchemaDirs.filter((schemaDir) => /released/i.test(schemaDir))).keys()).sort());
}

function getBisRootPath() {
  const bisRootPath = process.env.BisSchemaRepo || path.join(__dirname, "../../");

  if (!fs.existsSync(bisRootPath)) {
    throw Error("Could not find BIS root path.")
  }

  return bisRootPath;
}

/**
 * Generate list of WIP schema files
 * @param schemaDirectory Root directory path of bis-schemas
 * @returns List of schema paths having WIP version
 */
async function generateWIPSchemasList(schemaDirectory) {
  const filter = { fileFilter: "*.ecschema.xml", directoryFilter: ["!node_modules", "!.vscode", "!tools", "!docs", "!Deprecated", "!Released"] };
  const allSchemaDirs = (await readdirp.promise(schemaDirectory, filter)).map((schemaPath) => schemaPath.fullPath);
  return Array.from(new Set(allSchemaDirs.filter((schemaDir) => /.*\.ecschema\.xml/i.test(schemaDir))).keys());
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

/** Gets a schemakey
 * @param schemaXMLFilePath Path of schema XML file
 * @returns Schemakey
 */
function getSchemaInfo(schemaXMLFilePath) {
  const schemaXml = fs.readFileSync(schemaXMLFilePath, "utf-8");
  const locater = new StubSchemaXmlFileLocater();
  return locater.getSchemaKey(schemaXml);
}

/**
 * Verifies schema name using name from schemakey and XML filename
 * @param schemaKeyName Schema name returned by schemakey
 * @param schemaFilePath Complete path to schema XML file
 * @returns Schema name
 */
function getVerifiedSchemaName(schemaKeyName, schemaFilePath) {
  const xmlFileName = getSchemaNameFromFileName(schemaFilePath);
  if (schemaKeyName !== xmlFileName) {
    console.log("schemaName is different in XML content (" + schemaKeyName + ") from XML file name (" + xmlFileName + ").");
    return xmlFileName;
  }
  return schemaKeyName;
}

/**
 * Gets schema name from filename
 * @param schemaFilePath Complete path to schema XML file
 * @returns Schema name
 */
function getSchemaNameFromFileName(schemaFilePath) {
  const schemaName = path.basename(schemaFilePath).split(".")[0];
  return schemaName;
}

/**
 * Create version string of schema
 * @param readVersion Read version of schema
 * @param writeVersion Write version of schema
 * @param minorVersion Minor version of schema
 * @returns Version string of schema
 */
function getVersionString(readVersion, writeVersion, minorVersion) {
  const versionStr = ("0" + readVersion).slice(-2) + "." + ("0" + writeVersion).slice(-2) + "." + ("0" + minorVersion).slice(-2);
  return versionStr;
}

/**
 * Remove schemas having issues from all releasedSchemas list
 * @return Updated releasedSchemas list
 * This function will be removed as soon as we decide some solution for Fasteners and Asset schemas
 */
function removeSchemasFromList(allSchemas, schemasToBeRemoved) {
  schemasToBeRemoved.forEach((issueFile) => {
    const schemaKeyRegex = new RegExp(issueFile);
    allSchemas = allSchemas.filter((schema) => !schemaKeyRegex.test(schema));
  });
  return allSchemas;
}

/**
 * Generate schema xml filename with extension
 * @param schemaName Name of schema
 * @param version Version string of schema
 * @returns Schema XML filename
 */
function generateSchemaXMLName(schemaName, version) {
  const schemaXMLFile = schemaName + "." + version + ".ecschema.xml";
  return schemaXMLFile;
}

/**
 * Remove extra paths added by validator tool to the releasedFolders list
 * @param exportDir Directory where schemas are exported.
 * @param releaseFolders List of released folders
 */
function fixSchemaValidatorIssue(exportDir, releasedFolders) {
  // @bentley/schema-validator is auto pushing the input schema path to reference array.
  // Removing this path to fix the bug in finding releasedSchemaFile otherwise it finds the iModel schema path
  const index = releasedFolders.indexOf(exportDir);
  if (index !== -1) { releasedFolders.splice(index, 1); }
  return releasedFolders;
}

validateIModelSchemas();