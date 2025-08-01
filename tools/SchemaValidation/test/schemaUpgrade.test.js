/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const chai = require('chai');
const fs = require("fs-extra");
const path = require("path");
const { schemaUpgradeTest } = require('../../SchemaValidation/iModelSchemaValidationRunner.js');
chai.use(require('chai-as-promised'))

describe('Schema Upgrade Tests', function() {
  const outDir = path.normalize(__dirname + "/../../../testOut");
  const assetsDir = path.join(__dirname, "assets");

  before(() => {
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, {recursive: false});
    }
  });

  it("More than one read compatible sets present in each schema family, Schema Upgrade testing is performed in respective batches.", async function () {
    process.env.BisSchemaRepo = path.join(assetsDir, "1");
    const results = await schemaUpgradeTest(undefined,outDir);

    // SchemaA first batch
    chai.expect(results["SchemaA"][0].batchStarted).to.be.true;
    chai.expect(results["SchemaA"][0].batch).to.equal(1);
    chai.expect(results["SchemaA"][0].version).to.equal("01.00.00");
    chai.expect(results["SchemaA"][1].batchStarted).to.be.false;
    chai.expect(results["SchemaA"][1].batch).to.equal(1);
    chai.expect(results["SchemaA"][1].version).to.equal("01.00.01");
    chai.expect(results["SchemaA"][2].batchStarted).to.be.false;
    chai.expect(results["SchemaA"][2].batch).to.equal(1);
    chai.expect(results["SchemaA"][2].version).to.equal("01.00.02");

    // SchemaA second batch
    chai.expect(results["SchemaA"][3].batchStarted).to.be.true;
    chai.expect(results["SchemaA"][3].batch).to.equal(2);
    chai.expect(results["SchemaA"][3].version).to.equal("02.00.00");
    chai.expect(results["SchemaA"][4].batchStarted).to.be.false;
    chai.expect(results["SchemaA"][4].batch).to.equal(2);
    chai.expect(results["SchemaA"][4].version).to.equal("02.00.01");
    chai.expect(results["SchemaA"][5].batchStarted).to.be.false;
    chai.expect(results["SchemaA"][5].batch).to.equal(2);
    chai.expect(results["SchemaA"][5].version).to.equal("02.00.02");

    // SchemaB first batch
    chai.expect(results["SchemaB"][0].batchStarted).to.be.true;
    chai.expect(results["SchemaB"][0].batch).to.equal(1);
    chai.expect(results["SchemaB"][0].version).to.equal("01.00.00");

    // SchemaB second batch
    chai.expect(results["SchemaB"][1].batchStarted).to.be.true;
    chai.expect(results["SchemaB"][1].batch).to.equal(2);
    chai.expect(results["SchemaB"][1].version).to.equal("02.00.00");
    chai.expect(results["SchemaB"][2].batchStarted).to.be.false;
    chai.expect(results["SchemaB"][2].batch).to.equal(2);
    chai.expect(results["SchemaB"][2].version).to.equal("02.01.00");

    // SchemaB third batch
    chai.expect(results["SchemaB"][3].batchStarted).to.be.true;
    chai.expect(results["SchemaB"][3].batch).to.equal(3);
    chai.expect(results["SchemaB"][3].version).to.equal("03.00.00");
    chai.expect(results["SchemaB"][4].batchStarted).to.be.false;
    chai.expect(results["SchemaB"][4].batch).to.equal(3);
    chai.expect(results["SchemaB"][4].version).to.equal("03.00.01");
  });

  it("One or more read compatible sets present in each schema family, Schema Upgrade testing is performed in respective batches.", async function () {
    process.env.BisSchemaRepo = path.join(assetsDir);
    const results = await schemaUpgradeTest(undefined,outDir);

    // SchemaA first batch
    chai.expect(results["SchemaA"][0].batchStarted).to.be.true;
    chai.expect(results["SchemaA"][0].batch).to.equal(1);
    chai.expect(results["SchemaA"][0].version).to.equal("01.00.00");
    chai.expect(results["SchemaA"][1].batchStarted).to.be.false;
    chai.expect(results["SchemaA"][1].batch).to.equal(1);
    chai.expect(results["SchemaA"][1].version).to.equal("01.00.01");
    chai.expect(results["SchemaA"][2].batchStarted).to.be.false;
    chai.expect(results["SchemaA"][2].batch).to.equal(1);
    chai.expect(results["SchemaA"][2].version).to.equal("01.00.02");
    // SchemaA second batch
    chai.expect(results["SchemaA"][3].batchStarted).to.be.true;
    chai.expect(results["SchemaA"][3].batch).to.equal(2);
    chai.expect(results["SchemaA"][3].version).to.equal("02.00.00");
    chai.expect(results["SchemaA"][4].batchStarted).to.be.false;
    chai.expect(results["SchemaA"][4].batch).to.equal(2);
    chai.expect(results["SchemaA"][4].version).to.equal("02.00.01");
    chai.expect(results["SchemaA"][5].batchStarted).to.be.false;
    chai.expect(results["SchemaA"][5].batch).to.equal(2);
    chai.expect(results["SchemaA"][5].version).to.equal("02.00.02");

    // SchemaB first batch
    chai.expect(results["SchemaB"][0].batchStarted).to.be.true;
    chai.expect(results["SchemaB"][0].batch).to.equal(1);
    chai.expect(results["SchemaB"][0].version).to.equal("01.00.00");
    // SchemaB second batch
    chai.expect(results["SchemaB"][1].batchStarted).to.be.true;
    chai.expect(results["SchemaB"][1].batch).to.equal(2);
    chai.expect(results["SchemaB"][1].version).to.equal("02.00.00");
    chai.expect(results["SchemaB"][2].batchStarted).to.be.false;
    chai.expect(results["SchemaB"][2].batch).to.equal(2);
    chai.expect(results["SchemaB"][2].version).to.equal("02.01.00");
    // SchemaB third batch
    chai.expect(results["SchemaB"][3].batchStarted).to.be.true;
    chai.expect(results["SchemaB"][3].batch).to.equal(3);
    chai.expect(results["SchemaB"][3].version).to.equal("03.00.00");

    // SchemaC first batch
    chai.expect(results["SchemaC"][0].batchStarted).to.be.true;
    chai.expect(results["SchemaC"][0].batch).to.equal(1);
    chai.expect(results["SchemaC"][0].version).to.equal("01.00.00");

    // SchemaD first batch
    chai.expect(results["SchemaD"][0].batchStarted).to.be.true;
    chai.expect(results["SchemaD"][0].batch).to.equal(1);
    chai.expect(results["SchemaD"][0].version).to.equal("01.00.00");
    chai.expect(results["SchemaD"][1].batchStarted).to.be.false;
    chai.expect(results["SchemaD"][1].batch).to.equal(1);
    chai.expect(results["SchemaD"][1].version).to.equal("01.01.00");
    // SchemaD second batch
    chai.expect(results["SchemaD"][2].batchStarted).to.be.true;
    chai.expect(results["SchemaD"][2].batch).to.equal(2);
    chai.expect(results["SchemaD"][2].version).to.equal("02.00.00");
    chai.expect(results["SchemaD"][3].batchStarted).to.be.false;
    chai.expect(results["SchemaD"][3].batch).to.equal(2);
    chai.expect(results["SchemaD"][3].version).to.equal("02.00.01");

    // SchemaE first batch
    chai.expect(results["SchemaE"][0].batchStarted).to.be.true;
    chai.expect(results["SchemaE"][0].batch).to.equal(1);
    chai.expect(results["SchemaE"][0].version).to.equal("01.00.00");
  });
});