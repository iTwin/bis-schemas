// This tool is designed to validate all schemas in the bis-schema repository.

"use strict";

const path = require("path");
const fs = require("fs");
const readdirp = require("readdirp");
const argv = require("yargs").argv;
const chalk = require("chalk");
const SchemaComparison = require("@bentley/schema-comparer").SchemaComparison;
const CompareOptions = require("@bentley/schema-comparer").CompareOptions;
const ComparisonResultType = require("@bentley/schema-comparer").ComparisonResultType;

// Add the name(s) of schemas that should be skipped from schema differencing.
const excludedSchemaNames = [
];


// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

async function compareSchemas() {
  const schemas = await getAllSchemas();
  const refPaths = getRefpaths(schemas)
  let hasErrors = false;

  const outputPath = getOutputPath();
  console.log(chalk.default.yellow("\nSchema Comparison logs will be generated under " + outputPath));
  
  for (const schema of schemas) {
    if (schema.released)
      continue;

    if(argv.name) {
      if(argv.name !== schema.name)
        continue;
    } else if (isExcludeSchema(schema.name)) {
      console.log(chalk.default.yellow(`\nSkipping excluded schema ${schema.name}`));
      continue;
    }

    console.log(`\n***** Schema ${schema.name} Comparison Results *****`);
    console.log(`Schema file path: ${schema.fullPath}`);

    const releasedSchema = findLatestReleasedSchema(schema, schemas);
    if (!releasedSchema) {
      console.log(chalk.default.yellow(`No released schema found. Skipping comparison.`));
      continue;
    }

    console.log(`Found latest ${schema.name} schema at ${releasedSchema.fullPath}.`)

    
    const options = new CompareOptions(releasedSchema.fullPath, schema.fullPath, refPaths, refPaths, outputPath);
    const results = await SchemaComparison.compare(options);
    if (processResults(releasedSchema, schema, results))
      hasErrors = true;
  }

  if (hasErrors) {
    throw new Error("BIS-SCHEMAS schema difference runner reported errors.  See above logs for details.");
  }
}

function processResults(releasedSchema, schema, results) {
  if (!results || (results.length === 2) && results[1].resultType === ComparisonResultType.Message) {
    console.log(chalk.default.green("Schema comparison succeeded. No differences found."));
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

  if (0 <= versionCompare(schema.version, releasedSchema.version)) {
    reportError(`Schema version ${schema.version} must be greater than the latest release version ${releasedSchema.version}`);
    return true;
  }

  return false;
}

function reportError(message) {
  console.log(chalk.default.red(`\"##vso[task.logissue type=error]${message}\"`));
}

function reportWarning(message) {
  console.log(chalk.default.yellow(`\"##vso[task.logissue type=warning]${message}\"`));
}

function getRefpaths(schemas) {
  const referencePaths = [];
  for (const schema of schemas) {
    const dir = path.dirname(schema.fullPath);
    if (referencePaths.includes(dir))
      continue;

    if (schema.released)
      referencePaths.unshift(dir)
    else
      referencePaths.push(dir);
  }

  return referencePaths;
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

function findLatestReleasedSchema(schema, schemas) {
  const candidates = [];
  for (const current of schemas) {
    if (!current.released || current.name != schema.name)
      continue;
    candidates.push(current);
  }

  if (candidates.length === 0)
    return undefined;

  let maxIndex = 0;
  for (let i = 1; i < candidates.length; i++) {
    if (0 <= versionCompare(candidates[i].version, candidates[maxIndex].version))
      maxIndex = i;
  }
  return candidates[maxIndex];
}

function versionCompare(version1, version2) {
  const [read1, write1, minor1] = version1.split(".");
  const [read2, write2, minor2] = version2.split(".");

  const dRead = +read1 - +read2;
  const dWrite = +write1 - +write2;
  const dMinor = +minor1 - +minor2;

  if (dRead !== 0)
    return dRead;
  if (dWrite != 0)
    return dWrite;
  
  return dMinor;
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
    outputPath = path.join(__dirname, "../../", "testOut", "ComparisonResults");
    if (!fs.existsSync(outputPath))
      fs.mkdirSync(outputPath, { recursive: true });
  }

  if (!fs.existsSync(outputPath)) {
    throw Error("Could not find schema comparison results output path.");
  }

  return outputPath;
}

compareSchemas();