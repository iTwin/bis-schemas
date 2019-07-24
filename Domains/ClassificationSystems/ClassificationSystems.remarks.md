---
noEditThisPage: true
remarksTarget: ClassificationSystems.ecschema.md
---

# ClassificationSystems

This schema contains classes that are used for the arrangement of objects into a class or category according to a common purpose or their possession of common characteristics. It is a taxonomy, or taxonomic scheme, arranged in a hierarchical structure


## ClassificationSystem

`ClassificationSystem` identifies the classification system that the individual Classifications belong to.
A `ClassificationSystem` owns `ClassificationTable` elements which further break down into `Classification` and `ClassificationGroup` elements.

 - `ClassificationSystem`s recommended to be in the DictionaryModel. However in cases where ClassificationSystem seems to be local for some purpose, it is reasonable to put the `ClassificationSystem` in any other DefinitionModel.
 - DgnCode for all global classification systems is expected to be in the form of (RootSubjectId, ClassificationSystemName, CodeSpecId("ClassificationSystem")). if the classificationSystem is not deemed global, the scopeId should be other than the RootSubjectId.


It is expected that any iModel will not contain all known classification systems, instead, an iModel will only contain those ClassificationSystems that are used from within the iModel.

### ClassificationTable

`ClassificationTable` defines a table in `ClassificationSystem` as defined in the original ClassificationSystem source. a Classification Table represents a division of classification system into classifications of different purposes.

`ClassificationTable` will contain `Classification` and `ClassificationGroup` elements in the submodel.

### ClassificationGroup

a `ClassificationGroup` is a group of `Classification` elements, as grouped originally in the source classification system. the `Classification` elements are assigned to a group via `ClassificationGroupGroupsClassifications` relationship.

###Classification

a `Classification` element is a reference into a classification system for a specific classification key (or notation).

- DgnCode for classifications is required to be in the form of (ClassificationTable.id, ClassificationName, CodeSpecId("Classification"))

a `Classification` may be specializing another `Classification` element, via the `ClassificationSpecializesClassification` relationship.

An element may be classified as multiple Classifications through the `ElementIsClassifiedAs` relationship.
