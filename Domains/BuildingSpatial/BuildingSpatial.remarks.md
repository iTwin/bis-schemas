---
noEditThisPage: true
remarksTarget: BuildingSpatial.ecschema.md
---

# BuildingSpatial

This schema contains the concrete classes that are used to model the spatial structure of a building.That spatial structure is often used to provide a project structure to organize a building project.

Due to the importance of IFC in coordinating spatial structure, the classes in the schema are intended to have a 1:1 instance mapping (not *class* mapping!) with IFC that will work for transformations in either direction.  It is expected that round-trip transformations may result in changes that provide an *equivalent*, but not *identical* model.

## Building

A `Building` represents a structure that provides shelter for its occupants or contents and stands in one place. The building is also used to provide a basic element within the spatial structure hierarchy for the components of a building project (together with site, story, and space).

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
A `Building` is recommended to be placed in the submodel of a `Site`. A `Building` may also compose a `Site`. Decomposes into `Story` or `Space` elements.

### Mapping to and from IFC

| From BIS    | Condition | To IFC    | Condition |
| ----------- | --------- | --------- | --------- |
| `Building`  | (none) | `IfcBuilding` | CompositionType == ELEMENT |


<!-- the COMPLEX or PARTIAL type we do not immediately need, could be introduced in future versions of the schema -->

<!-- additional mapping notes go here -->

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| `IfcBuilding` | CompositionType == ELEMENT | `Building` | (none) |

<!-- additional mapping notes go here -->
## Space

A `Space` represents a volume bounded actually or theoretically. Spaces are volumes that provide for certain functions within a CompositeElement.
The `Space` is used to build the spatial structure of a building (that serves as the primary project breakdown and is required to be hierarchical). The composite elements are linked together by using the relationship `CompositeComposesSubComposites`.

### Usage

A `Space` is recommended to be placed in the submodel of a `Story` or another `Space`. `Space` elements compose stories and other spaces, and they may also decompose into spaces.

### Mapping to and from IFC

| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| `Space` | (none) | `IfcSpace` | (CompositionType != COMPLEX) |

<!--   -->

<!-- additional mapping notes go here -->

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| `IfcSpace`| (none) | `Space` | (none) |

<!-- additional mapping notes go here -->

## Story

The building `Story` typically represents a (nearly) horizontal aggregation of spaces that are vertically bound.

A story is (if specified) associated to a building. 

The `Story` is used to build the spatial structure of a building (that serves as the primary project breakdown and is required to be hierarchical). The spatial composition elements are linked together by using the objectified relationship `CompositeComposesSubComposites`.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->

A `Story` is recommended to be placed in the submodel of a `Building`. `Story` elements compose a `Building`, they also decompose into `Space` elements.

### Mapping to and from IFC

`Story` is abstract, and hence there is never a need to map to or from `IfcBuildingStorey` instances.

## ElevationStory

`ElevationStory` is bounded by elevations and sometimes other boundary properties. Typically represents a (nearly) horizontal aggregation of spaces that are vertically bound.

<!-- there's only 2 reasons we're not mentioning Grids:ElevationGridSurface instead of "elevations" here 1- it's because grids have not been marked "released" yet. 2-we don't have reference to grids here __yet__ --->

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->

An `ElevationStory` is recommended to be placed in the submodel of a `Building`. `ElevationStory` elements compose a `Building`, they also decompose into spaces.

### Mapping to and from IFC

`ElevationStory` is abstract, and hence there is never a need to map to or from `IfcBuildingStorey` instances.

## RegularStory

A `RegularStory` is bounded by top and bottom elevations. Typically represents a (nearly) horizontal aggregation of spaces that are vertically bound.

### Usage


An `RegularStory` is recommended to be placed in the submodel of a `Building`. `RegularStory` elements compose a `Building`, they also decompose into spaces.

### Mapping to and from IFC

| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| RegularStory      | (any) | IfcBuildingStorey | CompositionType == ELEMENT |

<!-- additional mapping notes go here -->

| From IFC | Condition | To BIS | Condition |
| --------- | --------- | --------- | --------- |
| IfcBuildingStorey             | CompositionType == ELEMENT | RegularStory | (none) |

<!-- for CompositionType != ELEMENT, we expect other subclasses of either Story or ElevationStory, i.e. SplitStory for type=PARTIAL. those subclasses would be added in the future versions of the schema. some other subclasses are also controversion, that's why we're leaving them out. i.e. SharedStory @ speedikon -->
