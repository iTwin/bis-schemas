# BIS Schema Release process for npm packages

## Consuming BIS Schemas

BIS Schemas can be consumed via automatically published npm packages which is the best option for Typescript based software.


 

 



### New Released Version Schemas

- A new npm package is created when a new version of a schema is added to the "Released" directory and meets the release criteria
  - Creates the npm package and publish them
- The version of the npm package will be the exact version of the schema.
  - A project that consumes a schema package will automatically update to the lastest version compatible with the version tag they list in their package.json
    - Note: With the correct syntax for adding dependencies this can match how schemas versions are added to an iModel.

### Non-released/pre-release Schemas

Pre-release schemas can be new versions of a schema that are still undergoing testing and development, or a completely new schema that is being developed.

- A new prerelease version will be automatically generated every time the working version of a schema is merged into master.
- Pre-release flags are used to handle unreleased schemas
  - A schema with version 1.0.1 will be published with the package version: `1.0.1-dev.x`
- To consume a pre-release schema it must be explicitly stated in the npm/nuget dependency that this is desired
  - Gets around accidentally depending on a non-released schema
  - Can always be on the tip of dependent schemas if still in active development of the schema
  - Example for consuming a pre-release: `~1.0.1-dev.1 <1.0.1` would match any package with version `1.0.1-dev.x` but not match `1.0.1`.

## Implementation

- The packaging is done automatically via javascript files run as part of the bis-schemas CI jobs

### npm packages

The npm packages published will not have any dependencies, it will be up to the consumer to pull in all required schemas.

### Current Issues

- Not enough checks are done when creating the released schema packages.  So be very careful that the schema really should be released before merging into master.  Once an npm package is published for a schema you cannot change or republish it.
