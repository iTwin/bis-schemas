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

### Managing permissions to BIS Schema

Every BIS Schema within the repository has an associated owner. The owner is in charge of managing Pull Requests and permissions to the BIS Schema(s).

Permissions for an individual domain schema, or a domain group are managed through a [CODEOWNERS](https://github.com/iTwin/bis-schemas/tree/master/.github/CODEOWNERS).

The Team is owned by the schema owner, which gives them the ability to add/remove people from that team. A given team can be setup as a required reviewer for Schema(s) it owns. Anyone within that team can review/approve pull requests to the schemas. (Note: If you are within the team and you make a pull request you will still need at least one additional reviewer.)

#



## Schema Validation

A build is set up to validate schemas against a set of [validation rules](https://imodeljs.github.io/iModelJs-docs-output/bis/intro/bis-schema-validation/). Additionally, it performs a difference audit of all schemas against their latest released version, if one exists. The validation and difference logs are published as build artifacts and made accessible.









Please invite the certification team of your bridge to verify the checksums of your published iModel schemas againt the latest approved checksums.



1. Set up a new iModel Schema Validation job.
    - See [iModel Schema Validation](#imodel-schema-validation) for details on how to do this.
2. Run the new build job on a fresh iModel you published to iModelHub.
3. Any verification errors should be filed as a TR to the lead developer as a showstopper. This version of the bridge should NOT be used in production.






### iModel Schema Validation

The iModel Schema Validation tool imports each individual schema in the bis-schema repository (along with schema references) into an local snapshot iModel. The schemas are then exported to a temp directory in order to perform the required validations. 




2. Add the 'BIS - Verify iModel Schemas' task and fill out the following parameters:

- iModelName
- hubProjectID
- hubEnvironment
- hubUserName
- hubPassWord
  - It is recommended that you use a Secret variable for the password. Under the 'Variables' section, add a new variable and select the lock icon to make it secret. In the hubPassWord field, you can then use the variable like this: `$(variableName)`

See the iModel Schema Validation -- sample build definition for an example.

## Schema Packaging - *WIP*

See [Schema Release Proposal](./docs/schema-release-process.md)

## Schema Documentation

See the documentation for writing schema documentation [here](./docs/writing-schema-documentation.md)
