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

Two partitions are used to model the data into the construction perspective: `PhysicalPartition` and `ConstructionInformationPartition`. The `Subject` modeled by these two partitions represents the project scope to be estimated by a single team of estimators. 

In the bidding phase when multiple estimation teams (from the same organization or from multiple organizations when contractors are invited) are doing quantity takeoff, each team's data will be organized under a separate `Subject`.

## ConstructionItem

`ConstructionItem` defines a constructible component which may or may not be modeled in the 3D model. 

Often design models lack details and aren't mature enough to take off accurate quantities for a construction project. But these non-modeled elements still need to be taken into account for cost estimation and work planning later. Examples of such non-modeled elements: manholes, traffic signs…

When constructible component is modeled in the 3D model, `ConstructionItem` refers to one or multiple (i.e. prefabricated component which is installed as a whole) geometric elements. 

## ConstructionDetailingElementSplitsGeometricElement3d 

Used to relate `ConstructionDetailingElement` instances to the source geometry element. Even though the source geometry can be any element of a class `bis:GeometricElement3d`, application layer will control what elements are eligible for splitting. For instance, in construction workflows it doesn't make any sense to split geometric elements like `bis:TextAnnotation3d` and similar.
