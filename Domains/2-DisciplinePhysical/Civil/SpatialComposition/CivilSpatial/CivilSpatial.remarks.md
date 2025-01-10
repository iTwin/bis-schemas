---
noEditThisPage: true
remarksTarget: CivilSpatial.ecschema.md
---

# CivilSpatial

This schema contains the main classes to capture the Spatial Structure of Site projects.

NOTE: Currently under development. This schema should not be used for production workflows. Data created using this schema is not supported and may not be upgradable.

## Entity Classes

### Site

`Site`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

### ParkingArea

`ParkingArea`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

Equivalent to [IfcSpace](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcSpace.htm) with a PredefinedType attribute set to [IfcSpaceTypeEnum.PARKING](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcSpaceTypeEnum.htm).

### ParkingIsland

Instances of `ParkingIsland` are typically aggregated by instances of `ParkingArea` by using the `spcomp:SpatialStructureElementAggregatesElements` relationship.

`ParkingIsland`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

### ParkingRow

The number of Parking-spaces modeled in a single instance of `ParkingRow` is captured by its `ParkingSpaceCount` property.

`ParkingRow`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

### PondArea

Uses of permanent `PondArea`s include: to manage stormwater runoff, for protection against flooding, for erosion control, and to serve as an artificial wetland and improve the water quality in adjacent bodies of water.

When needed, a `PondArea` may aggregate smaller areas within their boundary, modeled as instances of `GenericArea`.

`PondArea`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

### Sidewalk

A `Sidewalk` instance may be aggregated by a `RoadwayPlateau` when defined as part of a `rdsp:Road`, or may be defined parallel to other `spcomp:Facility` instances.

When defined as part of a `rdsp:Road`, a sidewalk may accommodate moderate changes in grade (elevation) and is normally separated from the vehicular section by a curb. There may be a central reserve between the sidewalk and traffic lanes.

`Sidewalk`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s and can be linearly located, typically along an *Alignment*. An instance of `Sidewalk` typically holds the `bis:PhysicalElement`s (e.g. *Course*s) comprising its *pavement* structure.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcFacilityPart.htm) with its PredefinedType attribute set to [IfcRoadPartTypeEnum.SIDEWALK](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcRoadPartTypeEnum.htm).

### GenericArea

`GenericArea`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

### SiteType

Instances of `SiteType` provide an additional classification that can be applied to `Site`s.

### ParkingAreaType

Instances of `ParkingAreaType` provide an additional classification that can be applied to `ParkingArea`s.

### ParkingIslandType

Instances of `ParkingIslandType` provide an additional classification that can be applied to `ParkingIsland`s.

### ParkingRowType

Instances of `ParkingRowType` provide an additional classification that can be applied to `ParkingRow`s.

### PondAreaType

Instances of `PondAreaType` provide an additional classification that can be applied to `PondArea`s.

### SidewalkType

Instances of `SidewalkType` provide an additional classification that can be applied to `Sidewalk`s.

### GenericAreaType

Instances of `GenericAreaType` provide an additional classification that can be applied to `GenericArea`s.
