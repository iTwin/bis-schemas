---
noEditThisPage: true
remarksTarget: PipeworkPhysical.ecschema.md
---

# PipeworkPhysical

This schema contains classes that are commonly used in various types of piping networks, designed for the distribution of matter (e.g. gases, liquids, fluidized solids or slurries).

The following class-diagrams depict the main classes and relationships in the PipeworkPhysical schema:

![System classes](./media/PipeworkPhysical-system_classes.png)
![Flow-Element classes](./media/PipeworkPhysical-flow_classes.png)
![TypeDef classes](./media/PipeworkPhysical-typedef_classes.png)
![Port classes](./media/PipeworkPhysical-port_classes.png)

The following instance-diagram depict a few examples of classes from the PipeworkPhysical schema:

![Pipes](./media/PipeworkPhysical-pipe_instances.png)
![Fittings](./media/PipeworkPhysical-fitting_instances.png)
![Valves](./media/PipeworkPhysical-valve_instances.png)
![Ports](./media/PipeworkPhysical-instances.png)

## Entity Classes

### BendType

A _Bend_ is a `PipeFitting` with typically two `PipingPort`s used to change the direction of flow between connected `PipingComponent`s.

Equivalent to [IfcPipeFittingType](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcPipeFittingType.htm), with its _PredefinedType_ property set to _IfcPipeFittingTypeEnum.BEND_.

### CompressionPortType

A _CompressionPort_ is a `PipingPort` that allows connections among `PipingComponent`s just by compression. Additional accessories may be used to further seal or strengthen each connection.

Equivalent to an [IfcDistributionPort](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcDistributionPort.htm), with its [Pset_DistributionPortTypePipe.ConnectionType](https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/Pset_DistributionPortTypePipe.htm) property set to _PEnum_PipeEndStyleTreatment.COMPRESSION_.

### CrossType

A _Tee_ is a `PipeFitting`with more than three `PipingPort`s used to redistribute flow among them and/or to change the direction of flow between connected `PipingComponent`s.

Equivalent to [IfcPipeFittingType](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcPipeFittingType.htm), with its _PredefinedType_ property set to _IfcPipeFittingTypeEnum.JUNCTION_.

### FlangedPortType

A _FlangedPort_ is a `PipingPort` that has a flange, typically with bolt holes, that enable connections among `PipingComponent`s.

Equivalent to an [IfcDistributionPort](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcDistributionPort.htm), with its [Pset_DistributionPortTypePipe.ConnectionType](https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/Pset_DistributionPortTypePipe.htm) property set to _PEnum_PipeEndStyleTreatment.FLANGED_.

### FlangeType

A _Flange_ is a `PipeFitting` that uses Flanged `PipingPort`s as their main connection mechanism.

Equivalent to [IfcPipeFittingType](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcPipeFittingType.htm), with its _PredefinedType_ property set to _IfcPipeFittingTypeEnum.CONNECTOR_.

### GroovedPortType

A _GroovedPort_ is a `PipingPort` that exhibits a groove that, by using additional accessories, enable connections among `PipingComponent`s.

Equivalent to an [IfcDistributionPort](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcDistributionPort.htm), with its [Pset_DistributionPortTypePipe.ConnectionType](https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/Pset_DistributionPortTypePipe.htm) property set to _PEnum_PipeEndStyleTreatment.GROOVED_.

### Pipe

Equivalent to [IfcPipeSegment](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcPipeSegment.htm).

### PipeFitting

Equivalent to [IfcPipeFitting](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcPipeFitting.htm).

### PipeFittingType

Equivalent to [IfcPipeFittingType](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcPipeFittingType.htm).

### PipeType

Equivalent to [IfcPipeSegmentType](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcPipeSegmentType.htm).

### PipingPort

It is expected that the `LocalOrigin` property, inherited from `dsys:DistributionPort`, can be used to derive centerlines across `PipingComponent`s when needed.

Equivalent to [IfcDistributionPort](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcDistributionPort.htm), with its _PredefinedType_ property set to _IfcDistributionPortTypeEnum.PIPE_.

### ReducerType

A _Reducer_ is a `PipeFitting` with typically two `PipingPort`s having different shapes or sizes. Reducers can also be used to change the direction of flow between connected `PipingComponent`s.

Equivalent to [IfcPipeFittingType](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcPipeFittingType.htm), with its _PredefinedType_ property set to _IfcPipeFittingTypeEnum.TRANSITION_.

### SolderedPortType

A _SolderedPort_ is a `PipingPort` that is connected with another `PipingPort` by using soldering.

Equivalent to an [IfcDistributionPort](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcDistributionPort.htm), with its [Pset_DistributionPortTypePipe.ConnectionType](https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/Pset_DistributionPortTypePipe.htm) property set to _PEnum_PipeEndStyleTreatment.SOLDERED_.

### SwedgePortType

A _SwedgePort_ is a `PipingPort` that...

### TeeType

A _Tee_ is a `PipeFitting`with three `PipingPort`s used to redistribute flow among them and/or to change the direction of flow between connected `PipingComponent`s.

Equivalent to [IfcPipeFittingType](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcPipeFittingType.htm), with its _PredefinedType_ property set to _IfcPipeFittingTypeEnum.JUNCTION_.

### ThreadedPortType

A _ThreadedPort_ is a `PipingPort` that exhibits either a male or female threaded end connection into which an opposite _ThreadedPort_ fits.

Equivalent to an [IfcDistributionPort](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcDistributionPort.htm), with its [Pset_DistributionPortTypePipe.ConnectionType](https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/Pset_DistributionPortTypePipe.htm) property set to _PEnum_PipeEndStyleTreatment.THREADED_.

### Valve

Equivalent to [IfcValve](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcValve.htm).

### ValveType

Equivalent to [IfcValveType](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcValveType.htm).

### WeldedPortType

A _WeldedPort_ is a `PipingPort` that is connected to another `PipingPort` by welding means.

Equivalent to an [IfcDistributionPort](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcDistributionPort.htm), with its [Pset_DistributionPortTypePipe.ConnectionType](https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/Pset_DistributionPortTypePipe.htm) property set to _PEnum_PipeEndStyleTreatment.WELDED_.