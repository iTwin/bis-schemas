/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

// This tool is designed to report messages log by the schema-validator tool.

"use strict";

const fs = require("fs");
const readdirp = require("readdirp");
const argv = require("yargs").argv;

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

async function reportValidationResults() {
  await parseValidationLogs();
  const hasErrors = await parseValidationLogs();
  if (hasErrors)
    throw new Error("Schema rule violations reported.");
}

async function parseValidationLogs() {
  const logs = await readdirp.promise(argv.LogDir, {fileFilter: "*.validation.log"});
  let hasErrors = false;
  for (const entry of logs) {
    if (parseValidationLog(entry.fullPath))
      hasErrors = true;
  }

  return hasErrors;
}

function parseValidationLog(path) {
  const lines = fs.readFileSync(path, "utf-8").split(/\r?\n/);
  if (lines.length <= 3)
    return false;
  
  const schema = lines[0].match(/\w+(\.\d+\.\d+\.\d+)?/)[0];
  console.log(`***** Schema ${schema} Rule Violations *****`);
  console.log(`Violations reported in: ${path}`);

  lines.shift();
  let hasErrors = false;
  for (const line of lines) {
    if (line.startsWith("Error")) {
      hasErrors = true;
      reportError(line);
    } else if (line.startsWith("Warning")) {
      reportWarning(line);
    } else {
      console.log(line);
    }
  }

  return hasErrors;
}

function reportError(message) {
  const cmd = `Write-Host \"##vso[task.logissue type=error]${message}\"`;
  console.log(`${cmd}`);
}

function reportWarning(message) {
  const cmd = `Write-Host \"##vso[task.logissue type=warning]${message}\"`;
  console.log(`${cmd}`);
}

reportValidationResults();