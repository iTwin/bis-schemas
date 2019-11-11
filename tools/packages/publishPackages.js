/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

// This tool publishes the packages found in the specified directory.  Fails if any package fails to publish all packages it can.
// Requires '--isRealRun' passed in to actually publish, else it does a dry run
// Usage:
// publishPackages.js --packages <directoryToSearchForPackages> [--isRealRun]
// Example:
//    node ./tools/packages/publishPackages.js --packages ./packageOut

"use strict";

const fs = require("fs");
const readdirp = require("readdirp");
const argv = require("yargs").argv;
const path = require("path");
const child_process = require('child_process');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});


async function publishPackages(searchDirectory, isRealRun) {
  const allPackageJsons = await readdirp.promise(searchDirectory, {
    fileFilter: "package.json", 
    directoryFilter: ["!docs", "!node_modules", "!tools", "!.vscode", "!cmaps", "!packageOut"],
    type: 'files'
  });
  const allPackages = allPackageJsons.map((pkgJsonPath) => path.dirname(pkgJsonPath.fullPath)).sort();
  console.log(JSON.stringify(allPackages));
  const publishCommands = allPackages.map((pkg) => `npm publish ${pkg} --tag ${pkg.includes("-beta")? "beta": "latest"} ${isRealRun? "":"--dry-run"}`);
  console.log(JSON.stringify(publishCommands));
  let hadFailures = false;
  publishCommands.forEach((command) => {
    let npmOutput = "";
    try {
      hadFailures = true;
      npmOutput = child_process.execSync(command, {stdio:['inherit'], encoding:'utf8'});
    } catch (e) {
      if (!e.message.includes("E404")) {
        throw e;
      }
      console.log(`Publish command failed: ${command}`);
      console.log(`Error: ${e.message}`);
    }
    console.log(npmOutput);
  });
  return hadFailures;
}


publishPackages(argv.packages, undefined !== argv.isRealRun);