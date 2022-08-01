/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const path = require("path");
const IModelHost = require("@itwin/core-backend").IModelHost;

module.exports = async function (schema, bisRootDir, schemaDirectories) {
  const fullSchemaPath = path.join(bisRootDir, schema.path);
  await IModelHost.startup();
  const sha1 = IModelHost.computeSchemaChecksum({ schemaXmlPath: fullSchemaPath, referencePaths: schemaDirectories });
  await IModelHost.shutdown();
  return sha1;
};