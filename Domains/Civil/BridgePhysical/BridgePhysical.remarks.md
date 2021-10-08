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

### PierType

Instances of `PierType` provide an additional classification that can be applied to `Pier`s. An instance of `PierType` can optionally specify a single *Physical Material* via its `PhysicalMaterial` property.

### Pier

`Pier`s typically assemble other structural elements such as `Column`s, `Footing`s or `Beams` via `bis:PhysicalElementAssemblesElements` relationships. Further classification of `Pier` instances can be achieved via instances of `PierType`. A `Pier` instance can override the *Physical Material* specified by its corresponding `PierType` via its `PhysicalMaterial` property.

`Pier`s must be contained in `PhysicalModel`s.

Equivalent to [IfcElementAssembly](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcelementassembly.htm) with its PredefinedType attribute set to [IfcElementAssemblyTypeEnum.PIER](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcelementassemblytypeenum.htm).

### AbutmentType

Instances of `AbutmentType` provide an additional classification that can be applied to `Abutment`s. An instance of `AbutmentType` can optionally specify a single *Physical Material* via its `PhysicalMaterial` property.

### Abutment

`Abutment`s typically assemble other structural elements such as `Wall`s, `Footing`s or `Beams` via `bis:PhysicalElementAssemblesElements` relationships. Further classification of `Abutment` instances can be achieved via instances of `AbutmentType`. An `Abutment` instance can override the *Physical Material* specified by its corresponding `AbutmentType` via its `PhysicalMaterial` property.

`Abutment`s must be contained in `PhysicalModel`s.

Equivalent to [IfcElementAssembly](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcelementassembly.htm) with its PredefinedType attribute set to [IfcElementAssemblyTypeEnum.ABUTMENT](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcelementassemblytypeenum.htm).

### WingWallType

Instances of `WingWallType` provide an additional classification that can be applied to `WingWall`s. An instance of `WingWallType` can optionally specify a single *Physical Material* via its `PhysicalMaterial` property.

### WingWall

`WingWall`s typically assemble other structural elements such as `Wall`s, `Footing`s or `Pile` via `bis:PhysicalElementAssemblesElements` relationships. Further classification of `WingWall` instances can be achieved via instances of `WingWallType`. A `WingWall` instance can override the *Physical Material* specified by its corresponding `WingWallType` via its `PhysicalMaterial` property.

`WingWall`s must be contained in `PhysicalModel`s.

### CrossFrameType

Instances of `AbutmentType` provide an additional classification that can be applied to `Abutment`s. An instance of `AbutmentType` can optionally specify a single *Physical Material* via its `PhysicalMaterial` property.

### CrossFrame

`CrossFrame`s typically assemble other structural elements via `bis:PhysicalElementAssemblesElements` relationships. Further classification of `CrossFrame` instances can be achieved via instances of `CrossFrameType`. A `CrossFrame` instance can override the *Physical Material* specified by its corresponding `CrossFrameType` via its `PhysicalMaterial` property.

`CrossFrame`s must be contained in `PhysicalModel`s.

Equivalent to [IfcElementAssembly](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcelementassembly.htm) with its PredefinedType attribute set to [IfcElementAssemblyTypeEnum.CROSS_BRACING](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcelementassemblytypeenum.htm).

### GirderType

Instances of `GirderType` provide an additional classification that can be applied to `Girder`s. An instance of `GirderType` can optionally specify a single *Physical Material* via its `PhysicalMaterial` property.

### Girder

`Girder`s typically assemble other structural elements such as `Beam`s via `bis:PhysicalElementAssemblesElements` relationships. Further classification of `Girder` instances can be achieved via instances of `GirderType`. A `Girder` instance can override the *Physical Material* specified by its corresponding `GirderType` via its `PhysicalMaterial` property.

`Girder`s must be contained in `PhysicalModel`s.

Equivalent to [IfcElementAssembly](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcelementassembly.htm) with its PredefinedType attribute set to [IfcElementAssemblyTypeEnum.GIRDER](https://standards.buildingsmart.org/IFC/DEV/IFC4_3/RC2/HTML/link/ifcelementassemblytypeenum.htm).
