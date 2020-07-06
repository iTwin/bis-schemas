const path = require("path");
const ECSchemaOpsNativeLibrary = require("@bentley/ecschema-ops").ECSchemaOpsNativeLibrary;
const ECSchemaOpsNative = ECSchemaOpsNativeLibrary.load();
const schemaOps = new ECSchemaOpsNative.ECSchemaOps();

module.exports = function (schema, bisRootDir, schemaDirectories) {
  const fullSchemaPath = path.join(bisRootDir, schema.path);
  return schemaOps.computeChecksum(fullSchemaPath, schemaDirectories);
};