---
noEditThisPage: true
remarksTarget: DistributionSystems.ecschema.md
---

# DistributionSystems

This schema contains classes for physical modeling of distribution systems - networks designed to receive, store, maintain, distribute, or control the flow of a distribution media. The primary goal of this schema, however, is not to model network connectivity but to model physical properties of elements participating in a distribution system and their physical connections or connection points.

A BIS [DistributionSystem](#distributionsystem) consists of [IDistributionElements](#idistributionelement), which can be either [IDistributionFlowElements](#idistributionflowelement) that direct flow, [IDistributionControlElements](#idistributioncontrolelement) that control [IDistributionFlowElements](#idistributionflowelement), or [IDistributionSensorElements](#idistributionsensorelement), which make observations relevant to the [DistributionSystem](#distributionsystem).

A given bis:PhysicalElement can implement more that one of [IDistributionFlowElement](#idistributionflowelement), [IDistributionControlElement](#idistributioncontrolelement), and [IDistributionFlowElement](#idistributionflowelement).

Connection point information will be added in subsequent versions of the schema.

![Class and Instance Diagrams](./media/distributionsystems.png)

## Entity Classes

### DistributionSystem

A common example is a heating hot water system that consists of a pump, a tank, and an interconnected piping system for distributing hot water to terminals.

A DistributionSystem groups [DistributionElements](#IDistributionElement) via the `DistributionSystemGroupsDistributionElements` relationship.

Equivalent to [IfcDistributionSystem](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionSystem.htm).

### IDistributionElement

`IDistributionElement` is a generalization of all elements that participate in a distribution system. Typical examples of IDistributionElement are (among others):

- elements within heating systems
- elements within cooling systems
- elements within ventilation systems
- elements within plumbing systems
- elements within electrical systems
- elements within communication network systems

It defines occurence of any HVAC, electrical, sanitary or other element within a distribution system.

Equivalent to [IfcDistributionElement](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionElement.htm).

The distribution element should be assigned to the finest granularity [SpatialStructureElement](./SpatialComposition.remarks.md#SpatialStructureElement) element it is fully contained in.

- [Space](./BuildingSpatial.remarks.md#Space) is the default container for a distributionElement
- [Story](./BuildingSpatial.remarks.md#Story) is the container if distribution element spans multiple spaces
- [Building](./BuildingSpatial.remarks.md#Building) is the default container when a distribution element spans multiple stories.

### IDistributionFlowElement

See [DistributionSystems](#distributionsystems).

Equivalent to [IfcDistributionFlowElement](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionFlowElement.htm).

### IDistributionControlElement

These elements are typically used to control distribution system elements and variables such as temperature, pressure, power, lighting levels and similar.

See [DistributionSystems](#distributionsystems).

Equivalent to [IfcDistributionControlElement](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionControlElement.htm) for controlling predefined types.

### IDistributionSensorElement

Distribution sensor elements could be used to measure variables such as temperature, humidity, pressure or flow.

See [DistributionSystems](#distributionsystems).

Equivalent to [IfcDistributionControlElement](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionControlElement.htm) for sensing predefined types and <b><u>not</u></b> `IfcSensor`.

### DistributionPort

A distribution port is a flow connection point of a distribution element through which a particular substance may flow.
Distribution ports define the physical connection and substance, electricity or data flow points of a distribution flow element. Subclasses of DistributionPort should specialize distributionport in a given domain by adding relevant properties like FlowVolume for plumbing, or RatedVoltage for electrical.
Ports are similar to openings in that they do not have any visible geometry, such geometry is captured by the parent distribution element. Ports do have placement to indicate position and orientation of the connection.
Distribution ports are owned by the `DistributionElement` as they are essentially part of the whole definition of the element, similar to openings in a wall. `DistributionElementOwnsDistributionPorts` relationship is used for `DistributionElement` owning `DistributionPorts`.

Equivalent to [IfcDistributionPort](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDistributionPort.htm).

### PortConnection

A `PortConnection` defines a physical connection between 2 DistributionPorts. In the case where a connection is realized by some other physical element, the realizing element could be found using `PortConnectionIsRealizedByPhysicalElements` relationship.

a PortConnection is always between 2 distribution ports, however this constraint may be removed if a suitable use case is found.

Equivalent to [IfcRelConnectsPorts](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcRelConnectsPorts.htm).