---
noEditThisPage: true
remarksTarget: SpatialComposition.ecschema.md
---

# SpatialComposition

This schema contains classes that are used to model the spatial structure. That spatial structure is often used to provide a spatial project structure to organize a building project.

A spatial project structure might define as many levels of decomposition as necessary for the building project. 


Due to the importance of IFC in coordinating physical infrastructure, the classes in the schema are intended to have a 1:1 instance mapping (not *class* mapping!) with IFC that will work for transformations in either direction.  It is expected that round-trip transformations may result in changes that provide an *equivalent*, but not *identical* model.

## CompositeElement

A composite element (IfcSpatialStructureElement) is the generalization of all spatial elements that might be used to define a spatial structure. 

### Usage

CompositeElement should be placed below the `CompositeElement.ComposingElement` in the model hierarchy. It is recommended that `CompositeComposesSubComposites` is identical to the model breakdown, but not required.
A CompositeElement may geometrically overlap other elements and that information could be recorded in `CompositeElementOverlapsSpatialElement` relationship table.

### Mapping to and from IFC

`CompositeElement` is abstract, and hence there is never a need to map to or from `IfcSpatialStructureElement` instances.

## ICompositeBoundary

mixin used to note that the element is of Boundary type (most commonly a curvevector geometry), often the original data is 
in the form of points on the map or metes and bounds string or similar

### Mapping to and from IFC

`ICompositeBoundary` is a mixin class and does not have a mapping to or from IFC.

## ICompositeVolume
mixin used to note that the element is of volumetric type, most commonly an extrusion geometry.


### Mapping to and from IFC

`ICompositeVolume` is a mixin class and does not have a mapping to or from IFC.

