---
noEditThisPage: true
remarksTarget: BridgePhysical.ecschema.md
---

# BridgePhysical

This schema contains classes that are used specifically in Bridge projects.

NOTE: Currently under development. This schema should not be used for production workflows. Data created using this schema is not supported and may not be upgradable.

## Entity Classes

### BearingType

Instances of `BearingType` provide an additional classification that can be applied to `Bearing`s. Examples include Cylindrical, Spherical and Elastomeric. An instance of `BearingType` can optionally specify a single *Physical Material* via its `PhysicalMaterial` property.

Equivalent to [IfcBearingType](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcbearingtype.htm).

### Bearing

The purpose of a bearing is to allow controlled movement and thereby reduce the stresses involved. Possible causes of movement are thermal expansion and contraction, creep, shrinkage, or fatigue due to the properties of the material used for the bearing. External sources of movement include the settlement of the ground below, thermal expansion, and seismic activity.

`Bearing`s shall have their *Volume* stored in their `GeometryStream` as a *Polyface*. Further classification of `Bearing` instances can be achieved via instances of `BearingType`. A `Bearing` instance can override the *Physical Material* specified by its corresponding `BearingType` via its `PhysicalMaterial` property.

`Bearing`s must be contained in `PhysicalModel`s.

Equivalent to [IfcBearing](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcbearing.htm).

### BearingSeatType

Instances of `BearingSeatType` provide an additional classification that can be applied to `BearingSeat`s. Examples include Grout-pad and Beam-seat. An instance of `BearingSeatType` can optionally specify a single *Physical Material* via its `PhysicalMaterial` property.

Equivalent to [IfcPlateType](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcplatetype.htm).

### BearingSeat

`BearingSeat`s shall have their *Volume* stored in their `GeometryStream` as a *Polyface*. Further classification of `BearingSeat` instances can be achieved via instances of `BearingSeatType`. A `BearingSeat` instance can override the *Physical Material* specified by its corresponding `BearingSeatType` via its `PhysicalMaterial` property.

`BearingSeat`s must be contained in `PhysicalModel`s.

Equivalent to [IfcPlate](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcplate.htm).