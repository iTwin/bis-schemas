/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { BackendRequestContext, IModelHost, SnapshotDb } from "@bentley/imodeljs-backend";
import { DbResult } from "@bentley/bentleyjs-core";
import { StubSchemaXmlFileLocater } from "@bentley/ecschema-locaters";
import { SchemaGraphUtil } from "@bentley/ecschema-metadata";

import * as path from "path";
import * as fs from "fs";
import { SchemaInventory } from "./InventoryHelper";

/** Utility to work with schema imports into IModel */
export class IModelUtility {

  /** Import all schemas provided in the list. It determines references schemas automatically
   * @param outputDir  The path where iModel will be created
   * @param schemaList The list of schemas 
   * @param searchSchemaPaths The paths where reference schemas are to be searched
   * @returns True or False to indicate status of import      
   */
  public static async importSchemas (outputDir: string, schemaList: string[], searchSchemaPaths: string[] = []) {
    let passed = true;
    if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir);
    const inventory: SchemaInventory = new SchemaInventory;
    await IModelHost.startup();
    const requestContext = new BackendRequestContext();
    const imodel = SnapshotDb.createEmpty(path.join(outputDir, "test-imodel.bim"), { rootSubject: { name: "test-imodel" } });
    for (const schema of schemaList) {
      console.log(`Importing Schema            : ${path.basename(schema)}`);
      let schemaPaths;
      if (searchSchemaPaths && searchSchemaPaths.length) {
        const locater = new StubSchemaXmlFileLocater();
        locater.addSchemaSearchPaths(searchSchemaPaths);
        const loadedSchema = locater.loadSchema(schema);
        const orderedSchemas: any[] = SchemaGraphUtil.buildDependencyOrderedSchemaList(loadedSchema);
        schemaPaths = orderedSchemas.map((s) => s.schemaKey.fileName);
      } else {
        schemaPaths = [inventory.getSchemaPath(schema)];
      }
      try {
        await imodel.importSchemas(requestContext, schemaPaths);
        console.log(`Import successful for Schema: ${path.basename(schema)}\n`);                
      } catch (error) {
        console.log( `Failed to import schema ${schema} because ${error.toString()}`);
        passed = false;
      }
      imodel.saveChanges();
    }

    const result: DbResult = imodel.nativeDb.exportSchemas(outputDir);
    if (result === DbResult.BE_SQLITE_OK)
      console.log(`Exported all schemas to: ${outputDir}`);
    else
      console.log(`Schema export failed with status: ${result}`);
    imodel.close();
    IModelHost.shutdown();
    return passed;
  }
}
