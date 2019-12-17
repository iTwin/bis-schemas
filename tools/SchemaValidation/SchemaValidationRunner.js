/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

// This tool is designed to validate all schemas in the bis-schema repository.

"use strict";

const path = require("path");
const readdirp = require("readdirp");
const argv = require("yargs").argv;
const exec = require('child_process').exec
const fs = require("fs");
const ValidationOptions = require(argv.ValidaterPath).ValidationOptions
const ValidationResultType = require(argv.ValidaterPath).ValidationResultType
const SchemaValidator = require(argv.ValidaterPath).SchemaValidator

const standardSchemaNames = [
  "Bentley_Standard_CustomAttributes",
  "Bentley_Standard_Classes",
  "Bentley_ECSchemaMap",
  "EditorCustomAttributes",
  "Bentley_Common_Classes",
  "Dimension_Schema",
  "iip_mdb_customAttributes",
  "KindOfQuantity_Schema",
  "rdl_customAttributes",
  "SIUnitSystemDefaults",
  "Unit_Attributes",
  "Units_Schema",
  "USCustomaryUnitSystemDefaults",
  "ECDbMap",
  "CoreCustomAttributes", // New EC3 Standard Schema
  "ECv3ConversionAttributes", // New EC2 Standard Schema
  "SchemaLocalizationCustomAttributes", // New EC3 Standard Schema
  "Units", // New EC3 Standard Schema
  "Formats", // New EC3 Standard Schema
];

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

async function validateSchemas() {
  const excludeSchemas = getExcludeSchemaList();
  const schemas = await getAllSchemas();
  const allRefPaths = getRefpaths(schemas, false);
  const releasedRefPaths = getRefpaths(schemas, true);
  let hasErrors = false;

  for (const schema of schemas) {
    if (shouldExcludeSchema(schema, excludeSchemas))
      continue;

    console.log("");
    console.log(`***** Schema ${schema.name} Validation Results *****`);
    console.log(`Schema file path: ${schema.fullPath}`);

    const refPaths = schema.released ? releasedRefPaths : allRefPaths;

    const options = new ValidationOptions(schema.fullPath, refPaths, false, argv.OutDir);
    const results = await SchemaValidator.validate(options);

    if (processResults(results))
      hasErrors = true;
  }

  if (hasErrors) {
    throw new Error("BIS-SCHEMAS schema validation runner reported errors.  See above logs for details.");
  }
}

function processResults(results) {
  if (!results || (results.length === 2) && results[1].resultType === ValidationResultType.Message) {
    console.log("Schema Validation Succeeded. No rule violations found.");
    return false;
  }

  let shouldFail = false;

  const errors = results.filter((value) => value.resultType === ValidationResultType.Error);
  if (errors.length > 0) {
    errors.forEach((error) => {
      reportError(error.resultText);
    });
    shouldFail = true;
  }

  const violations = results.filter((value) => value.resultType === ValidationResultType.RuleViolation);
  if (violations.length > 0) {
    violations.forEach((violation) => {
      const resultText = violation.resultText.trim();
      if (resultText.startsWith("Warning")) {
        reportWarning(resultText);
      } else {
        reportError(resultText);
        shouldFail = true;
      }
    });
  }

  return shouldFail;
}

function reportError(message) {
  console.log(`\"##vso[task.logissue type=error]${message}\"`);
}

function reportWarning(message) {
  console.log(`\"##vso[task.logissue type=warning]${message}\"`);
}

function getRefpaths(schemas, releasedOnly) {
  const referencePaths = [];
  for (const schema of schemas) {
    if (releasedOnly && schema.released === false)
      continue;
    const dir = path.dirname(schema.fullPath);
    if (!referencePaths.includes(dir))
      referencePaths.push(dir);
  }

  return referencePaths;
}


async function getAllSchemas() {
  const allSchemas = await readdirp.promise(argv.BisRoot, {fileFilter: "*.ecschema.xml", directoryFilter: ["!docs", "!node_modules", "!tools", "!.vscode", "!cmaps"]});

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

function shouldExcludeSchema(schema, excludeList) {
  if (isStandardSchema(schema.name)) {
    return true;
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

function getExcludeSchemaList() {
  const fullPath = path.resolve(__dirname, "../../ignoreSchemaList.json")
  if (!fs.existsSync(fullPath))
    return;

  let rawdata = fs.readFileSync(fullPath);
  let schemas = JSON.parse(rawdata);
  return schemas;
}

function isStandardSchema(schemaName) {
  const match = schemaName.match(/\w+/);
  const name = match ? match[0] : "";

  return standardSchemaNames.includes(name);
}

validateSchemas();