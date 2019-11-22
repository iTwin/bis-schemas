/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

// This tool is designed validate all schemas in the bis-schema repository.

"use strict";

const path = require("path");
const fs = require("fs");
const readdirp = require("readdirp");
const argv = require("yargs").argv;
const exec = require('child_process').exec

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

async function validateSchemas() {
  const schemas = await getAllSchemas();
  const allRefPaths = getRefpaths(schemas, false);
  const releasedRefPaths = getRefpaths(schemas, true);
  for (const schema of schemas) {
    const refPaths = schema.released ? releasedRefPaths : allRefPaths;
    const command = buildValidationCommand(schema, refPaths);
    executeValidation(command);
  }
}

function buildValidationCommand(schema, refPaths) {
  const command = `schema-validator -i ${schema.fullPath} ${refPaths} -o ${argv.OutDir}`;
  return command; 
}

function executeValidation(command) {
  exec(command, (err, stdout, stderr) => {
    console.log(stdout);
    console.log(err);
    console.log(stderr);
  })
}

function getRefpaths(schemas, releasedOnly) {
  const referencePaths = [];
  for (const schema of schemas) {
    if (releasedOnly && schema.released === false)
      continue;
    const dir = path.dirname(schema.fullPath);
    if (!referencePaths.includes(dir))
      referencePaths.push(dir);
  }

  return "-r " + referencePaths.join(" -r ");
}


async function getAllSchemas() {
  const allSchemas = await readdirp.promise(argv.BisRoot, {fileFilter: "*.ecschema.xml", directoryFilter: ["!docs", "!node_modules", "!tools", "!.vscode", "!cmaps"]});

  const schemas = new Set();
  for (const entry of allSchemas) {
    const schemaInfo = {
      name: entry.basename.match(/\w+/)[0], 
      fullName: entry.basename.match(/\w+(\.\d+\.\d+\.\d+)?/)[0],
      path: entry.path, 
      fullPath: entry.fullPath,
      released: entry.path.includes("Released"), 
      version: /\d+\.\d+\.\d+/.test(entry.basename) ? entry.basename.match(/\d+\.\d+\.\d+/)[0] : ""
    };

    if (!schemas.has(schemaInfo)) {
      schemas.add(schemaInfo);
    }
  }

  return schemas;
}

validateSchemas();