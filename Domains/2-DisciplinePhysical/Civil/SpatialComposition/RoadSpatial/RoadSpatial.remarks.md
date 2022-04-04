---
noEditThisPage: true
remarksTarget: RoadSpatial.ecschema.md
---

# RoadSpatial

This schema contains the main classes to capture the Spatial Structure of Road projects.

NOTE: Currently under development. This schema should not be used for production workflows. Data created using this schema is not supported and may not be upgradable.

## Entity Classes

### Road

As a subclass of `spcomp:Facility`, a `Road` instance provides the basic element in the Spatial Structure hierarchy for the components of a road project (i.e. any undertaking such as design, construction or maintenance).

`Road`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s and can be linearly located, typically along an *Alignment*.

Equivalent to [IfcRoad](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcroad.htm).

### RoadwayPlateau

A `Road` instance typically aggregates only one instance of `RoadwayPlateau`.

`RoadwayPlateau`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s and can be linearly located, typically along an *Alignment*.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcRoadPartTypeEnum.ROADWAYPLATEAU](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcroadparttypeenum.htm).

### CentralReserve

In the typical case, a `CentralReserve` instance models the area that separates the roadways of a road with dual roadways, (US:Median, UK:Central reservation). A `RoadwayPlateau` instance typically aggregates zero or more instances of `CentralReserve`.

`CentralReserve`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcRoadPartTypeEnum.CENTRALRESERVE](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcroadparttypeenum.htm).

### CentralReservePart

`CentralReservePart`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s and can be linearly located, typically along an *Alignment*.

### RoadSide

A `RoadSide` instance generally models the area adjoining the outer edges of shoulders.

A `Road` instance typically aggregates two instances of `RoadSide`. `JunctionElement`s can also aggregate `RoadSide`s.

`RoadSide`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcRoadPartTypeEnum.ROADSIDE](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcroadparttypeenum.htm).

### RoadSidePart

Examples of `RoadSidePart` may be side slopes, roadside ditches, back slopes, bunds etc.

`RoadSidePart`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s and can be linearly located, typically along an *Alignment*.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcRoadPartTypeEnum.ROADSIDEPART](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcroadparttypeenum.htm).

### Roadway

`Roadway`s may comprise several kinds of traffic lanes and lay-bys, as well as traffic islands, and in the case of a dual roadway road, they are separated by central reserve (UK: Carriageway).

A `RoadwayPlateau` instance typically aggregates one or more instances of `Roadway`.

`Roadway`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s. An instance of `Roadway` may hold the `bis:PhysicalElement`s (e.g. `Course`s) directly underneath it, as part of the road's *pavement* structure.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcRoadPartTypeEnum.CARRIAGEWAY](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcroadparttypeenum.htm).

### TrafficLane

A `Roadway` instance typically aggregates one or more instances of `TrafficLane`.

`TrafficLane`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s and can be linearly located, typically along an *Alignment*. An instance of `TrafficLane` may hold the `bis:PhysicalElement`s (e.g. *Course*s) directly underneath it, as part of the road's *pavement* structure.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcRoadPartTypeEnum.TRAFFICLANE](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcroadparttypeenum.htm).

### Shoulder

Shoulders are not intended for vehicular traffic but may be used in case of emergency. They provide lateral support to a roadway.

Instances of `Shoulder` are typically aggregated by an instance of `RoadwayPlateau`. Inner shoulders in between roadways of a dual roadway road are generally aggregated by an instance of `CentralReserve`.

`Shoulder`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s and can be linearly located, typically along an *Alignment*. An instance of `Shoulder` may hold the `bis:PhysicalElement`s (e.g. *Course*s) directly underneath it, as part of the road's *pavement* structure.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcRoadPartTypeEnum.SHOULDER](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcroadparttypeenum.htm).

### Sidewalk

A sidewalk may accommodate moderate changes in grade (elevation) and is normally separated from the vehicular section by a curb. There may be a central reserve between the sidewalk and traffic lanes.

A `RoadwayPlateau` instance typically aggregates zero or more instances of `Sidewalk`.

`Sidewalk`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s and can be linearly located, typically along an *Alignment*. An instance of `Sidewalk` typically holds the `bis:PhysicalElement`s (e.g. *Course*s) comprising its *pavement* structure.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcRoadPartTypeEnum.SIDEWALK](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcroadparttypeenum.htm).

### JunctionElement

Only one instance of `Road` can aggregate an instance of `JunctionElement`. Other `Road`s meeting or crossing the same `JunctionElement` shall use the `RoadIncludesJunctions` relationship to indicate association with it.

`JunctionElement`s can be indirectly linearly-located along more than one *Linear-Element* (e.g. *Alignment*). That can be achieved with the help of additional elements carrying the associated linear referencing data for each *Linear-Element*. These additional elements are expected to implement the `lr:ILinearLocationElement` mix-in from the LinearReferencing BIS schema, and use instances of the `lr:ILinearLocationLocatesElement` relationship to associate them with a `JunctionElement`. Note that the LinearReferencing BIS schema offers two generic concrete classes implementing the `lr:ILinearLocationElement` mix-in that can be used in this case, depending on the nature of the data: `lr:LinearLocation` and `lr:LinearLocationRecord`. The former is a `bis:SpatialLocationElement` whereas the latter is a `bis:InformationRecordElement`.

### Intersection

A `Road` instance typically aggregates zero or more instances of `Intersection`. 

`Intersection`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s. An instance of `Intersection` typically holds the `bis:PhysicalElement`s (e.g. *Course*s) comprising its *pavement* structure.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcRoadPartTypeEnum.INTERSECTION](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcroadparttypeenum.htm).