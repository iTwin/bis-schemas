# BIS ECSchemas

This repository is __*going*__ to be the single source of truth for all BIS schemas.

The first step is regularly (timing TBD) merging all current BIS schemas from their current location into this repository, preserving change history. A side affect is all BIS schemas, that reside elsewhere, need to be read-only in this repository. This is accomplished by not approving any pull request (see [Contributing](#contributing)) that contains a change to one of the schemas.

## Contributing

All contributions to this repository will be done via [pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) to the master branch.

Each BIS Schema will have an owner, or owners. The owner(s) of a given BIS Schema will have to approve all pull requests before they are merged into the master branch. The owner will automatically be added as a required reviewer to a pull request if it corresponds with their domain directory (see [directory structure](#directory-structure)).

All other changes made outside of a domain directory will require review by a repository owner(s). The repository owner(s) will be added as optional reviewer(s) to all pull requests that are created within domain directories.

### Getting a new BIS Schema added

#### Add to an existing domain

The addition of the new BIS Schemas will be at the discretion of the own of the domain directory it is to be added. The BIS Schema must follow the [directory structure](#directory-structure) of this repository to be added.

#### Add a new domain

Given that all pull requests outside of a domain directory require a repository owner to review, they are required to review any new domains added. The domain must follow the directory structure, and then identify a person who is designated as the domain owner(s), who will handle all future pull requests.

## Directory Structure

The repository is split up into two main parts the tooling, that is needed to process and validate the schemas, and the schemas. All of the tooling will be under the "tools" directory at the root of the repository.  

The BIS schemas will all live under the "Domains" directory, which is on the root, and will be broken up based on domain and the individual schemas. Each domain will have their own directory, this provides the permissions control to the domain owner. All domains are placed under the "Domains" directory. How the each domain directory is split up will be up to their discretion.

Example:
```
\Domains\Dgn\
\Domains\Dgn\BisCore\
\Domains\Dgn\BisCore\BisCore.ecschema.xml
\Domains\ECO\
\Domains\ECO\ECObjects.ecschema.xml

\Domains\{DomainName}\
\Domains\{DomainName}\{DomainSchemaName}\
\Domains\{DomainName}\{DomainSchemaName}\{DomainSchemaName}.ecschema.xml
```
