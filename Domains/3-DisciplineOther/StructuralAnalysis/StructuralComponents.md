# Structural Components Hierrarchy

## Overview

## Standard Organizations and Structural Components Catalog

Standard Organizations primary function is developing and maintaining manuals that specify technical standards for various structural components - Beam/Column Sections, Steel Decks, Joists, etc. Examples of standard organizations are - "AISC", "CEN", "VERCO". iModels are not expected to contain Elements that represent Standard Organizations, only specific manuals are defined. 

### Standard Organizations Definiton Container

The top level Element of StandardOrganization structure is defined as a single sub-modeled instance of `DefinitonContainer`. This Element is expected to have a Code with value set to "Standard Organizations", scope set to `Repository` Model id, spec set to "bis:DefinitionContainer". "Standard Organizations" Element is expected to be stored under `DictionaryModel`.

### StandardOrganizations Model

#### Classification System

"Standard Organizations" `DefinitionContainer` is broken down to a model that stores Elements that represents manuals. Manuals are defined as `ClassificationSystem` Elements where each Element represents only a single revision/edition of a catalog released, maintained by Standard Organization. `Code` value of the Manual element is expected to be concatination of StandardOrganization name and the manual name itself, e.g. `ClassificationSystem` that represents Standard Organization "CEN"'s "EU 19-53" Profile catalog edition would have a Code with value "CEN EU 19-53". `CodeScope` is expected to be set to `DictionaryModel` id, `CodeSpec` to `clsf:ClassificationSystem`.

#### Classification Table

The Manuals are expected to have child Elements (`ClassificationTable`) that divide the manual into groups by use case. e.g. Same manual might define both Beam Profiles and Steel Decks. The CodeScope of each `ClassificationTable` should be set to `ParentElement`. CodeSpec to "bis:ClassificationTable". Code values depend on the `ClassificationTable`'s use case:

- Structural Profile Classifaction Table should have CodeValue set to "Structural Profiles"
- Steel Decks to "Structural Steel Decks"
- Joists to "Structural Joists"

Each `ClassificationTable` is the broken down by a model that stores separate `Classifaction`s that belong to that table.

#### Classifications

`Classification` Elements define the actual entries of any Standard Catalog, e.g. AISC 7th Edition Structural Profile Catalog entires would be defined as separate `Classifications` containing all entries from that specific catalog edition.
Each `Classifcation` CodeScope would be set to `Model`, each CodeSpec to `clsf:Classifcation`. The value would be set as Designation of that entry. (e.g. "W44X335"). `Classification` Elements would not define any properties that are defined by the actual real world catalog entries. Instead, such properties would be defined by separate Elements that reference classifications using `ElementHasClassifications` relationship.

### Structural Components Catalog Definition Container

Structural Compenents Catalog Hierrarchy defines actual structural components - Profiles, Steel Decks, Joists, etc... The top level Element of the hierrarchy is `DefinitionContainer` that is stored under `DictionaryModel`. The Code assigned to it consists of "Structural Components Catalog" value, `Repository` Model id scope, "bis:DefinitionContainer" spec. This container is broken down into case scpecific `DefinitionContainer` Elements - Profiles, Joists, Steel Decks, etc. Each container has a CodeScope set to "Structural Components Catalog" id, CodeSpec set to `bis:DefinitionContainer`. CodeValue depends on container's use case:

- "Structural Profiles" code is used for Profiles
- "Structural Steel Joists" for Joists
- "Structural Steel Decks" for Steel Decks

Each container is then broken down further. Where each sub-model contains the actual definitions of Structural Components - Profiles, SteelDecks, etc. These Elements are expected to refer to at least one Classification that the component fulfils. `ElementHasClassifications` relationship is used to relate Component with it's classification.
