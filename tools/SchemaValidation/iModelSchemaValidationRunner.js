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
const getResults = require("@bentley/imodel-schema-validator").getResults;
const StubSchemaXmlFileLocater = require("@bentley/ecschema-locaters").StubSchemaXmlFileLocater;
const SnapshotDb = require("@bentley/imodeljs-backend").SnapshotDb;
const IModelHost = require("@bentley/imodeljs-backend").IModelHost;
const BackendRequestContext = require("@bentley/imodeljs-backend").BackendRequestContext;
const DbResult = require("@bentley/bentleyjs-core").DbResult;

const bisSchemaRepo = getBisRootPath();
const tempDir = process.env.TMP;
const iModelDir = path.join(tempDir, "SchemaValidation", "Briefcases", "validation");
const iModelName = "testimodel";
const exportDir = path.join(iModelDir, iModelName, "exported");
const outputDir = path.join(iModelDir, iModelName, "logs");
const ignoreFile = path.join(bisSchemaRepo, "ignoreSchemaList.json");
const snapshotJson = path.join(bisSchemaRepo, "snapshotInformation.json");

async function validateIModelSchemas() {
  const dir = path.join(iModelDir, iModelName);
  if (fs.existsSync(dir))
    rimraf.sync(dir);
  
  const output = getOutputPath();  
  let ignoreList = JSON.parse(fs.readFileSync(ignoreFile).toString());
  Logger.initializeToConsole();
  Logger.setLevelDefault(LogLevel.Error);

  if (argv.multiSchema) {
    await validateMultiSchema(output, argv.multiSchema);
    return;
  }

  if (argv.compareSnapshot || argv.generateSnapshot) {
    if (argv.compareSnapshot) {
      const snapshot = await prepareSnapshot();
      await compareSnapshotsInfo(JSON.stringify(snapshot.previousInfo, null, 2), JSON.stringify(snapshot.currentInfo, null, 2));
    } else {
      const snapshot = await prepareSnapshot();
      await createSnapshotJson(JSON.stringify(snapshot.currentInfo, null, 2), bisSchemaRepo);
    }
    return;
  }

  if (argv.schemaUpgradeTesting) {
    let checkAllVersions = false;
    if (argv.checkAllVersions)
      checkAllVersions = argv.checkAllVersions;

    await schemaUpgradeTest(ignoreList, output, checkAllVersions);
  } else {
    if (argv.released || !argv.wip)
      await validateReleasedSchemas(ignoreList, argv.released, output);
  
    if (argv.wip || !argv.released)
      await validateWipSchemas(ignoreList, argv.wip, output);
  }
}

async function schemaUpgradeTest(ignoreList, output, checkAllVersions) {
  deleteOldLogFile(output);
  const releasedSchemas = await generateReleasedSchemasList(bisSchemaRepo);
  const wipSchemas = await generateWIPSchemasList(bisSchemaRepo);
  const testSchemas = getShortListedVersions(releasedSchemas.reverse(), wipSchemas, output, checkAllVersions);

  let schemaDirs = await generateSchemaDirectoryList(bisSchemaRepo);
  schemaDirs = schemaDirs.concat(wipSchemas.map((schemaPath) => path.dirname(schemaPath)));

  let imodel;
  let previousSchema;

  for (const releasedSchema of testSchemas) {
    await IModelHost.startup();
    console.log("\nSchema: " + releasedSchema);
    writeLogsToFile(`\nSchema:  ${releasedSchema}\n`, output);
  
    const key = getSchemaInfo(releasedSchema);
    const schemaName = getVerifiedSchemaName(key.name, releasedSchema);
    const schemaVersion = getVersionString(key.readVersion, key.writeVersion, key.minorVersion);

    if (excludeSchema(schemaName, schemaVersion, ignoreList)) {
      await IModelHost.shutdown();
      continue;
    }

    imodel = await importAndExportSchemaToIModel(schemaName, previousSchema, releasedSchema, schemaDirs, imodel, output);
    console.log("-> ", chalk.default.green(`${schemaName}.${schemaVersion} successfully imported.`));
    writeLogsToFile(`-> ${schemaName}.${schemaVersion} successfully imported.\n\n`, output);
    previousSchema = schemaName;
  }
}

async function validateReleasedSchemas(ignoreList, singleSchemaName, output) {
  console.log(chalk.default.yellow("\nPerforming iModel Schema Validation on Released Schemas"));

  const results = [];
  const schemaDirectories = await generateSchemaDirectoryList(bisSchemaRepo);
  const schemaList = findLatestReleasedVersion(await generateReleasedSchemasList(bisSchemaRepo));
  const outputLogs = path.join(output, "released");

  for (const schemaPath of schemaList) {
    const key = getSchemaInfo(schemaPath);
    const schemaName = getVerifiedSchemaName(key.name, schemaPath);
    const schemaVersion = getVersionString(key.readVersion, key.writeVersion, key.minorVersion);

    if (singleSchemaName && singleSchemaName !== true) {
      if (singleSchemaName !== schemaName)
        continue;
    } else if (excludeSchema(schemaName, schemaVersion, ignoreList)) {
      continue;
    }

    console.log("\nValidating Released Schema: " + schemaPath);

    await importAndExportSchema(schemaPath, schemaDirectories);

    const result = await verifyIModelSchema(exportDir, path.basename(schemaPath), false, bisSchemaRepo, outputLogs);
    results.push(result);
  }

  getResults(results, bisSchemaRepo, outputLogs);
}

async function validateWipSchemas(ignoreList, singleSchemaName, output) {
  console.log(chalk.default.yellow("\nPerforming iModel Schema Validation on Work In Progress Schemas"));

  const results = [];
  let schemaList = await generateWIPSchemasList(bisSchemaRepo);
  let schemaDirectories = await generateSchemaDirectoryList(bisSchemaRepo);
  const outputLogs = path.join(output, "wip");

  // Add WIP schema folders
  schemaDirectories = schemaDirectories.concat(schemaList.map((schemaPath) => path.dirname(schemaPath)));

  for (const schemaPath of schemaList) {
    const key = getSchemaInfo(schemaPath);
    const schemaName = getVerifiedSchemaName(key.name, schemaPath);
    const schemaVersion = getVersionString(key.readVersion, key.writeVersion, key.minorVersion);

    if (singleSchemaName && singleSchemaName !== true) {
      if (singleSchemaName !== schemaName)
        continue;
    } else if (excludeSchema(schemaName, schemaVersion, ignoreList)) {
      continue;
    }

    console.log("\nValidating Work In Progress Schema: " + schemaPath);

    await importAndExportSchema(schemaPath, schemaDirectories);

    const schemaXMLFile = generateSchemaXMLName(schemaName, schemaVersion);
    const validationResult = { name: schemaName, version: "" };
    await validateSchema(schemaName, "wip", path.join(exportDir, schemaXMLFile), schemaDirectories, validationResult, outputLogs);
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
  await IModelHost.startup();
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
  const wipLogs = path.join(outputDir, "logs", "wip");
  const releasedLogs = path.join(outputDir, "logs", "released");
  const outputFile = path.join(outputDir, iModelName + ".bim");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(exportSchemaDir);
    fs.mkdirSync(wipLogs, { recursive: true });
    fs.mkdirSync(releasedLogs, { recursive: true });
  }

  if (fs.existsSync(outputFile)) {
    rimraf.sync(outputFile);
  }

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
  const filter = { fileFilter: "*.ecschema.xml", directoryFilter: ["!node_modules", "!.vscode", "!tools", "!test"] };
  const allSchemaDirs = (await readdirp.promise(schemaDirectory, filter)).map((schemaPath) => path.dirname(schemaPath.fullPath));
  return Array.from(new Set(allSchemaDirs.filter((schemaDir) => /released/i.test(schemaDir))).keys());
}

/**
 * Generate list of latest released version of schema files
 * @param schemaDirectory Root directory path of bis-schemas
 * @returns List of schema paths with latest released versions
 */
async function generateReleasedSchemasList(schemaDirectory) {
  const filter = { fileFilter: "*.ecschema.xml", directoryFilter: ["!node_modules", "!.vscode", "!tools", "!Deprecated", "!test"] };
  const allSchemaDirs = (await readdirp.promise(schemaDirectory, filter)).map((schemaPath) => schemaPath.fullPath);
  return Array.from(new Set(allSchemaDirs.filter((schemaDir) => /released/i.test(schemaDir))).keys()).sort()
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
  const filter = { fileFilter: "*.ecschema.xml", directoryFilter: ["!node_modules", "!.vscode", "!tools", "!docs", "!Deprecated", "!Released", "!test"] };
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

/**
 * Returns the output path for logs
 */
function getOutputPath() {
  let outputPath;
  if (argv.OutDir){
    outputPath = argv.OutDir;
    if (!fs.existsSync(outputPath)) {
      throw Error("Could not find schema validation output path.");
    } 

    if(argv.wip){
      const wipLogsDir = path.join(outputPath, "wip");
      fs.mkdirSync(wipLogsDir, { recursive: true });
    }

    if(argv.released){
      const releasedLogsDir = path.join(outputPath, "released");
      fs.mkdirSync(releasedLogsDir, { recursive: true });
    }
  } else {
    outputPath = outputDir;
  }
  return outputPath;
}

/**
 * Check if the latest released version of schema is equilent to WIP schema version
 */
function checkIfWipSchemaRequired(previousSchema, latestReleasedVersion, wipSchemas, shortListedVersions, output) {
  const wipSchema = wipSchemas.filter((schema) => schema.endsWith("\\" + previousSchema + ".ecschema.xml"));
  if (wipSchema.length !== 0) {
    const wipSchemaInfo = getSchemaInfo(wipSchema[0]);
    const wipVersion = wipSchemaInfo.version.toString();
    if (wipVersion !== latestReleasedVersion)
      shortListedVersions.push(wipSchema[0]);
    else {
      console.log("-> ", chalk.default.yellow(`${wipSchemaInfo.name}.${wipVersion} wip schema is skipped.`));
      writeLogsToFile(`-> ${wipSchemaInfo.name}.${wipVersion} wip schema is skipped.\n`, output);
    }
  }
}

/**
 * Shortlist schema versions for schema upgrate test
 * @param releasedSchemas List of released schemas
 * @param wipSchemas List of WIP schemas
 * @param checkAllVersions Check to limit the test to read compatible versions or not
 * @returns List of shortlisted schemas that will be tested for schema upgrade.
 */
function getShortListedVersions(releasedSchemas, wipSchemas, output, checkAllVersions) {
  let check = true;
  let latestReleasedVersion;
  let previousSchema;
  let previousVersion;
  let previousReadVersion;
  const shortListedVersions = [];

  for (const releasedSchema of releasedSchemas) {
    const schemaInfo = getSchemaInfo(releasedSchema);
    const schemaName = getVerifiedSchemaName(schemaInfo.name, releasedSchema);
    const schemaVersion = schemaInfo.version.toString();

    if (schemaName !== previousSchema) {
      checkIfWipSchemaRequired(previousSchema, latestReleasedVersion, wipSchemas, shortListedVersions, output);
      latestReleasedVersion = "";
      check = true;
    }

    if (check) {
      latestReleasedVersion = schemaVersion;
      check = false;
    }

    if (previousSchema === schemaName && previousReadVersion !== schemaInfo.readVersion && !checkAllVersions) {
      console.log("-> ", chalk.default.yellow(`${schemaName}.${schemaVersion} released schema is skipped.`));
      writeLogsToFile(`-> ${schemaName}.${schemaVersion} released schema is skipped.\n`, output);
    } else
      shortListedVersions.push(releasedSchema);

    previousSchema = schemaName;
    previousVersion = schemaVersion;
    previousReadVersion = schemaInfo.readVersion;
  }
  return shortListedVersions.sort();
}

/**
 * Import and export schema to an imodel for schema upgrade testing
 */
async function importAndExportSchemaToIModel(schemaName, previousSchema, releasedSchema, schemaDirs, imodel, output) {
  const locater = new StubSchemaXmlFileLocater();
  locater.addSchemaSearchPaths(schemaDirs);
  const loadedSchema = locater.loadSchema(releasedSchema);
  const orderedSchemas = SchemaGraphUtil.buildDependencyOrderedSchemaList(loadedSchema);
  const schemaPaths = orderedSchemas.map((s) => s.schemaKey.fileName);

  const requestContext = new BackendRequestContext();
  if (schemaName !== previousSchema) {
    if (imodel)
      imodel.close();
    const iModelPath = prepareOutputFile();
    imodel = SnapshotDb.createEmpty(iModelPath, { rootSubject: { name: "test-imodel" } });
  }

  let err = "";
  try{
    await imodel.importSchemas(requestContext, schemaPaths);
    imodel.saveChanges();
    imodel.nativeDb.exportSchemas(exportDir);
  } catch (error) {
    err = error;
    writeLogsToFile(`-> Error: ${err}\n`, output);
  }

  await IModelHost.shutdown();
  if (err !== "")
    throw Error(err);
  return imodel;
}

/**
 * Write logs of a schema to a txt file.
 * @param logString It is the message for logging.
 * @param outputDir The directory where output file will go.
 */
function writeLogsToFile(logString, outputDir) {
  const filePath = path.join(outputDir, "SchemaUpgrade-Logs.txt");
  fs.appendFileSync(filePath, logString);
}

/**
 * Delete old log file.
 * @param outputDir The directory where output file will go.
 */
function deleteOldLogFile(outputDir) {
  const filePath = path.join(outputDir, "SchemaUpgrade-Logs.txt");
  if(fs.existsSync(filePath))
    rimraf.sync(filePath);
}

async function validateMultiSchema(output, testJson) {
  if (fs.existsSync(testJson)) {
    const testSchemas = require(testJson);
    await IModelHost.startup();
    const requestContext = new BackendRequestContext();
    const iModelPath = prepareOutputFile();
    const imodel = SnapshotDb.createEmpty(iModelPath, { rootSubject: { name: "test-imodel" } });
    const schemaList = await generateReleasedSchemasList(bisSchemaRepo);
  
    for (const [schemaGroup, schemas] of Object.entries(testSchemas)) {
      console.log(chalk.default.cyan(`\n Importing Schemas defined in group: ${schemaGroup}`));
      for(const testSchema of schemas) {
        const schemaPath = schemaList.find((s) => path.basename(s).startsWith(testSchema));
        if (schemaPath) {
          console.log(`Importing Schema            : ${testSchema}`);
          try {
            await imodel.importSchemas(requestContext, [schemaPath]);
          } catch (error) {
            throw new Error( `Failed to import schema ${testSchema} because ${error.toString()}`);
          }
          console.log(chalk.default.green(`Import successful for Schema: ${testSchema}\n`));
          imodel.saveChanges();
        } else {
          console.log(chalk.default.red(`No released schema was found with name: ${testSchema}\n`));
        }
      }
    }
    console.log(chalk.default.cyan(" Exporting all schemas"));
    imodel.nativeDb.exportSchemas(exportDir);
    imodel.close();
    IModelHost.shutdown();
    console.log(chalk.default.cyan(`\n Results are available at: ${path.dirname(output)}`));
  } else {
    const sampleTestSchemas = {
      "Building schemas": [
        "BuildingDataGroupBase.01.00.00.ecschema.xml",
        "BuildingPhysical.01.00.00.ecschema.xml"
        ],
      "Civil Rail Schemas": [
        "LinearReferencing.02.00.01.ecschema.xml",
        "RoadRailUnits.01.00.00.ecschema.xml",
        "RoadRailAlignment.02.00.01.ecschema.xml",
        "RailPhysical.01.00.00.ecschema.xml"
      ]
    };
    console.log(chalk.default.red(`\n Test Json was not specified or unable to locate it: ${testJson}`));
    console.log(chalk.default.yellow(`Please specify Json with schemas to test e.g. npm run iModelSchemaValidation -- --multiSchema C:\\test.json`));
    console.log(chalk.default.yellow(`Below is a sample json:`));
    console.log(JSON.stringify(sampleTestSchemas, undefined, 4));
    console.log(chalk.default.red(`\n Tests were not executed due to bad arguments.`));
  }
}

/**
 * Prepare the snapshot for the comparison
 */
async function prepareSnapshot() {
  const bisCoreRegex = /\\BisCore.\d\d.\d\d.\d\d.ecschema.xml/;
  const functionalRegex = /\\Functional.\d\d.\d\d.\d\d.ecschema.xml/;
  const schemaDirectories = await generateSchemaDirectoryList(bisSchemaRepo);
  const releasedSchemasList = findLatestReleasedVersion(await generateReleasedSchemasList(bisSchemaRepo));
  const requiredSchemas = releasedSchemasList.filter((schema) => bisCoreRegex.test(schema) || functionalRegex.test(schema));

  if (requiredSchemas.length === 2) {

    for (const schema of requiredSchemas) {
      await importAndExportSchema(schema, schemaDirectories);
    }

    const snapshotIModel = path.join(iModelDir, iModelName, iModelName + ".bim");
    const currentInfo = await getSnapshotInfo(snapshotIModel);
    const previousInfo = require(snapshotJson);

    return {previousInfo, currentInfo};

  } else {
    throw Error ("Snapshot file preparation failed because 'BisCore' or 'Functional' schema not found.");
  }
}

/**
 * Extracts the information from the bim file
 * @param snapshotIModel Path of bim file
 * @returns information of the snapshot imodel
 */
async function getSnapshotInfo(snapshotIModel) {
  const snapshotInfo = [];
  await IModelHost.startup();
  const imodel = SnapshotDb.openFile(snapshotIModel);

  console.log("\nExtracting information from the snapshot...");
  imodel.withPreparedSqliteStatement("SELECT name, type, tbl_name, sql FROM sqlite_master ORDER BY name, tbl_name", (stmt) => {
    while (DbResult.BE_SQLITE_ROW === stmt.step()) {
      const row = stmt.getRow();
      snapshotInfo.push({name: row.name, type: row.type, tableName: row.tbl_name, sql: row.sql});
    }
  });

  imodel.close();
  await IModelHost.shutdown();
  return snapshotInfo;
}

/**
 * Creates the json file having snapshot information
 * @param snapshotInfo Array containing the information
 * @param jsonDir Directory where json file should be created
 */
async function createSnapshotJson(snapshotInfo, jsonDir) {

  const jsonFile = path.join(jsonDir, "snapshotInformation.json");
  if(fs.existsSync(jsonFile)) 
    rimraf.sync(jsonFile);

  fs.writeFileSync(jsonFile, snapshotInfo);
  console.log("New json file successfully created: " + jsonFile);
}

/**
 * Compare the two json files
 * @param previousInfo Old snapshot json information
 * @param currentInfo New snapshot json information 
 */
async function compareSnapshotsInfo(previousInfo, currentInfo) {

  const command = "'npm run iModelSchemaValidation -- --generateSnapshot'";
  if(previousInfo === currentInfo){
    console.log(chalk.default.green("Snapshots are same"));
  } else {
    console.log(chalk.default.red("Snapshots are different"));
    console.log(`Command to regenerate snapshot json: ${chalk.default.yellow(`${command}`)}`);
    throw Error("Snapshot comparison failed");
  }
}

validateIModelSchemas().then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });