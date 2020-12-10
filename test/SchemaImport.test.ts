/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { SchemaInventory } from "./InventoryHelper";
import * as path from "path";
import * as fs from "fs";
import { IModelUtility } from "./IModelUtility";
import { assert } from "chai";

function getBisRootPath() {
  const bisRootPath = process.env.BisSchemaRepo || path.join(__dirname, "../../");

  if (!fs.existsSync(bisRootPath)) {
    throw Error("Could not find BIS root path.")
  }
  return bisRootPath;
}

function getTestDataRoot() {
  const bisRootPath = process.env.TestDataRoot || path.join(__dirname, "assets");

  if (!fs.existsSync(bisRootPath)) {
    throw Error("Could not find test data root path.")
  }
  return bisRootPath;
}

describe("multi schema import all Building Domain schemas in repo", async () => {
  const repoPath = getBisRootPath();
  it("import all", async () => {
      const inventory: SchemaInventory = new SchemaInventory;
      const released = inventory.getReleasedSchemas();
      const allSchemas: string[] = [];
      for (const schema of released) {
        allSchemas.push(path.join(repoPath, path.dirname(schema.path)));
      }

      const schemasTest = released.filter((s) => !s.path.includes("Standard"));
      const schemaList: any[] = [];
      for (const schema of schemasTest) {
        // just check all Building schemas
        if (schema.name.includes("Building"))
          schemaList.push(path.join(repoPath, schema.path));
      }
      const result: boolean = await IModelUtility.importSchemas(path.join(__dirname, "BuildingSchemas"), schemaList, allSchemas);
      assert.isTrue(result, "One or more schemas import failed. Please check logs");
  });
});

describe("multi schema import tests", async () => {
  const repoPath = getBisRootPath();
  const dataPath = getTestDataRoot();
  const testJsons = fs.readdirSync(dataPath);
  testJsons.forEach( (testJson) => {
    if (path.parse(testJson).ext === ".json") {
      it(`schema import from ${testJson}`, async () => {
        const fullPath = path.join(dataPath, testJson);
        const schemaList = require(fullPath);
        const outPath = path.join(__dirname, path.parse(testJson).name);
        const result: boolean = await IModelUtility.importSchemas(outPath, schemaList);
        assert.isTrue(result, `Import failed for schemas defined in ${fullPath}`);
      });
    }
  });
});
