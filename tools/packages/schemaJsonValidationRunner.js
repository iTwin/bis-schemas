/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

"use strict";

const path = require("path");
const fs = require("fs");
const readdirp = require("readdirp");
const argv = require("yargs").argv;
const chalk = require("chalk");

const SchemaContext = require("@bentley/ecschema-metadata").SchemaContext;
const Schema = require("@bentley/ecschema-metadata").Schema;
const createSchemaJson = require("./schemaJsonCreator").createSchemaJson;
const SchemaComparison = require("@bentley/schema-comparer").SchemaComparison;
const SchemaXmlFileLocater = require("@bentley/native-schema-locater").SchemaXmlFileLocater;
const ComparisonResultType = require("@bentley/schema-comparer").ComparisonResultType;

const releasedSchemaPaths = getReleasedSchemaFolders(path.join(__dirname, "../../"))
const allSchemaPaths = getAllSchemaFolders(path.join(__dirname, "../../"));

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

// Add the name(s) of schemas that should be skipped from schema differencing.
const excludedSchemaNames = [
];

async function compareSchemas() {
  const excludeSchemas = getExcludeSchemaList();
  const schemas = await getAllSchemas();
  let hasErrors = false;

  const outputPath = getOutputPath();
  console.log(chalk.default.yellow("\nSchema JSON Comparison logs will be generated under " + outputPath));
  
  for (const schemaInfo of schemas) {
    if(shouldExcludeSchema(schemaInfo, excludeSchemas)) {
      console.log(chalk.default.yellow(`\nSkipping excluded schema ${schemaInfo.name}`));
      continue;
    }

    console.log(`\n***** Schema ${schemaInfo.name} JSON Comparison Results *****`);
    console.log(`Schema file path: ${schemaInfo.fullPath}`);
    
    const fullOutputPath = path.join(outputPath, path.basename(schemaInfo.fullPath, ".xml").replace(".ecschema", ""));
    if (!fs.existsSync(fullOutputPath))
      fs.mkdirSync(fullOutputPath);

    // This method create the json file but returns the deserialized XML schema used to create the JSON (for testing performance)
    const xmlSchema = await createSchemaJson(schemaInfo, fullOutputPath);

    const fileName = schemaInfo.name + ".ecschema.json";
    const fullJsonPath = path.join(fullOutputPath, fileName);
    const schemaJson = JSON.parse(fs.readFileSync(fullJsonPath));

    const context = new SchemaContext();
    let referencePaths = /released/i.test(schemaInfo.fullPath) ? releasedSchemaPaths : allSchemaPaths;
    configureFileLocater(context, await referencePaths);

    const jsonSchema = Schema.fromJsonSync(schemaJson, context);

    const results = await SchemaComparison.compareLoadedSchemas(xmlSchema, jsonSchema, fullOutputPath);
    if (processResults(results))
      hasErrors = true;
  }

  if (hasErrors) {
    throw new Error("BIS-SCHEMAS schema JSON difference runner reported errors.  See above logs for details.");
  }
}

function processResults(results) {
  if (!results || (results.length === 1) && results[0].resultType === ComparisonResultType.Message) {
    console.log(chalk.default.green("Schema JSON comparison succeeded. No differences found."));
    return false;
  }

  const errors = results.filter((value) => value.resultType === ComparisonResultType.Error);
  if (errors.length > 0) {
    reportError("An error occured comparing schemas. Please see logs for details.");
    errors.forEach((error) => {
      reportError(error.resultText);
    });
    return true;
  }

  reportWarning("Schema differences were found. Please see logs for details");

  return false;
}

function reportError(message) {
  console.log(chalk.default.red(`\"##vso[task.logissue type=error]${message}\"`));
}

function reportWarning(message) {
  console.log(chalk.default.yellow(`\"##vso[task.logissue type=warning]${message}\"`));
}

async function getAllSchemas() {
  const bisRoot = getBisRootPath();
  const allSchemas = await readdirp.promise(bisRoot, {fileFilter: "*.ecschema.xml", directoryFilter: ["!docs", "!node_modules", "!tools", "!.vscode", "!cmaps", "!Deprecated", "!test"]});

  const schemas = new Set();
  for (const entry of allSchemas) {
    const schemaInfo = {
      name: entry.basename.match(/\w+/)[0], 
      fullName: entry.basename.match(/\w+(\.\d+\.\d+\.\d+)?/)[0],
      path: entry.path, 
      fullPath: entry.fullPath,
      released: entry.path.includes("Released"), 
      version: /\d+\.\d+\.\d+/.test(entry.basename) ? entry.basename.match(/\d+\.\d+\.\d+/)[0] : ""
    };

    if (!schemas.has(schemaInfo)) {
      schemas.add(schemaInfo);
    }
  }

  return schemas;
}

function isExcludeSchema(schemaName) {
  const match = schemaName.match(/\w+/);
  const name = match ? match[0] : "";

  return excludedSchemaNames.includes(name);
}

function getBisRootPath() {
  const bisRootPath = argv.BisRoot || path.join(__dirname, "../../");

  if (!fs.existsSync(bisRootPath)) {
    throw Error("Could not find BIS root path.")
  }

  return bisRootPath;
}

function getOutputPath() {
  let outputPath = argv.OutDir;
  
  if (!outputPath) {
    outputPath = path.join(__dirname, "../../", "testOut", "JsonComparisonResults");
    if (!fs.existsSync(outputPath))
      fs.mkdirSync(outputPath, { recursive: true });
  }

  if (!fs.existsSync(outputPath)) {
    throw Error("Could not find schema JSON comparison results output path.");
  }

  return outputPath;
}

async function getReleasedSchemaFolders(schemaDirectory) {
  const filter = { fileFilter: "*.ecschema.xml", directoryFilter: ["!node_modules", "!.vscode", "!tools", "!test"] };
  const allSchemaDirs = (await readdirp.promise(schemaDirectory, filter)).map((schemaPath) => path.dirname(schemaPath.fullPath));
  return Array.from(new Set(allSchemaDirs.filter((schemaDir) => /released/i.test(schemaDir))).keys());
}

async function getAllSchemaFolders(schemaDirectory) {
  const filter = { fileFilter: "*.ecschema.xml", directoryFilter: ["!node_modules", "!.vscode", "!tools", "!test"] };
  const allSchemaDirs = (await readdirp.promise(schemaDirectory, filter)).map((schemaPath) => path.dirname(schemaPath.fullPath));
  return allSchemaDirs;
}

async function configureFileLocater(schemaContext, referencePaths) {
  const xmlSchemaLocater = new SchemaXmlFileLocater();
  schemaContext.addLocater(xmlSchemaLocater);
  xmlSchemaLocater.addSchemaSearchPaths(referencePaths);
  return xmlSchemaLocater;
}

function getExcludeSchemaList() {
  const fullPath = path.resolve(__dirname, "../../ignoreSchemaList.json")
  if (!fs.existsSync(fullPath))
    return;

  let rawdata = fs.readFileSync(fullPath);
  let schemas = JSON.parse(rawdata);
  return schemas;
}

function shouldExcludeSchema(schema, excludeList) {
  if (argv.name) {
    return argv.name !== schema.name;
  } 

  if (!excludeList)
    return false;

  const matches = excludeList.filter((s) => s.name === schema.name);
  if (matches.length === 0)
    return false;

  if (matches.some((s) => s.version === "*"))
    return true;

  if (!schema.version)
    return true;

  if (matches.some((s) => s.version === schema.version))
    return true;

  return false;
}

compareSchemas();
