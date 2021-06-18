---
remarksTarget: RoadNetwork.ecschema.md
---

# RoadNetwork

BIS schema, containing classes describing Network Topology in the Road domain.

NOTE: Currently under development. This schema should not be used for production workflows. Data created using this schema is not supported and may not be upgradable.

## Entity Classes

### IRoadTraversalSegment

The `IRoadTraversalSegment` mix-in is only implemented by the `RoadEdge` and `RoadEdgeSegment` classes.

### RoadNetwork

An instance of `RoadNetwork` shall reference all `RoadNode`s and `RoadEdge`s composing it via the `net:NetworkConsistsOfTopologyElements` relationship.

Since all element classes in the RailNetwork schema are `bis:InformationRecordElement`s in nature, they do not carry any geometry. There shall be one or more geometrical representations of each concept, subclassing either `bis:GeometricElement2d` or `bis:GeometricElement3d`. A 2D schematic drawing is an example of the former while geographically-located 3D graphics can be used in the latter. The appropriate *represents* relationship shall be used to associate each geometrical representation with the element from the RailNetwork schema. That is, the `bis:DrawingGraphicRepresentsElement` in the first case or the `bis:GraphicalElement3dRepresentsElement` in the second case.

Furthermore, topology elements in the RailNetwork schema are themselves parallel representations of real-world entities such as *Roadways* or *Intersections* in a Road. The `net:TopologyElementRepresentsElement` relationship shall be used to associate them accordingly.

### RoadEdge

An instance of `RoadEdge` can also be used as a Linear-Element for Linear Referencing purposes.

### RoadEdgeSegment

An instance of `RoadEdgeSegment` shall be linearly located along the `RoadEdge` that represents a portion of.

### RoadTraversal

A `RoadTraversal` references the `RoadEdge`s and/or `RoadEdgeSegments` it is based on (both of which implement the `IRoadTraversalSegment` mix-in) via the `RoadTraversalGroupsSegments` relationship. It uses the `MemberPriority` property of such relationship to specify the order for each member in the `RoadTraversal`. 

An instance of `RoadTraversal` can be used as a Linear-Element for Linear Referencing purposes.
