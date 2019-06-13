---
noEditThisPage: true
remarksTarget: Construction.ecschema.md
---
# Construction

This schema contains classes that are used to model the real-world entities from construction perspective. 
Supported workflows:
 - construction modeling - splitting up design data into the smaller pieces suitible for construction;
 - classification - cost codes assignment to the constructible components;
 - quantity takeoff - work steps quantities calculation.

## ConstructionModel

`ConstructionModel` is a container for persisting `ConstructionItem` instances and geometry elements that were split up into smaller pieces for construction. The sliced geometry elements retain the same class as the source element and point back to the source element through `GeometricElement3dSplitsGeometricElement3d` relationship. In the schema it is not limited to have a geometric element in `ConstructionModel` which does not refer to an element from design. 

In the bidding phase when multiple estimation teams (from the same organization or from multiple organizations when contactors are invited) are doing quantity takeoff, each team will have to store its data in a separate `ConstructionModel`. 

## ConstructionItem

`ConstructionItem` defines a constructible component which may or may not be modeled in the 3D model. When it is modeled in the 3D model, `ConstructionItem` may refer to one or multiple (i.e. prefabricated component which is installed as a whole) geometric elements. 

## GeometricElement3dSplitsGeometricElement3d 

This relationship allows to split any `bis:GeometricElement3d` element. However in construction workflows it doesn't make any sense to split geometric elements like annotations and etc. Application layer will control what elements are eligible for splitting.
