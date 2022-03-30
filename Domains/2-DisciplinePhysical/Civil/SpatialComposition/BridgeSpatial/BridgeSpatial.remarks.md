---
noEditThisPage: true
remarksTarget: BridgeSpatial.ecschema.md
---

# BridgeSpatial

This schema contains the main classes to capture the Spatial Structure of Bridge projects.

NOTE: Currently under development. This schema should not be used for production workflows. Data created using this schema is not supported and may not be upgradable.

## Entity Classes

### Bridge

As a subclass of `spcomp:Facility`, a `Bridge` instance provides the basic element in the Spatial Structure hierarchy for the components of a bridge project (i.e. any undertaking such as design, construction or maintenance).

`Bridge`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s and can be linearly located, typically along an *Alignment*.

Equivalent to [IfcBridge](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcbridge.htm).

### BridgeType

Instances of `BridgeType` provide an additional classification that can be applied to `Bridge`s.

Equivalent to [IfcBridgeTypeEnum](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcbridgetypeenum.htm).

### Substructure

A `Bridge` instance typically aggregates only one instance of `Substructure`.

`Substructure`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s and can be linearly located, typically along an *Alignment*.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcBridgePartTypeEnum.SUBSTRUCTURE](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcbridgeparttypeenum.htm).

### Superstructure

`Superstructure`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcBridgePartTypeEnum.SUPERSTRUCTURE](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcbridgeparttypeenum.htm).

### Deck

`Deck`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcBridgePartTypeEnum.DECK](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcbridgeparttypeenum.htm).

### DeckSegment

`DeckSegment`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcBridgePartTypeEnum.DECK_SEGMENT](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcbridgeparttypeenum.htm).

### Pier

`Pier`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcBridgePartTypeEnum.PIER](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcbridgeparttypeenum.htm).

### Abutment

`Abutment`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s.

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcfacilitypart.htm) with its PredefinedType attribute set to [IfcBridgePartTypeEnum.ABUTMENT](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcbridgeparttypeenum.htm).