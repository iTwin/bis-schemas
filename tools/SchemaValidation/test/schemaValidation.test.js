/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const chai = require("chai");
const path = require("path");
chai.use(require("chai-as-promised"));
const { validateSchemas } = require("../SchemaValidationRunner.js");

const expect = chai.expect;
const assetsDir = path.join(__dirname, "assets", "1");
const releasedDir = path.join(assetsDir, "Released");

describe("Validate 'NotForProduction' checks", function () {

  it("should throw error, when a released schema has NotForProduction status", async function () {
    const schema = [
      {
        name: "SchemaB",
        fullName: "SchemaB.01.00.00",
        fullPath: path.join(releasedDir, "SchemaB.01.00.00.ecschema.xml"),
        path: "Released/SchemaB.01.00.00.ecschema.xml",
        released: true,
        version: "01.00.00",
      },
    ];

    await expect(validateSchemas(schema, [releasedDir], [releasedDir], [])).to.be.rejectedWith("schema validation runner reported errors");
  });

  it("should not throw error, when a released schema does not have NotForProduction status", async function () {
    const schema = [
      {
        name: "SchemaA",
        fullName: "SchemaA.01.00.00",
        fullPath: path.join(releasedDir, "SchemaA.01.00.00.ecschema.xml"),
        path: "Released/SchemaA.01.00.00.ecschema.xml",
        released: true,
        version: "01.00.00",
      },
    ];

    await validateSchemas(schema, [releasedDir], [releasedDir], []);
  });

  it("should not throw error, when a WIP schema has NotForProduction status", async function () {
    const schema = [
      {
        name: "SchemaB",
        fullName: "SchemaB",
        fullPath: path.join(assetsDir, "SchemaB.ecschema.xml"),
        path: "SchemaB.ecschema.xml",
        released: false,
        version: "03.00.01",
      },
    ];

    await validateSchemas(schema, [assetsDir, releasedDir], [releasedDir], []);
  });
});
