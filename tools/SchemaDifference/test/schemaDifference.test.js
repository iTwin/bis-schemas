/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const chai = require('chai');
const fs = require("fs-extra");
const path = require("path");
const CompareOptions = require("@bentley/schema-comparer").CompareOptions;
const SchemaComparison = require("@bentley/schema-comparer").SchemaComparison;
const schemaDifferenceHandler = require('../../SchemaDifference/SchemaDifferenceRunner.js');
chai.use(require('chai-as-promised'))

describe('Schema Difference Tests', function() {
  let schemas;
  const assetsDir = path.join(__dirname, "assets");
  const outDir = path.normalize(__dirname + "/../../../testOut");

  before( async () => {
    if (!fs.existsSync(outDir))
      fs.mkdirSync(outDir, {recursive: false});
    schemas = await schemaDifferenceHandler.getAllSchemas(assetsDir);
  });

  it("WIP schema version is greater and version not specified in file name", async function() {
    let hasErrors = false;
    const releasedSchemaA = schemaDifferenceHandler.findLatestReleasedSchema([...schemas][0], schemas);
    const options = new CompareOptions(releasedSchemaA.fullPath, [...schemas][0].fullPath, [], [], outDir);
    const results = await SchemaComparison.compare(options);

    if (schemaDifferenceHandler.processResults(releasedSchemaA, [...schemas][0], results))
      hasErrors = true;

    chai.expect(hasErrors).to.equal(false);
  });

  it("WIP schema version is greater and version is specified in file name", async function() {
    let hasErrors = false;
    const releasedSchemaC = schemaDifferenceHandler.findLatestReleasedSchema([...schemas][2], schemas);
    const options = new CompareOptions(releasedSchemaC.fullPath, [...schemas][2].fullPath, [], [], outDir);
    const results = await SchemaComparison.compare(options);

    if (schemaDifferenceHandler.processResults(releasedSchemaC, [...schemas][2], results))
      hasErrors = true;
    chai.expect(hasErrors).to.equal(false);
  });

  it("WIP schema version is smaller and version is specified in file name", async function() {
    let hasErrors = false;
    const releasedSchemaB = schemaDifferenceHandler.findLatestReleasedSchema([...schemas][1], schemas);
    const options = new CompareOptions(releasedSchemaB.fullPath, [...schemas][1].fullPath, [], [], outDir);
    const results = await SchemaComparison.compare(options);

    if (schemaDifferenceHandler.processResults(releasedSchemaB, [...schemas][1], results))
      hasErrors = true;

    chai.expect(hasErrors).to.equal(true);
  });

  it("WIP schema version is smaller and version is not specified in file name", async function() {
    let hasErrors = false;
    const releasedSchemaD = schemaDifferenceHandler.findLatestReleasedSchema([...schemas][3], schemas);
    const options = new CompareOptions(releasedSchemaD.fullPath, [...schemas][3].fullPath, [], [], outDir);
    const results = await SchemaComparison.compare(options);

    if (schemaDifferenceHandler.processResults(releasedSchemaD, [...schemas][3], results))
      hasErrors = true;

    chai.expect(hasErrors).to.equal(false);
  });

  it("WIP schema version is equivalent to the latest released version", async function() {
    let hasErrors = false;
    const releasedSchemaE = schemaDifferenceHandler.findLatestReleasedSchema([...schemas][4], schemas);
    const options = new CompareOptions(releasedSchemaE.fullPath, [...schemas][4].fullPath, [], [], outDir);
    const results = await SchemaComparison.compare(options);

    if (schemaDifferenceHandler.processResults(releasedSchemaE, [...schemas][4], results))
      hasErrors = true;

    chai.expect(hasErrors).to.equal(true);
  });
});
