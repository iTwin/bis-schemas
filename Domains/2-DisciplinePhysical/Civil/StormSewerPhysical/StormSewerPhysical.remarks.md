---
noEditThisPage: true
remarksTarget: StormSewerPhysical.ecschema.md
---

# StormSewerPhysical

This schema contains classes that model Stormwater and Sewage collection systems.

## Entity Classes

### DistributionChamber

A `DistributionChamber` instance owns its `PipeworkPhysical:PipingPort`s via the `DistributionChamberOwnsPipingPorts` relationship. _Invert Elevations_ at those `PipingPort`s can be computed as:

```
InvertElevation at a PipingPort = (DistributionChamber.Origin.z + PipingPort.LocalOrigin.z) - (PipingPort.PipingPortType.InnerDiameter / 2)
```

`DistributionChamber`s must be contained in `PhysicalModel`s. Further classification of `DistributionChamber` instances can be achieved via instances of `DistributionChamberType`.

Equivalent to [IfcDistributionChamberElement](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionChamberElement.htm).

### DistributionChamberType

An instance of `DistributionChamberType` can optionally specify a single *Physical Material* via its `PhysicalMaterial` property.

Equivalent to [IfcDistributionChamberElementType](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionChamberElementType.htm).

### ManholeType

Equivalent to [IfcDistributionChamberElementType](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionChamberElementType.htm) with PredefinedType = [IfcDistributionChamberElementTypeEnum.MANHOLE](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionChamberElementTypeEnum.htm).