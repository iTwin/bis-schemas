---
noEditThisPage: true
remarksTarget: CivilSpatial.ecschema.md
---

# CivilSpatial

NOTE: Currently under development. This schema should not be used for production workflows. Data created using this schema is not supported and may not be upgradable.

## Entity Classes

### ParkingArea

`ParkingArea`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

Equivalent to [IfcSpace](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcSpace.htm) with a PredefinedType attribute set to [IfcSpaceTypeEnum.PARKING](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcSpaceTypeEnum.htm).

### ParkingIsland

Instances of `ParkingIsland` are typically aggregated by instances of `ParkingArea` by using the `spcomp:SpatialStructureElementAggregatesElements` relationship.

`ParkingIsland`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

### ParkingAreaType

Instances of `ParkingAreaType` provide an additional classification that can be applied to `ParkingArea`s.

### ParkingIslandType

Instances of `ParkingIslandType` provide an additional classification that can be applied to `ParkingIsland`s.