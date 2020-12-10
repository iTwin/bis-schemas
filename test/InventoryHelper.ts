/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as path from "path";
import * as fs from "fs";


/** Utility to get info from Schema Inventory Json */
export class SchemaInventory {
  public inventoryJson: any;
  private inventoryJsonPath: string = path.join(path.dirname(path.dirname(__dirname)), "SchemaInventory.json");
  constructor() {
    this.inventoryJson = JSON.parse(fs.readFileSync(this.inventoryJsonPath, "utf-8"));
  }
  /** Get all schemas json
   */
  public getSchemas() {
    return this.inventoryJson;
  }

  /** Get all released schemas that have path within repo
   */
  public getReleasedSchemas() {
    const relasedSchemas: any[] = [];
    for (const group in this.inventoryJson) {
      for (const schema of this.inventoryJson[group]) {
        if (schema.hasOwnProperty('path')) {
          if (schema.released) {
            relasedSchemas.push(schema);
          }
        }
      }
    }
    return relasedSchemas;
  }

  /** Get the path value for the given schema
   * @param schemaName Name of schema with version to look for
   * @returns full path for the schema
   */
  public getSchemaPath(schemaName: string): string {
    const schema: any = this.getSchema(schemaName);
    if (schema)
      return path.join(path.dirname(this.inventoryJsonPath), schema.path);
    else
      return "";
  }

  /** Get the json values for the given schema
   * @param schemaName Name of schema with version to look for
   * @returns json dictionary for schema
   */
  public getSchema(schemaName: string): any {
    for (const group in this.inventoryJson) {
      for (const schema of this.inventoryJson[group]) {
        if (schema.hasOwnProperty('path')) {
          if (schema.released) {
            if (schemaName.startsWith(schema.name) && schemaName.includes(schema.version)) {
              return schema;
              }
          }
        }
      }
    }
    return {};
  }
}