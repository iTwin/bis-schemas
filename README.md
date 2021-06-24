# BIS ECSchemas

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.

This repository is the single-source-of-truth (SSOT) for all BIS schemas.

## Directory Structure

The repository is split up into two main parts; the tooling, used to process and validate the schemas, and the BIS Schemas.

All tooling will be under the "tools" directory at the root of the repository.

The BIS Domain Schemas all live under the "Domains" directory, organized by domain group. Each domain group has it own directory, allowing permissions control by the domain group owner. If necessary for finer-grained permissions management, domain group owners can create further subdirectories. Otherwise, all domain schemas should be in the top-level domain group directory. There will be a "Released" subdirectory to hold domain schemas that have been publicly released.

Example:

```shell
\Domains\{DomainGroupName}\{Domain1}.ecschema.xml
\Domains\{DomainGroupName}\{Domain2}.ecschema.xml
\Domains\{DomainGroupName}\Released\{Domain1.MM.mm.bb}.ecschema.xml
\Domains\{DomainGroupName}\Released\{Domain2.MM.mm.bb}.ecschema.xml
```

## Contributing

All contributions to this repository will be done via [pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) to the master branch.

Each BIS Schema must have an owner, or owners. The owner(s) of a given BIS Schema have to approve all pull requests before they are merged into the master branch. The owner will automatically be added as a required reviewer to a pull request if it corresponds with their domain group directory (see [directory structure](#directory-structure)).

All other changes made outside of a domain group directory will require review by a repository owner(s). The repository owner(s) will be added as optional reviewer(s) to all pull requests that are created within domain group directories.

### Adding a new BIS Schema to the repository

1. Create a branch of the bis-schemas repo to make all of your changes.
1. Identify the owner of the Schema and decide what domain group it goes into.
    .


    
    
    
1. [Update the Schema Inventory](#update-schema-inventory)
1. Run [Bis Rule Validation](#bis-rule-validation) and [iModel Schema Validation](#imodel-schema-validation) on your new schema and make sure they pass.
1. Create a PR to merge your branch into master

> NOTE: When your schema is checked into master it will automatically be published as an npm package see [Schema Packaging](#schema-packaging) for more information

### **Releasing a Bis Schema**

> NOTE: You will need someone from the 'BIS Release Admins' Group to approve your PR.  For new schemas this generally requires some review of the schema by the BIS Working Group so coordinate with them early in the process to avoid delays and reworking when you are trying to release.

1. Create a branch of the bis-schemas repo to make all of your changes.
1. Copy the schema to the Released directory for that domain group and change the file name to include the version
    - e.g. copy `\Domains\Core\BisCore.ecschema.xml` to `\Domains\Core\Released\BisCore.01.00.42.ecschema.xml`
1. [Update the Schema Inventory](#update-schema-inventory)
1. Find the new entry added by the update schema inventory script it should look something like this:

    ```json
    {
    "name": "BisCore",
    "path": "Domains\\Core\\Released\\BisCore.01.00.42.ecschema.xml",
    "released": true,
    "version": "01.00.42",
    "comment": "Answers the question",
    "verifier": "<First.Last of the BIS Release Admin responsible for verifying this version of the schema",
    "sha1": "<sha1 hash>",
    "verified": "<Yes/No>", # Set to Yes when the verifier is OK with release
    "author": "<First.Last of the person responsible for this version of the schema>",
    "date": "<MM/DD/YYYY Date for the schemas release>",
    "dynamic": "<Yes/No>", # Set to Yes if programmatically generated, else No (No is most common)
    "approved": "<Yes/No>" # Set to Yes by the author when they are OK with release
    },
    ```

1. Update entry to fill out all fields correctly, the only optional field is 'comment'.
1. Run [Bis Rule Validation](#bis-rule-validation) and [iModel Schema Validation](#imodel-schema-validation) on your new schema and make sure they pass.
1. Create a PR to merge your branch into master

### Managing permissions for BIS Schemas

Every BIS Schema within the repository has an associated owner. The owner is in charge of managing Pull Requests and permissions to the BIS Schema(s).

Permissions for an individual domain schema, or a domain group are managed through a [CODEOWNERS](https://github.com/iTwin/bis-schemas/tree/master/.github/CODEOWNERS).

The Team is owned by the schema owner, which gives them the ability to add/remove people from that team. A given team can be setup as a required reviewer for Schema(s) it owns. Anyone within that team can review/approve pull requests to the schemas. (Note: If you are within the team and you make a pull request you will still need at least one additional reviewer.)





## Local BIS Schema Tools

There are set of tools exposed as npm tasks to assist schema authors in managing new or modified schemas.

### **Environment Setup**

To successfully run the tools described in this section, follow the steps below to setup your environment.



     
    

1. Via the command line, navigate to the root of the bis-schemas repository.  If you have VS Code installed, open the bis-schemas folder, and open a new Terminal (Terminal -> New Terminal in the menu, or use the shortcut (Ctrl-Shift-`).  

1. Run the command `npm install`.

### **Update Schema Inventory**

The [SchemaInventory.json](https://github.com/iTwin/bis-schemas/blob/master/SchemaInventory.json) file at the root of the bis-schemas repository contains an up-to-date inventory of all schemas in the bis-schemas repository. The schema inventory must be updated using the npm task 'updateSchemaInventory', defined in the bis-schemas package.json, for all pull-requests that define new schemas. This includes a new version of a work-in-progress schema or a new released schema.

 > Missing schemas will cause the `Bis Schemas - TS Validation (Github)` build to fail during pull-requests builds of the bis-schemas repository.

To run the 'updateSchemaInventory' script, follow these steps:

1. Navigate to the bis-schemas folder from the command line or VS Code Terminal
1. Run `npm run updateSchemaInventory`
1. Verify that the modified SchemaInventory.json contains the new schema entries, and include the modified file in the pull-request along with the schema changes.
    - **New Released Schemas**: New Schema entries will contain an automatically generated Sha1 hash for the new schema. You must manually update the `approved` and `verified` fields of the new schema entry in SchemaInventory.json or the validation (noted above) will fail during pull-request builds.

### **Get Json Schemas**

For getting all released schemas (including all versions) jsons, use following command:

``` npm run generateJsonSchemas -- --allReleasedVersions --OutDir D:\\dir1\\output\\ ```

If you just need json schemas of latest released versions:

``` npm run generateJsonSchemas -- --latestReleasedVersions --OutDir D:\\dir1\\output\\ ```

### **BIS Rule Validation**

BIS rule validation consists of checking all schemas in the bis-schemas repository against a set of [validation rules](https://imodeljs.github.io/iModelJs-docs-output/bis/intro/bis-schema-validation/). The npm script 'validateSchemas' uses the npm package `@bentley/schema-validator` to perform the validation.

To run the 'validateSchemas' script follow these steps:

1. Navigate to the bis-schemas folder from the command line or VS Code Terminal
1. Run `npm run validateSchemas`
    - To validate a single schema use this syntax: `npm run validateSchemas -- --name SCHEMA-NAME`
        - For example to validate BisCore: `npm run validateSchemas -- --name BisCore`

### **Schema Differencing**

The Schema Differencing tool performs a difference audit of all schemas in the bis-schemas against their latest released version, if one exists. The npm script 'compareSchemas' uses the npm package `@bentley/schema-comparer` to perform the difference audit.

To run the 'compareSchemas' script, follow these steps:

1. Navigate to the bis-schemas folder from the command line or VS Code Terminal
1. Run `npm run compareSchemas`
    - To difference a single schema use this syntax: `npm run compareSchemas -- --name SCHEMA-NAME`
        - For example to compare the wip of BisCore to the latest released version: `npm run compareSchemas -- --name BisCore`

### **iModel Schema Validation**

The iModel Schema Validation tool imports each individual schema in the bis-schema repository (along with schema references) into an local snapshot iModel. The schemas are then exported to a temp directory in order to perform the required validations. The following checks are performed:

- **BIS-Rules Validation:** All schemas are validated against [BIS-Rules](https://www.imodeljs.org/bis/intro/bis-schema-validation/) using the `@bentley/schema-validator` package.
- **Comparison Validation:** All schemas are compared with their similar (exact version match) released schemas within bis-schemas using the `@bentley/schema-comparer` package.
- **Sha1 Hash Validation:** Sha1 Hash is generated for each exported schema and compared against the set of hashes of released schemas present in [SchemaInventory](https://github.com/iTwin/bis-schemas/blob/master/SchemaInventory.json).
- **Approval Validation:** Approval status of each schema is checked from [SchemaInventory](https://github.com/iTwin/bis-schemas/blob/master/SchemaInventory.json).  

> The npm script 'iModelSchemaValidation' uses the npm package `@bentley/imodel-schema-validator` to perform the validation.

To run the 'iModelSchemaValidation' script, follow these steps:

1. Navigate to the bis-schemas folder from the command line or VS Code Terminal
1. Run `npm run iModelSchemaValidation`
    - To validate only released schemas: `npm run iModelSchemaValidation -- --released`
    - To validate a single released schema: `npm run iModelSchemaValidation -- --released SCHEMA-NAME`
        - For example to validate the released BisCore: `npm run iModelSchemaValidation -- --released BisCore`
    - To validate only wip schemas: `npm run iModelSchemaValidation -- --wip`
    - To validate a single wip schema: `npm run iModelSchemaValidation -- --wip SCHEMA-NAME`
        - For example to validate the wip BisCore: `npm run iModelSchemaValidation -- --wip BisCore`
    - To validate multiple schemas at once: `npm run iModelSchemaValidation -- --multiSchema JSON-PATH`
        - For example to validate the wip BisCore: `npm run iModelSchemaValidation -- --multiSchema C:\schemas.json`
        - The schemas.json can define group of schemas to be imported in order. Each schema group should list schema and reference schemas in correct order. An example json can be viewed by running `npm run iModelSchemaValidation -- --multiSchema`
    - To save the output logs to a custom location: `npm run iModelSchemaValidation -- --OutDir SOME-DIR`
        - This command can be combined with any other command
        - The default log output directory is: `C:\Users\username\AppData\Local\Temp\SchemaValidation\Briefcases\validation`

#### Schema Upgrade Testing

In this testing, we take latest major versions e.g 3.x.x of a schema and try to import them into an iModel to test schema upgrade from oldest to latest e.g 3.0.0 to 3.0.1 to 3.0.2.

````usage: npm run iModelSchemaValidation -- --schemaUpgradeTesting --OutDir D:\dir````

**NOTE:** Schemas listed in the [ignore schema](https://github.com/iTwin/bis-schemas/blob/master/ignoreSchemaList.json) list are skipped when validating all schemas. To run validation against these schemas use a command like `npm run iModelSchemaValidation -- --wip Asset`

#### Snapshot Comparison

In this testing, the latest released version of Biscore and Functional schemas are imported to an iModel and then information of tables, indexes of this iModel is extracted and compared with the [previously stored information](https://github.com/iTwin/bis-schemas/blob/master/snapshotInformation.json) for any possible changes.

````usage: npm run iModelSchemaValidation -- --compareSnapshot````

In case snapshots differ, use following command to generate new snapshot json:

````usage: npm run iModelSchemaValidation -- --generateSnapshot````














 










































## Schema Packaging

See [Schema Release Process](./docs/schema-release-process.md)

## Schema Documentation

See the documentation for writing schema documentation [here](./docs/writing-schema-documentation.md)
