/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

// This tool creates an npm package for each schema.  Released schemas should be 
// published with the latest tag and beta schemas are released with the next tag.  
// Use the option --skipBetaPackages to generate only released packages.
// Use the option --alwaysGen to generate packages even if they are already published. 
//    NOTE: Does not create beta packages for already released schemas or generate packages that do not meet publish criteria
// Usage:
// node generatePackages.js --template <pathToPackageJsonTemplate> --outDir <pathToDirectoryToBuildPackages> --inventory <pathToSchemaInventory> --skipList <pathToSchemaSkipList> [--skipBetaPackages] [--alwaysGen]
// Example:
//    node ./tools/packages/generatePackages.js --inventory ./SchemaInventory.json --skipList ./ignoreSchemaList.json --outDir ./packageOut --template ./tools/packages/package.json.template

"use strict";
const argv = require("yargs").argv;
const pkgGen = require('./packageGeneration.js');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

pkgGen.createPackages(argv.inventory, argv.skipList, argv.outDir, argv.template, undefined !== argv.skipBetaPackages, undefined !== argv.alwaysGen);
