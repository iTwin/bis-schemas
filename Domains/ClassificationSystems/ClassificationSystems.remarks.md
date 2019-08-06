---
noEditThisPage: true
remarksTarget: ClassificationSystems.ecschema.md
---

# ClassificationSystems

This schema contains class definitions for Classifications.

These are used to classify elements as conforming to certain classifications like ASHRAE/CIBSE/OmniClass/MasterFormat and other.

## Entity Classes

### IClassified

A mixin which indicates that the element could be classified in classificationsystems.

### ClassificationSystem

An element which holds individual instances of `Classification` in the submodel. An Example of `ClassificationSystem` could be ASHRAE or OmniClass

### Classification

An element which holds a specific classification. i.e. ASHRAE62.1:Coffee stations

### ClassificationGroup

An element used to group multiple classifications together. intended to be used for groups as defined in original classification systems.

## Relationship Classes

### IClassifiedIsClassifiedAs

A relationship to map `IClassified` element to conformed intances of `Classification`

### ClassificationIsInClassificationGroup

A relationship to map instances of `Classification` to their groups (`ClassificationGroup`)

### ClassificationSpecializesClassification

A relationship to map instances of `Classification` to other Classifications they specialize
