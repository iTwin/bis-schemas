/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

// This tool is designed to validate all schemas in the bis-schema repository.

"use strict";

const validator = require('./iModelSchemaValidationRunner');

validator.validateIModelSchemas().then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });