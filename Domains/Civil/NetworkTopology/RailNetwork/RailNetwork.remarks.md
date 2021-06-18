---
remarksTarget: RailNetwork.ecschema.md
---

# RailNetwork

BIS schema, containing classes describing Network Topology in the Rail domain.

NOTE: Currently under development. This schema should not be used for production workflows. Data created using this schema is not supported and may not be upgradable.

## Entity Classes

### ITrackTraversalSegment

The `ITrackTraversalSegment` mix-in is only implemented by the `TrackEdge` and `TrackEdgeSegment` classes.

### TrackNetwork

An instance of `TrackNetwork` shall reference all `TrackNode`s and `TrackEdge`s composing it via the `net:NetworkConsistsOfTopologyElements` relationship.

Since all element classes in the RailNetwork schema are `bis:InformationRecordElement`s in nature, they do not carry any geometry. There shall be one or more geometrical representations of each concept, subclassing either `bis:GeometricElement2d` or `bis:GeometricElement3d`. A 2D schematic drawing is an example of the former while geographically-located 3D graphics can be used in the latter. The appropriate *represents* relationship shall be used to associate each geometrical representation with the element from the RailNetwork schema. That is, the `bis:DrawingGraphicRepresentsElement` in the first case or the `bis:GraphicalElement3dRepresentsElement` in the second case.

Furthermore, topology elements in the RailNetwork schema are themselves parallel representations of real-world entities such as *Tracks* or *Turnouts* in a Railway. The `net:TopologyElementRepresentsElement` relationship shall be used to associate them accordingly.

### TrackEdge

An instance of `TrackEdge` can also be used as a Linear-Element for Linear Referencing purposes.

### TrackEdgeSegment

An instance of `TrackEdgeSegment` shall be linearly located along the `TrackEdge` that represents a portion of.

### TrackTraversal

A `TrackTraversal` references the `TrackEdge`s and/or `TrackEdgeSegments` it is based on (both of which implement the `ITrackTraversalSegment` mix-in) via the `TrackTraversalGroupsSegments` relationship. It uses the `MemberPriority` property of such relationship to specify the order for each member in the `TrackTraversal`. 

An instance of `TrackTraversal` can be used as a Linear-Element for Linear Referencing purposes.
