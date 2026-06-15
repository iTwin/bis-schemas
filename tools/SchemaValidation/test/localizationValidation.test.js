/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const chai = require("chai");
const fs = require("fs");
const path = require("path");
chai.use(require("chai-as-promised"));
const { validateLocalizationJsons } = require("../LocalizationValidation");

const expect = chai.expect;
const localizationRoot = path.join(__dirname, "assets", "localization");
const inventoryPath = path.join(localizationRoot, "SchemaInventory.json");

function setupInventory(inventory) {
  fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2));
}

function schemaEntry(name, version, localizations, released = false) {
  return {
    name,
    version,
    path: released ? `Released\\${name}.${version}.ecschema.xml` : `${name}.ecschema.xml`,
    released,
    localizations,
  };
}

function localeRef(name, locale, version = undefined, released = false) {
  const filename = released ? `${name}.${version}.${locale}.json` : `${name}.${locale}.json`;
  const dir = released ? "Released\\Locales" : "Locales";
  return { path: `${dir}\\${filename}`, locale };
}

describe("Validate localization files", function () {

  afterEach(() => {
    if (fs.existsSync(inventoryPath))
      fs.unlinkSync(inventoryPath);
  });

  describe("Localization json validation", function () {

    it("should succeed when a wip schema has a single valid localization", async function () {
      setupInventory({
        SchemaX: [schemaEntry("SchemaX", "01.00.00", [localeRef("SchemaX", "de")])],
      });

      await validateLocalizationJsons(localizationRoot);
    });

    it("should succeed when a released schema has a valid localization", async function () {
      setupInventory({
        SchemaReleased: [schemaEntry("ReleasedSchemaX", "01.00.00", [localeRef("ReleasedSchemaX", "de", "01.00.00", true)], true)],
      });

      await validateLocalizationJsons(localizationRoot);
    });

    it("should succeed when multiple schemas have multiple valid localizations", async function () {
      setupInventory({
        SchemaX: [schemaEntry("SchemaX", "01.00.00", [
          localeRef("SchemaX", "de"),
          localeRef("SchemaX", "fr-CA"),
        ])],
        SchemaY: [schemaEntry("SchemaY", "02.00.00", [localeRef("SchemaY", "de")])],
      });

      await validateLocalizationJsons(localizationRoot);
    });

    it("should succeed when schemas have no localizations defined", async function () {
      setupInventory({
        SchemaX: [schemaEntry("SchemaX", "01.00.00", [])],
        SchemaY: [{
          name: "SchemaY",
          version: "02.00.00",
          path: "SchemaY.ecschema.xml",
          released: false,
        }],
      });

      await validateLocalizationJsons(localizationRoot);
    });

    it("should succeed when the inventory contains no schemas", async function () {
      setupInventory({});

      await validateLocalizationJsons(localizationRoot);
    });

    it("should throw error when SchemaInventory.json is not found at the provided root", async function () {
      const rootDir = path.join(localizationRoot, "test");

      await expect(validateLocalizationJsons(rootDir))
        .to.be.rejectedWith(`SchemaInventory.json not found at ${path.join(rootDir, "SchemaInventory.json")}`);
    });

    it("should throw error when a referenced localization file does not exist", async function () {
      setupInventory({
        SchemaA: [schemaEntry("SchemaA", "01.00.00", [localeRef("SchemaA", "de")])],
      });
      const expectedPath = path.join(localizationRoot, "Locales\\SchemaA.de.json");

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Localization file not found: ${expectedPath}`);
    });

    it("should throw error when the localization JSON schema name does not match the inventory entry", async function () {
      setupInventory({
        SchemaZ: [schemaEntry("SchemaZ", "01.00.00", [localeRef("SchemaZ", "de")])],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Localization JSON mismatch for SchemaZ:de - expected schema name "SchemaZ" but got "SchemaP"`);
    });

    it("should throw error when the localization JSON locale does not match the inventory entry", async function () {
      setupInventory({
        SchemaO: [schemaEntry("SchemaO", "01.00.00", [localeRef("SchemaO", "de")])],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Localization JSON mismatch for SchemaO:de - expected locale "de" but got "fr-CA"`);
    });

    it("should throw error when the localization JSON is missing the required name field", async function () {
      setupInventory({
        SchemaL: [schemaEntry("SchemaL", "01.00.00", [localeRef("SchemaL", "de")])],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Invalid localization JSON for SchemaL:de - missing schema name or locale`);
    });

    it("should throw error when the localization JSON has empty name field", async function () {
      setupInventory({
        SchemaH: [schemaEntry("SchemaH", "01.00.00", [localeRef("SchemaH", "de")])],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Invalid localization JSON for SchemaH:de - missing schema name or locale`);
    });

    it("should throw error when the localization JSON is missing the required locale field", async function () {
      setupInventory({
        SchemaK: [schemaEntry("SchemaK", "01.00.00", [localeRef("SchemaK", "de")])],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Invalid localization JSON for SchemaK:de - missing schema name or locale`);
    });

    it("should throw error when the localization JSON has empty locale field", async function () {
      setupInventory({
        SchemaG: [schemaEntry("SchemaG", "01.00.00", [localeRef("SchemaG", "de")])],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Invalid localization JSON for SchemaG:de - missing schema name or locale`);
    });

    it("should throw error when the localization JSON is missing the required $schema field", async function () {
      setupInventory({
        SchemaM: [schemaEntry("SchemaM", "01.00.00", [localeRef("SchemaM", "de")])],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Invalid localization JSON for SchemaM:de - missing or wrong '$schema'`);
    });

    it("should throw error when the localization JSON has an invalid $schema value", async function () {
      setupInventory({
        SchemaJ: [schemaEntry("SchemaJ", "01.00.00", [localeRef("SchemaJ", "de")])],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Invalid localization JSON for SchemaJ:de - missing or wrong '$schema'`);
    });

    it("should throw error when the localization JSON version does not match the inventory entry version", async function () {
      setupInventory({
        SchemaP: [schemaEntry("SchemaP", "01.00.00", [localeRef("SchemaP", "de")])],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Localization JSON mismatch for SchemaP:de - expected version "01.00.00" but got "02.00.00"`);
    });

    it("should throw error when the localization JSON is missing the required version field", async function () {
      setupInventory({
        SchemaN: [schemaEntry("SchemaN", "01.00.00", [localeRef("SchemaN", "de")])],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Localization JSON mismatch for SchemaN:de - expected version "01.00.00" but got "undefined"`);
    });

    it("should throw error when the localization file contains malformed JSON", async function () {
      setupInventory({
        SchemaI: [schemaEntry("SchemaI", "01.00.00", [localeRef("SchemaI", "de")])],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Expected ',' or '}' after property value in JSON at position 181 (line 9 column 1)`);
    });
  });

  describe("Localization path validation", function () {

    it("should throw error when a wip localization is not under a locales directory", async function () {
      setupInventory({
        SchemaX: [{
          name: "SchemaX", version: "01.00.00", path: "SchemaX.ecschema.xml", released: false,
          localizations: [{ path: "Wrong\\SchemaX.de.json", locale: "de" }],
        }],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Invalid localization path for SchemaX:de - file must be in a 'Locales' directory but got "Wrong\\SchemaX.de.json"`);
    });

    it("should throw error when a wip localization is placed under a 'Released' directory", async function () {
      setupInventory({
        SchemaX: [{
          name: "SchemaX", version: "01.00.00", path: "SchemaX.ecschema.xml", released: false,
          localizations: [{ path: "Released\\Locales\\SchemaX.de.json", locale: "de" }],
        }],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Invalid localization path for WIP schema SchemaX:de - file must not be under a 'Released' directory but got "Released\\Locales\\SchemaX.de.json"`);
    });

    it("should throw error when a wip localization filename does not follow '{name}.{locale}.json'", async function () {
      setupInventory({
        SchemaX: [{
          name: "SchemaX", version: "01.00.00", path: "SchemaX.ecschema.xml", released: false,
          localizations: [{ path: "Locales\\Wrong.de.json", locale: "de" }],
        }],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Invalid localization filename for WIP schema SchemaX:de - expected "SchemaX.de.json" but got "Wrong.de.json"`);
    });

    it("should throw error when a released localization is not under 'Released/Locales/'", async function () {
      setupInventory({
        SchemaReleased: [{
          name: "SchemaReleased", version: "01.00.00", path: "Released\\SchemaReleased.01.00.00.ecschema.xml", released: true,
          localizations: [{ path: "Locales\\ReleasedSchema.01.00.00.de.json", locale: "de" }],
        }],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Invalid localization path for released schema SchemaReleased:de - file must be under 'Released/Locales/' but got "Locales\\SchemaReleased.01.00.00.de.json"`);
    });

    it("should throw error when a released localization filename does not follow '{name}.{version}.{locale}.json'", async function () {
      setupInventory({
        SchemaReleased: [{
          name: "SchemaReleased", version: "01.00.00", path: "Released\\SchemaReleased.01.00.00.ecschema.xml", released: true,
          localizations: [{ path: "Released\\Locales\\SchemaReleased.de.json", locale: "de" }],
        }],
      });

      await expect(validateLocalizationJsons(localizationRoot))
        .to.be.rejectedWith(`Validation has failed with error: Invalid localization filename for released schema SchemaReleased:de - expected "SchemaReleased.01.00.00.de.json" but got "SchemaReleased.de.json"`);
    });
  });

});
