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

### CheckSum Information

### When adding a new schema

1. **WIP Schema:**
A new entry will automatically be added to the SchemaInventory.json (at the root of bis-schemas), when a PR build occurs.

2. **Released Schema:**
Following are the steps:
     - Find the WIP schema in [SchemaInventory.json](https://github.com/iTwin/bis-schemas/blob/master/SchemaInventory.json) file.  

      - A new entry for the released schema needs to be added in [SchemaInventory.json](https://github.com/iTwin/bis-schemas/blob/master/SchemaInventory.json) file.  If the new schema is the first released version of the WIP schema then add the new section after the WIP schema, otherwise add the entry after the **latest released version**.

     - Sample new section:
     `
        {
        "name": "testSchema",
        "path": "Domains\\testSchema\\Released\\testSchema.01.00.04.ecschema.xml",
        "released": true,
        "version": "01.00.04",
        "comment": "",
        "sha1": "put the sha1 hash value here",
        "author": "FirstName.LastName",
        "approved": "Yes",
        "date": "MM/DD/YYYY",
        "dynamic": "No"
        },

     - Provide accurate values for all the keys in this new section otherwise schema validation can fail.
     - You should have these inventory changes in the same **Pull Request** where you have your new schema XML file. 

     **Note:** This manual step for released schemas will soon be replaced with a developer tool that will add the new entry, along with a generated checksum by itself.
`
### When updating an existing schema
When an already added schema is changed, you can update its Sha1 Hash and the other information in [SchemaInventory.json](https://github.com/iTwin/bis-schemas/blob/master/SchemaInventory.json) file:  
- Locate the entry by schema name and version in [SchemaInventory.json](https://github.com/iTwin/bis-schemas/blob/master/SchemaInventory.json) e.g `SchemaName.version.ecschema.xml`. You will see a section, having some key,value pairs containing the information about that schema.
- Verify and update any necessary fields.
- Any schema inventory changes should be in the same **Pull Request** as the schema XML file changes.

### Managing permissions to BIS Schema

Every BIS Schema within the repository has an associated owner. The owner is in charge of managing Pull Requests and permissions to the BIS Schema(s).

Permissions for an individual domain schema, or a domain group are managed through a [CODEOWNERS](https://github.com/iTwin/bis-schemas/tree/master/.github/CODEOWNERS).

The Team is owned by the schema owner, which gives them the ability to add/remove people from that team. A given team can be setup as a required reviewer for Schema(s) it owns. Anyone within that team can review/approve pull requests to the schemas. (Note: If you are within the team and you make a pull request you will still need at least one additional reviewer.)

#



## Schema Validation

A build is setup to validate schemas against a set of [validation rules](https://imodeljs.github.io/iModelJs-docs-output/bis/intro/bis-schema-validation/). Additionally, it performs a difference audit of all schemas against their latest released version, if one exists. It also validates these latest released versions by first importing them into an imodel and then validating them using [imodel-schema-validator](#imodel-schema-validation). The validation and difference logs are published as build artifacts and made accessible.









Please invite the certification team of your bridge to verify the checksums of your published iModel schemas againt the latest approved checksums.




    - See [iModel Schema Validation](#imodel-schema-validation) for details on how to do this.






### iModel Schema Validation

A new TypeScript based tool **imodel-schema-validator** is now available to validate the schemas within an iModel. It downloads the briefcase of the given iModel and export all the schemas within it, then it performs following 4 validations against these exported schemas: 

- **BIS-Rules Validation:** All schemas are validated against [BIS-Rules](https://www.imodeljs.org/bis/intro/bis-schema-validation/).
- **Comparison Validation:** All schemas are compared with their similar (exact version match) released schemas within bis-schemas.
- **Sha1 Hash Validation:** Sha1 Hash is generated for each exported schema and compared against the set of hashes of released schemas present in [SchemaInventory](https://github.com/iTwin/bis-schemas/blob/master/SchemaInventory.json).
- **Approval Validation:** Approval status of each schema is checked from [SchemaInventory](https://github.com/iTwin/bis-schemas/blob/master/SchemaInventory.json).




 


   

  

  
  
   
  
    

  




To setup and use this tool locally, follow the instructions in [imodel-schema-validator readme.md](https://github.com/iTwin/bis-schema-validation/tree/master/imodel-schema-validator).

## Schema Packaging - *WIP*

See [Schema Release Proposal](./docs/schema-release-process.md)

## Schema Documentation

See the documentation for writing schema documentation [here](./docs/writing-schema-documentation.md)
