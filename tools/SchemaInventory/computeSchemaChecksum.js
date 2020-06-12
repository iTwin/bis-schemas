const path = require("path");
const ecSchemaOpsLib = require("@bentley/ecschema-ops").NativeLibrary;
const ECSchemaOpsNative = ecSchemaOpsLib.load();
const schemaOps = new ECSchemaOpsNative.ECSchemaOps();

module.exports = function (schema, bisRootDir, schemaDirectories) {
  const fullSchemaPath = path.join(bisRootDir, schema.path);
  return schemaOps.computeChecksum(fullSchemaPath, schemaDirectories);
};