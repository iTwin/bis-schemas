# BIS ECSchemas

This repository is the single-source-of-truth (SSOT) for all BIS schemas.

List of current BIS Schemas in this repository as SSOT:

- AecUnits
- Building\ArchitecturalPhysicalSchema
- Building\BuildingDataGroupBase
- Building\BuildingPhysicalSchema
- BuildingSpatial
- ClassificationSystems
- Construction
- Core\Analytical
- Core\Asset
- Core\BisCore
- Core\Functional
- Core\Generic
- Core\PhysicalMaterial
- Earthwork
- ECObjects
- Egress
- FederatedDocumentStore
- Grids
- QuantityTakeoffsAspects
- PresentationRules
- Profiles
- DgnV8OpenRoadsDesigner
- LinearReferencing
- RoadRailAlignment
- RoadRailPhysical
- RealityModeling\DataCaptureSchema
- RealityModeling\PointCloudSchema
- RealityModeling\RasterSchema
- RealityModeling\ScalableMeshSchema
- RealityModeling\ThreeMxSchema
- Simulation4DResults
- SpatialComposition
- Structural
- Structural\PhysicalRebar
- StructuralAnalysis
- StructuralDesignConcrete

Weekly merges of all other BIS schemas are done from their current location into this repository, preserving change history. A side affect is all BIS schemas that reside elsewhere are read-only in this repository. This is enforced by not approving any pull request (see [Contributing](#contributing)) that contains a change to one of these schemas.

## Directory Structure

The repository is split up into two main parts; the tooling, used to process and validate the schemas, and the BIS Schemas.

All tooling will be under the "tools" directory at the root of the repository.

The BIS Domain Schemas all live under the "Domains" directory, organized by domain group. Each domain group has it own directory, allowing [permissions](#managing-permissions-to-bis-schema) control by the domain group owner. If necessary for finer-grained permissions management, domain group owners can create further subdirectories. Otherwise, all domain schemas should be in the top-level domain group directory. There will be a "Release" subdirectory to hold domain schemas that have been publicly released.

Example:

```shell
\Domains\{DomainGroupName}\{Domain1}.ecschema.xml
\Domains\{DomainGroupName}\{Domain2}.ecschema.xml
\Domains\{DomainGroupName}\Released\{Domain1.MM.mm.bb}.ecschema.xml
\Domains\{DomainGroupName}\Released\{Domain2.MM.mm.bb}.ecschema.xml
```

## Contributing

All contributions to this repository will be done via [pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) to the master branch.

Each BIS Schema will have an owner, or owners. The owner(s) of a given BIS Schema will have to approve all pull requests before they are merged into the master branch. The owner will automatically be added as a required reviewer to a pull request if it corresponds with their domain group directory (see [directory structure](#directory-structure)).

All other changes made outside of a domain group directory will require review by a repository owner(s). The repository owner(s) will be added as optional reviewer(s) to all pull requests that are created within domain group directories.

### Adding a new BIS Schema to the repository

#### Moving a schema from Mercurial to the Git as SSOT

An owner of a BIS Schema can move their Schema from Mercurial to this repository being the new Single-Source-Of-Truth with a few simple steps,

1. Ensure all consumers of the current Part delivering the Schema has Git installed. This proactively avoids not being able to successfully pull/build.
    - Update all PRG/Firebug Product builds to add Git as a build dependency
2. 

    - 
    
3. Identify the owner of the Schema and request the appropriate permissions.
    - See [Schema Permissions](#managing-permissions-to-bis-schema) for more information.
  
4. Request a final merge from Mercurial to Git.
    - Remove [file map](tools/hg2git/all_bis/filemaps) for individual Schema. 
5. 
6. Remove schemas from Mercurial.
7. Your BIS Schema is now officially moved!

#### Addition/modifications to existing domain Schema

The addition of the new BIS Schemas will be at the discretion of the owner of the domain group directory to which it is to be added. The BIS Schema must follow the [directory structure](#directory-structure) of this repository to be added.

#### Add a new domain

Given that all pull requests outside of a domain group directory require a repository owner to review, they are required to review any new domains added. The domain must follow the directory structure, and then identify a person who is designated as the domain owner(s), who will handle all future pull requests.

## Managing permissions to BIS Schema

Every BIS Schema within the repository has an associated owner. The owner is in charge of managing Pull Requests and permissions to the BIS Schema(s).

Permissions for an individual domain schema, or a domain group are managed through a [CODEOWNERS](https://github.com/iTwin/bis-schemas/tree/master/.github/CODEOWNERS).

The Team is owned by the schema owner, which gives them the ability to add/remove people from that team. A given team can be setup as a required reviewer for Schema(s) it owns. Anyone within that team can review/approve pull requests to the schemas. (Note: If you are within the team and you make a pull request you will still need at least one additional reviewer.)





## BIS Schema Tools

There are set of tools exposed as npm tasks to assist schema authors in managing new or modified schemas.

### Environment Setup

To successfully run the tools described in this section, follow the steps below to setup your environment.



     
    The steps provided in the link above should have added several lines to your .npmrc file (found in your user folder, %UserProfile%).    

2. Via the command line, navigate to the root of the bis-schemas repository.  If you have VS Code installed, open the bis-schemas folder, and open a new Terminal (Terminal -> New Terminal in the menu, or use the shortcut (Ctrl-Shift-`).  

3. Run the command 'npm install'.

### Update Schema Inventory

The [SchemaInventory.json](https://github.com/iTwin/bis-schemas/blob/master/SchemaInventory.json) file at the root of the bis-schemas repository contains an up-to-date inventory of all schemas in the bis-schemas repository. The schema inventory must be updated using the npm task 'updateSchemaInventory', defined in the bis-schemas package.json, for all pull-requests that define new schemas. This includes a new version of a work-in-progress schema or a new released schema.

*Missing schemas will cause the `Bis Schemas - TS Validation (Github)` build to fail during pull-requests builds of the bis-schemas repository.

````usage: npm run updateSchemaInventory````

To run the updateSchemaInventory script, follow these steps:

1. Navigate to the bis-schemas folder from the command line or VS Code Terminal
2. Run 'npm run updateSchemaInventory'
3. Verify that the modified SchemaInventory.json contains the new schema entries, and include the modified file in the pull-request along with the schema changes.
    - **New Released Schemas**: New Schema entries will contain an automatically generated Sha1 hash for the new schema. You must manually update the 'approved' and 'verified' fields of the new schema entry in SchemaInventory.json or the validation (noted above) will fail during pull-request builds.

### BIS Rule Validation

BIS rule validation consists of checking all schemas in the bis-schemas repository against a set of [validation rules](https://imodeljs.github.io/iModelJs-docs-output/bis/intro/bis-schema-validation/). The npm script 'validateSchemas' uses the npm package `@bentley/schema-validator` to perform the validation.

````usage: npm run validateSchemas [--] [--name SCHEMA-NAME]````

Example:  
````npm run validateSchemas -- --name BisCore````

|Optional argument | Description |
|------------------|-------------|
| --               | This argument instructs npm to pass subsequent arguments (i.e --name SCHEMA_NAME) to the invoked script, rather than to the npm command itself. Required only if --name SCHEMA_NAME is specified |  
| --name SCHEMA_NAME | If this flag is specified, only the schema(s) with the given name will be validated |

To run the 'validateSchemas' script, follow these steps:

1. Navigate to the bis-schemas folder from the command line or VS Code Terminal
2. Issue the command as described above.

### Schema Differencing

The Schema Differencing tool performs a difference audit of all schemas in the bis-schemas against their latest released version, if one exists. The npm script 'compareSchemas' uses the npm package `@bentley/schema-comparer` to perform the difference audit.

````usage: npm run compareSchemas [--] [--name SCHEMA-NAME]````

Example:  
````npm run compareSchemas -- --name BisCore````

|Optional argument | Description |
|------------------|-------------|
| --               | This argument instructs npm to pass subsequent arguments (i.e --name SCHEMA_NAME) to the invoked script, rather than to the npm command itself. Required only if --name SCHEMA_NAME is specified |
| --name SCHEMA_NAME | If this flag is specified, only the schema(s) with the given name will be validated. |

To run the 'compareSchemas' script, follow these steps:

1. Navigate to the bis-schemas folder from the command line or VS Code Terminal
2. Issue the command as described above.

### iModel Schema Validation

The iModel Schema Validation tool imports each individual schema in the bis-schema repository (along with schema references) into an local snapshot iModel. The schemas are then exported to a temp directory in order to perform the required validations. The following checks are performed:

- **BIS-Rules Validation:** All schemas are validated against [BIS-Rules](https://www.imodeljs.org/bis/intro/bis-schema-validation/) using the `@bentley/schema-validator` package.
- **Comparison Validation:** All schemas are compared with their similar (exact version match) released schemas within bis-schemas using the `@bentley/schema-comparer` package.
- **Sha1 Hash Validation:** Sha1 Hash is generated for each exported schema and compared against the set of hashes of released schemas present in [SchemaInventory](https://github.com/iTwin/bis-schemas/blob/master/SchemaInventory.json).
- **Approval Validation:** Approval status of each schema is checked from [SchemaInventory](https://github.com/iTwin/bis-schemas/blob/master/SchemaInventory.json).  

The npm script 'iModelSchemaValidation' uses the npm package [@bentley/imodel-schema-validater](https://www.npmjs.com/package/@bentley/imodel-schema-validator) to perform the validation.

````usage: npm run iModelSchemaValidation [--] [--wip [SCHEMA-NAME]] [--released [SCHEMA-NAME]]````

Example:  
 - Command 1: ````npm run iModelSchemaValidation -- --released BisCore````

 - Command 2: ````npm run iModelSchemaValidation -- --released````

The first command will validate the latest released version of BisCore and the second command will validate the latest released versions of all released schemas in bis-schemas repository.

|Optional argument | Description |
|------------------|-------------|
| --               | This argument instructs npm to pass subsequent arguments (i.e --released) to the invoked script, rather than to the npm command itself. Required only if one of the optional flags are specified |
| --wip [SCHEMA_NAME] | If this flag is specified, only work-in-progress schemas will be validated. If a schema name is specified, only the WIP schema(s) with the given name will be validated. |
 --released [SCHEMA_NAME] | If this flag is specified, only released schemas will be validated. If a schema name is specified, only released schema(s) with the given name will be validated. |
 --OutDir | This flag can be used to provide the desired output directory for logs. Default is ````C:\Users\username\AppData\Local\Temp\SchemaValidation\Briefcases\validation````. |

Running 'npm run iModelSchemaValidation' will validate ALL schemas in the bis-schemas repository.

To run the 'iModelSchemaValidation' script, follow these steps:

1. Navigate to the bis-schemas folder from the command line or VS Code Terminal
2. Issue the command as described above.

**NOTE:** The Asset schema is currently skipped when validating all WIP schemas due to known failures.  Specify 'Asset' explicitly using the --wip flag to validate the Asset schema.  
````npm run iModelSchemaValidation -- --wip Asset````












 


 
- **environment:** The environment where imodel is present. This tool supports three environments: DEV, QA and PROD.

- **iModelName:** Name of the imodel present in the project mentioned in projectid.


 

  











Please invite the certification team of your bridge to verify the checksums of your published iModel schemas againt the latest approved checksums.











## Schema Packaging - *WIP*

See [Schema Release Proposal](./docs/schema-release-process.md)

## Schema Documentation

See the documentation for writing schema documentation [here](./docs/writing-schema-documentation.md)
