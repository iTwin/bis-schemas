---
noEditThisPage: true
remarksTarget: StormSewerPhysical.ecschema.md
---

# StormSewerPhysical

This schema contains classes that model Stormwater and Sewage collection systems.

The following class-diagrams depict the main classes and relationships in the StormSewerPhysical schema:

![System classes](./media/StormSewerPhysical-system_classes.png)
![Flow-Element classes](./media/StormSewerPhysical-flow_classes.png)
![TypeDef classes](./media/StormSewerPhysical-typedef_classes.png)

The following instance-diagram depict an example of the classes from the StormSewerPhysical schema:

![DistributionStructures](./media/StormSewerPhysical-distributionstructure_instances.png)

## Entity Classes

### DistributionStructure

A `DistributionStructure` instance owns its `PipeworkPhysical:PipingPort`s via the `PipeworkPhysical:PipingElementOwnsPorts` relationship. _Invert Elevations_ at those `PipingPort`s can be computed as:

```
InvertElevation at a PipingPort = PipingPort.Origin.z - (PipingPort.PipingPortType.InnerDiameter / 2)
```

`DistributionStructure`s must be contained in `PhysicalModel`s. Further classification of `DistributionStructure` instances can be achieved via instances of `DistributionStructureType`.

Equivalent to [IfcDistributionChamberElement](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionChamberElement.htm).

### DistributionStructureType

An instance of `DistributionStructureType` can optionally specify a single *Physical Material* via its `PhysicalMaterial` property.

Equivalent to [IfcDistributionChamberElementType](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionChamberElementType.htm).

### ManholeType

Equivalent to [IfcDistributionChamberElementType](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionChamberElementType.htm) with PredefinedType = [IfcDistributionChamberElementTypeEnum.MANHOLE](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionChamberElementTypeEnum.htm).

### DistributionStructureComponent

`DistributionStructureComponent`s are assembled by a `DistributionStructure` via the `DistributionStructureAssemblesComponents` relationship and they must be contained in `PhysicalModel`s. Further classification of `DistributionStructureComponent` instances can be achieved via instances of `DistributionStructureComponentType`.

### DistributionStructureComponentType

An instance of `DistributionStructureComponentType` can optionally specify a single *Physical Material* via its `PhysicalMaterial` property.

## Relationship Classes

### DistributionStructureTypeComposesSubTypes

`DistributionStructureComponentType` instances composed by a `DistributionStructureType` are organized based on its vertical placement. That is, a `DistributionStructureComponentType` instance at the *Bottom* of a `DistributionStructureType` shall be grouped with a `DistributionStructureTypeComposesSubTypes` relationship whose _memberPriority_ is set to 1. Similarly, a `DistributionStructureComponentType` instance at its *Top* shall be composed with a _memberPriority_ is set to the highest number among the members grouped by a `DistributionStructureType`.