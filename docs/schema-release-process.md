# # BIS Schema Release process for npm packages

## Consuming BIS Schemas

BIS Schemas can be consumed via automatically published npm packages which is the best option for Typescript based software.

 
 



 

 

### New Released Version Schemas

- A new npm package is created when a new version of a schema is added to the "Released" directory and meets the release criteria
  - Creates the npm package and publish them
- The version of the npm package will be the exact version of the schema.
  - When an npm install happens it will be up to semantic versioning to pull in the correct version
    - Note: With the correct syntax for adding dependencies this can match how schemas versions are added to an iModel.

### Non-released/pre-release Schemas

Pre-release schemas can be new versions of a schema that are still undergoing testing and development, or a completely new schema that is being developed.

- Use pre-release flags to handle unreleased schemas version
  - Schema version is, 1.0.1, the version number of the prerelease will be, `1.0.1-beta.x`
- To consume a pre-release schema it must be explicitly stated in the npm/nuget dependency that this is desired
  - Gets around accidentally depending on a non-released schema
  - Can always be on the tip of dependent schemas if still in active development of the schema
  - Example for consuming a pre-release: `~1.0.1-beta.1 <1.0.1` would match any package with version `1.0.1-beta.x` but not match `1.0.1`.

## Implementation

- The packaging is done automatically via javascript files run as part of the bis-schemas CI jobs

  
    

### npm packages

The npm packages published will not have any dependencies, it will be up to the consumer to pull in all required schemas.



```xml

```









## Notes

- If the BIS Schema lives in the bis-schemas repository as the SSOT it could get updates for non-released versions faster.

### Current Issues

- Only pre-release versions are supported.  There needs to be investigation into automatic release and upgrade for "real" versions of schemas.
  - We started with pre-release versions in case we made a mistake and didn't want to use up the true set of version numbers.
- NuGet package release has not be investigated for any schemas yet.  The demand for them has been lower than npm packages due to the priority of iModel.js apps/services.
