---
noEditThisPage: true
remarksTarget: Construction.ecschema.md
---
# Construction

This schema contains classes that are used to model the real-world entities from the construction perspective. Supported workflows:
 - construction modeling - splitting up design data into the smaller pieces suitable for construction;
 - classification - cost codes assignment to the constructible components;
 - quantity takeoff - work steps quantities calculation.


### *Data organization in the repository*

Two partitions are used to model the data into the construction perspective: `SpatialLocationPartition` and `ConstructionPartition`. The `Subject` modeled by these two partitions represents the project scope to be estimated by a single team of estimators. 

In the bidding phase when multiple estimation teams (from the same organization or from multiple organizations when contactors are invited) are doing quantity takeoff, each team's data will be organized under a separate `Subject`.

## ConstructionSpatialModel

`ConstructionSpatialModel` is a container for persisting `ConstructionDetailingElement` instances. The sliced geometry elements point back to the source geometry element through `ConstructionDetailingElementSplitsGeometricElement3d` relationship. 
 
## ConstructionItem

`ConstructionItem` defines a constructible component which may or may not be modeled in the 3D model. When it is modeled in the 3D model, `ConstructionItem` may refer to one or multiple (i.e. prefabricated component which is installed as a whole) geometric elements. 

## ConstructionDetailingElementSplitsGeometricElement3d 

This relationship allows to split any `bis:GeometricElement3d` element. However in construction workflows it doesn't make any sense to split geometric elements like annotations and etc. Application layer will control what elements are eligible for splitting.
