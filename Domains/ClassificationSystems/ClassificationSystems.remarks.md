---
noEditThisPage: true
remarksTarget: ClassificationSystems.ecschema.md
---

# ClassificationSystems

This schema contains classes that are used for the arrangement of objects into a class or category according to a common purpose or their possession of common characteristics. It is a taxonomy, or taxonomic scheme, arranged in a hierarchical structure

## ClassificationSystem

`ClassificationSystem` identifies the classification system that the individual Classifications belong to.
A `ClassificationSystem` owns `ClassificationTable` elements which further break down into `Classification` and `ClassificationGroup` elements.

- It is recommended to put globally-applicable classification systems in the DictionaryModel. However in cases where classification system seems to be local for some purpose, it is reasonable to put the `ClassificationSystem` in any other DefinitionModel.
- The Code for all global `ClassificationSystem` elements is expected to have the following components:
  - `CodeSpec.Id` - The Id of the CodeSpec with the name `"clsf:ClassificationSystem"`.
  - `CodeScope.Id` - The root SubjectId for global classification systems. If the classification system is not deemed global, this should be something other than the root SubjectId.
  - `CodeValue` - Should be set to `name + " " + edition`.
- UniClass 2015, UniClass 2018 and OmniClass are examples of classification systems. Organizations may have their own custom classification systems as well.

It is expected that any iModel will not contain all known classification systems, instead, an iModel will only contain those classification systems that are used from within the iModel and possibly only those parts of the classification system hierarchy that are used.

### Mapping to and from IFC

| From BIS    | Condition | To IFC    | Condition |
| ----------- | --------- | --------- | --------- |
| `ClassificationTable` + `ClassificationSystem`  | (none) | `IfcClassification` | (none) |

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| `IfcClassification` | (none) | `ClassificationTable` + `ClassificationSystem` | (none) |

## ClassificationTable

`ClassificationTable` defines a table in `ClassificationSystem` as defined in the original ClassificationSystem source. a Classification Table represents a division of classification system into classifications of different purposes.

- *OmniClass Construction Entities by Function - Table 11* and *UniClass 2015 En Entities* are examples of classification tables.
- The Code for all `ClassificationTable` elements is expected to have the following components:
  - `CodeSpec.Id` - The Id of the CodeSpec with the name `"clsf:ClassificationTable"`.
  - `CodeScope.Id` - The Id of the owning `ClassificationSystem` which should be the same as the `Parent.Id` property of the `ClassificationTable`.
  - `CodeValue` - The name of the classification table.

A `ClassificationTable` will contain `Classification` and `ClassificationGroup` elements in its sub-model.

### Mapping to and from IFC

| From BIS    | Condition | To IFC    | Condition |
| ----------- | --------- | --------- | --------- |
| `ClassificationTable` + `ClassificationSystem`  | (none) | `IfcClassification` | (none) |

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| `IfcClassification` | (none) | `ClassificationTable` + `ClassificationSystem` | (none) |

## ClassificationGroup

a `ClassificationGroup` is a group of `Classification` elements, as grouped originally in the source classification system. the `Classification` elements are assigned to a group via `ClassificationGroupGroupsClassifications` relationship.

- MasterFormat subdivisions and ASHRAE 62.1 Occupancy Category groupings are examples of classification groups.

### Mapping to and from IFC

is not mapped to or from IFC, as the group concept does not exist in IFC

## Classification

a `Classification` element is a reference into a classification system for a specific classification key (or notation).

- OmniClass 11-13 11 11 and UniClass 2015 En_20_10_45 are examples of classifications
- The Code for classifications is expected to have the following components: is required to be in the form of (ClassificationTable.id, ClassificationName, CodeSpecId("Classification"))
  - `CodeSpec.Id` - The Id of the CodeSpec with the name `"clsf:Classification"`.
  - `CodeScope.Id` - The Id of the *parent* Element or *containing* Model which should be one of the following:
    - The Id of the containing `ClassificationTable` for top-level classifications of complex classification systems like OmniClass and UniClass.
    - The Id of the owning `ClassificationSystem` for less complex classification systems that do not need classification tables.
    - The Id of the *parent* `Classification` in the case of a sub-classification.
  - `CodeValue` - The name of the classification.

a `Classification` may be specializing another `Classification` element, via the `ClassificationSpecializesClassification` relationship.

- MasterFormat: 00 31 13 Preliminary Schedules -> 00 31 13.13 Preliminary Project Schedule and OmniClass Table 13: 13-11 00 00 Space Planning Types -> 13-11 11 00 Planned Work Space are examples of classification specialization.

An element may be classified as multiple Classifications through the `ElementHasClassifications` relationship.

### Mapping to and from IFC

| From BIS    | Condition | To IFC    | Condition |
| ----------- | --------- | --------- | --------- |
| `Classification`  | (none) | `IfcClassificationReference` | (none) |

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| `IfcClassificationReference` | (none) | `Classification` | (none) |
