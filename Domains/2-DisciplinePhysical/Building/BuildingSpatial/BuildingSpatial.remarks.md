---
noEditThisPage: true
remarksTarget: BuildingSpatial.ecschema.md
---

# BuildingSpatial

This schema contains the concrete classes that are used to model the spatial structure of a building.That spatial structure is often used to provide a project structure to organize a building project.

Due to the importance of IFC in coordinating spatial structure, the classes in the schema are intended to have a 1:1 instance mapping (not *class* mapping!) with IFC that will work for transformations in either direction.  It is expected that round-trip transformations may result in changes that provide an *equivalent*, but not *identical* model.

## Entity Classes

### Building

A `Building` represents a structure that provides shelter for its occupants or contents and stands in one place. The building is also used to provide a basic element within the spatial structure hierarchy for the components of a building project (together with site, story, and space).

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspectPs, key relationships. --->
A `Building` is typically aggregated by a `Site`. A `Building` may also compose a `Site`. Decomposes into `Story` or `Space` elements.

Equivalent to [IfcBuilding](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcBuilding.htm) with CompositionType == ELEMENT.

<!-- the COMPLEX or PARTIAL type we do not immediately need, could be introduced in future versions of the schema -->

### Space

A `Space` represents a volume bounded actually or theoretically. Spaces are volumes that provide for certain functions within a CompositeElement.
The `Space` is used to build the spatial structure of a building (that serves as the primary project breakdown and is required to be hierarchical). The composite elements are linked together by using the relationship `CompositeComposesSubComposites`.

A `Space` is typically aggregated by a `Story` or another `Space`. `Space` elements compose stories and other spaces, and they may also decompose into spaces.

Equivalent to [IfcSpace](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcSpace.htm) with CompositionType != COMPLEX.


#### Space Occupancy

A `Space` can have its occupancy requirements defined within `SpaceOccupancyAspect`. The aspect will typically be assigned to `Spacetype` if one is modeled for a space, In cases where `Space` does not have `SpaceType` assigned, the `SpaceOccupancyAspect` can be related directly.

### Story

The building `Story` typically represents a (nearly) horizontal aggregation of spaces that are vertically bound.

A story is (if specified) associated to a building.

The `Story` is used to build the spatial structure of a building (that serves as the primary project breakdown and is required to be hierarchical). The spatial composition elements are linked together by using the objectified relationship `CompositeComposesSubComposites`.

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->

A `Story` is typically aggregated by a `Building`. `Story` elements compose a `Building`, they also decompose into `Space` elements.

`Story` is abstract, and hence there is never a need to map to or from [IfcBuildingStorey](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcBuildingStorey.htm) instances.

### ElevationStory

`ElevationStory` is bounded by elevations and sometimes other boundary properties. Typically represents a (nearly) horizontal aggregation of spaces that are vertically bound.

<!-- there's only 2 reasons we're not mentioning Grids:ElevationGridSurface instead of "elevations" here 1- it's because grids have not been marked "released" yet. 2-we don't have reference to grids here __yet__ --->

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->

An `ElevationStory` is typically aggregated by a `Building`. `ElevationStory` elements compose a `Building`, they also decompose into spaces.

`ElevationStory` is abstract, and hence there is never a need to map to or from [IfcBuildingStorey](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcBuildingStorey.htm) instances.

## RegularStory

A `RegularStory` is bounded by top and bottom elevations. Typically represents a (nearly) horizontal aggregation of spaces that are vertically bound.

An `RegularStory` is typically aggregated by a `Building`. `RegularStory` elements compose a `Building`, they also decompose into spaces.

Equivalent to [IfcBuildingStorey](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcBuildingStorey.htm) with CompositionType == ELEMENT.

<!-- for CompositionType != ELEMENT, we expect other subclasses of either Story or ElevationStory, i.e. SplitStory for type=PARTIAL. those subclasses would be added in the future versions of the schema. some other subclasses are also controversial, that's why we're leaving them out. i.e. SharedStory @ speedikon -->
