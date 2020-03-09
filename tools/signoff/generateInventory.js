/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

// This tool is designed to merge the information from a previously generated SchemaInventory.json
// with the schema information gathered from the bis-schemas repository.
// It may also be used to merge the information dumped by the 'signoff.py --getLaunchCodes --dumpJson' script
// with the schema information gathered from the bis-schemas repository.
// Usage:
// generateInventory.js --BisRoot <pathToRootOfBisSchemasRepo> --OutDir <outputDirectory> --ChecksumDumpDir <directoryWithBisChecksumDump>
// Example:
//    node ./tools/signoff/generateInventory.js --BisRoot . --OutDir . --ChecksumDumpDir .

"use strict";
const argv = require("yargs").argv;
const path = require("path");
const invGen = require('./inventoryGeneration.js');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

invGen.generateInventory(argv.BisRoot, argv.OutDir, argv.ChecksumDumpDir);
