/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

"use strict";

const fs = require("fs");
const path = require("path");
const readdirp = require("readdirp");
const chalkModule = require("chalk");
const chalk = chalkModule.default || chalkModule;
const argv = require("yargs").argv;
const { LocalizationProvider } = require("@itwin/ecschema-metadata");

/**
 * Validate the localization json files
 */
async function validateLocalizationJsons(bisRoot) {
  const inventoryPath = path.join(bisRoot, "SchemaInventory.json");

  if (!fs.existsSync(inventoryPath))
    throw new Error(`SchemaInventory.json not found at ${inventoryPath}`);

  const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));

  for (const schemaName of Object.keys(inventory)) {
    const schemaList = inventory[schemaName];

    if (!Array.isArray(schemaList))
      continue;

    for (const schema of schemaList) {
      if (!schema.localizations || schema.localizations.length === 0)
        continue;

      for (const localization of schema.localizations) {
        console.log(`\nProcessing localization for ${schema.name}.${schema.version} schema '${localization.locale}' locale: ${localization.path}`);
        validateLocalizationPath(schema, localization);
        const localePath = path.join(bisRoot, localization.path);

        const provider = new LocalizationProvider(async (_schemaName, _locale) => {
          if (!fs.existsSync(localePath)) 
            reportError(`Localization file not found: ${localePath}`);

          return JSON.parse(fs.readFileSync(localePath, "utf8"));
        });

        try {
          const loaded = await provider.getLocalization(schema.name, localization.locale);
          if (!loaded)
            reportError(`Localization JSON returned undefined`);
          if (!/^ecschema-localization-v\d+$/.test(loaded.$schema))
            reportError(`Invalid localization JSON for ${schema.name}:${localization.locale} - missing or wrong '$schema'`);
          if (loaded.version !== schema.version)
            reportError(`Localization JSON mismatch for ${schema.name}:${localization.locale} - expected version "${schema.version}" but got "${loaded.version}"`);
          console.log(chalk.green(`-> Validation Succeeded for: ${schema.name}.${schema.version} schema ${localization.locale} locale.`));
        } catch (error) {
          reportError(error.message);
        }
      }
    }
  }
}

/**
 * Validate the localization path
 */
function validateLocalizationPath(schema, localization) {
  const normalized = localization.path.replace(/\\/g, "/");
  const parsed = path.posix.parse(normalized);
  const filename = parsed.base;
  const dirSegments = parsed.dir.split("/").filter(Boolean);
  const parentDir = dirSegments[dirSegments.length - 1];
  const grandParentDir = dirSegments[dirSegments.length - 2];

  if (parentDir !== "Locales")
    reportError(`Invalid localization path for ${schema.name}:${localization.locale} - file must be in a 'Locales' directory but got "${localization.path}"`);

  if (schema.released) {
    if (grandParentDir !== "Released")
      reportError(`Invalid localization path for released schema ${schema.name}:${localization.locale} - file must be under 'Released/Locales/' but got "${localization.path}"`);

    const expected = `${schema.name}.${schema.version}.${localization.locale}.json`;
    if (filename !== expected)
      reportError(`Invalid localization filename for released schema ${schema.name}:${localization.locale} - expected "${expected}" but got "${filename}"`);
  } else {
    if (dirSegments.includes("Released"))
      reportError(`Invalid localization path for WIP schema ${schema.name}:${localization.locale} - file must not be under a 'Released' directory but got "${localization.path}"`);

    const expected = `${schema.name}.${localization.locale}.json`;
    if (filename !== expected)
      reportError(`Invalid localization filename for WIP schema ${schema.name}:${localization.locale} - expected "${expected}" but got "${filename}"`);
  }
}

function reportError(message) {
  throw new Error(`Validation has failed with error: ${message}`);
}

/**
 * Get the repository root
 */
function getBisRootPath() {
  const bisRootPath = argv.BisRoot || path.join(__dirname, "../../");

  if (!fs.existsSync(bisRootPath))
    throw new Error("Could not find BIS root path.");

  return bisRootPath;
}

module.exports = { validateLocalizationJsons };

if (require.main === module) {
  const bisRoot = getBisRootPath();
  validateLocalizationJsons(bisRoot);
}
