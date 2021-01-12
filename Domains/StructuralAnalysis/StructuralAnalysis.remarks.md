---
remarksTarget: StructuralAnalysis.ecschema.md
---

# StructuralAnalysis

StructuralAnalysis schema defines classes that represent data for Structural modeling. Focuses on information that is important in design, construction and modification of the load bearing components of buildings, bridges and other structures.

StructuralAnalysis schema uses topological approach for defining its data: [TopologyElements](#topologyelement) represent base structural model skeleton, other members (beams, slabs) share this data to define their analytical location and connectivity with other elements. Topology elements can be either [Private](#privatetopologyelement) ([Path](#path), [Wire](#wire), [Loop](#loop), [Sheet](#sheet)) or [Shared](#sharedtopologyelement) ([Vertex](#vertex), [Edge](#edge), [Face](#face)).

Some example applications which will use this schema include: RAM, STAAD, SPPM, Structural Synchronizer.

## Entity Classes

### TopologyElement

Provides connectivity information for all [Structural Analysis elements](#structuralanalysiselements).

There are two types of topology elements:

- [SharedTopologyElements](#sharedtopologyelement) - Elements share these instances to define their geometry location and connectivity with other elements
- [PrivateTopologyElements](#privatetopologyelement) - These are owned by elements through PrivateTopologyElement's **Parent** property. These are usually used to group SharedTopologyElements for required used case, e.g: Group multiple [Edges](#edge) to a [Loop](#loop) to define boundary for a Slab.

All Topology Elements within a [Model](#model) have the same `Origin`, `Roll`, `Pitch` and `Yaw`. This matches the approach of IFC's `IfcStructuralAnalysisDomain` and simplifies many calculations within `Element`s in the `Model`.

### SharedTopologyElement

SharedTopologyElements provide location and connectivity for Elements. There is one and only one subclass of SharedTopologyElement for each dimensionality:

- [Vertex](#vertex) for 0D
- [Edge](#edge) for 1D
- [Face](#face) for 2D
- [Region](#region) (future) for 3D

SharedTopologyElements are [Model](#bis:model)-scope resources that never have a parent [Element](#bis:element).

 SharedTopologyElements are generally immutable, except for two use cases:

  1. Move Model (translate or rotate the entire structural model)
  2. Stretch Model (stretch a portion of a structural model)

Stretching is not always possible. Stretching the model is not allowed unless the entire model data can be updated to be valid.

Instead of being modified, ShareTopologyElements are typically replaced. For example: Edge that is split is replaced by two Edges.

Opposite to [PrivateTopologyElements](#privatetopologyelement), all instances of SharedTopologyElement classes have graphics.

### PrivateTopologyElement

PrivateTopologyElements ***always*** have a parent Element that owns them, if the parent is deleted, the PrivateTopologyElement is deleted also. The parent Element may be a [TopologyElement](#topologyelement) (such as a [Face](#face) owning [Loops](#loop)) or may be a [StructuralElement](#structuralelement) (such as a [CurveMember](#curvemember) owning a [Wire](#wire)).

There is one and only one subclass of PrivateTopologyElement for each dimensionality above zero:

- [Path](#path) for 1D (collection of [Edges](#edge))
- [FaceSet](#faceset) for 2D (collection of Faces)
- Solid (future) for 3D (collection of Regions)
(there is no need for a 0D SharedTopologyElement, as there is no strong motivation to manage a collection of Vertices)

Although Private Topology Elements derive from [Geometric3dElement](#bis-geometric3delement), they never have their own graphics. Instead, Private Topology Elements always reference [Shared Topology Elements](#sharedtopologyelement).

### Vertex

Vertices provide point location and connectivity at a point. [StructuralAnalysisElements](#structuralanalysiselement) which refer to the same Vertex are connected and can transfer forces between each other. There can be multiple Vertices at the same spatial point, however elements that reference these vertices are not treated as connected. By default all elements which refer to the same Vertex are fixed at that spatial point. Default fixities for each of the 6 degrees of freedom can be adjusted with these instances:

- [PointSupportBehavior](#pointsupportbehavior)
- [VertexReleaseAspect](#vertexreleaseaspect)

Vertices are [Model](#model)-scope shared resources that ***never*** have a parent [Element](#element).

Unlike other [SharedTopologyElements](#sharedtopologyelement), Vertices can be directly referenced by non-topology elements, e.g. [PointLoad](#pointload), [PointSupport](#pointsupport). However, these classes should not reference Vertex directly but use [IDefinedPoint](#idefinedpoint) mixin instead, which is extended by Vertex class.
Topology classes that reference Vertex are:

- [Edge](#edge) uses Vertices to define its start and end points. Edges referring to the same Vertex are connected
- [Face](#face) can have internal vertices, bounded by its outer [Loop](#loop). For example a slab that is supported by a column: here the column would indirectly refer to a Vertex which would also be shared with the Face that defines the Slab

*Parasolid Equivalent: Vertex*

### Edge

Edges provide a curve location (between two [Vertices](#vertex)) and connectivity along the curve. Edge has direction from start Vertex to its end Vertex. Edge's location curve cannot self intersect. Edge can refer to the same Vertex for both its start and end.

Edges are ***only*** referred to by [Paths](#path) (through [OrientedEdgeAspects](#orientededgeaspect)). [StructuralAnalysisElements](#structuralanalysiselement) that refer to the same Edge are connected. Multiple edges might exist in same location, however elements would not be considered connected if they reference these separate Edges. By default all elements which refer to the same Edge are fixed at its connection curve. Default fixities can be adjusted with these instances:

- [CurveSupportBehavior](#curvesupportbehavior)
- [PathReleaseAspect](#pathreleaseaspect)

Any other Element with a relationship to an Edge will not be considered for updating in operations that split, merge or delete the Edge.

Edges are Model-scope shared resources that ***never*** have a parent Element.

*Parasolid Equivalent: Edge*

### Face

Faces provide a surface location (bounded by [Loops](#loop)) and connectivity across that surface. Faces are never referenced directly by [StructuralAnalysisElements](#structuralanalysiselement), Surface Elements ([SurfaceMembers](#surfacemember), [SurfaceMemberRegions](#surfacememberregion), [SurfaceSupports](#surfacesupport)) can reference Faces through [FaceSets](#faceset).

Faces contain [Loops](#loop) and [Wires](#wire) as children. Loops represent Face boundaries and the Wires represent linear connectivity within the Face. Face always has a single [Loop](#loop) which defines outer boundary. Inner Loops will have opposite normal to outer Loop's. Inner Loops define holes in a Face, two faces would not be considered overlapping if the first face's outer Loop is inside of the other face's inner loop. Faces can also **directly** refer to [Vertices](#vertex), in case there is another member connected to a Face at a single point - Vertex should be used to define that connection, e.g. Column supporting Slab.

Faces also define surface connectivity by themselves. By default all elements which refer to the same Face are fixed at that spatial surface location. Default fixities can be adjusted with these instances:

- [SurfaceSupportBehavior](#surfacesupportbehavior)
- [SheetReleaseAspect](#sheetreleaseaspect)

Faces are ***only*** referred to by [FaceSets](#faceset) (through [OrientedFaceAspects](#orientedfaceaspect)). Any other Element with relationship to a Face will not be considered in operations that split, merge or delete the Face.

Faces are Model-scope shared resources that ***never*** have a parent Element.

Faces can only be planar, however in future Faces might have a **Surface** property which would allow to define a non-planar surface.

*Parasolid Equivalent: Face*

### Path

Path is a sequence of [Vertex](#vertex)-connected [Edges](#edge). Path always has a Parent which uses Path to reference Edges and Vertices to define either a surface or a linear element.

[Path](#path) is abstract and only has two subclasses (both sealed):

- [Loop](#loop) - a closed Path defining the boundary of a [Face](#face)
- [Wire](#wire) - an open or closed Path that does not define the boundary of a Face

The Edges of a Path are defined through its ownership of [OrientedEdgeAspects](#orientededgeaspect). A valid Path must always have at least one OrientedEdgeAspect. Paths can never be shared. Duplicate Paths that reference same Edges and define same connectivity for different members can coexist. Edges in a Path can never intersect.

### Wire

Wire is a [Path](#path) that does not define the boundary of a Face. Wires may be open or closed.

Every Wire has a parent that is one of the following:

- [CurveSupport](#curvesupport) - defines location and connectivity to Elements that are supported by current CurveSupport
- [Face](#face) - never used for defining Face location, only used to define connectivity to other members, e.g: Slab which has a beam under it, here Face would define the Slab which would have an internal Wire that shares [Edges](#edge) with another Wire that defines the beam
- [CurveMember](#curvemember) - There will be always a single **Location Wire** that defines CurveMember location. However, CurveMember might have additional **Sub Wires** that define different fixities for some of the Edges. All Edges of Sub Wires must be referenced by the Location Wire. Location and Sub Wires are differentiated by using different relationships to define their parent:

  - [CurveMemberOwnsLocationWire](#curvememberownslocationwire) for defining location wire
  - [CurveMemberOwnsSubWire](#curvememberownssubwire) for defining sub wires

Wires are **never** shared.

*Parasolid Equivalent: Wire Body*

### Loop

Every Loop has a parent which is always a [Face](#face). Loops are always closed: First OrientedEdge's first [Vertex](#vertex) must always be referenced as the last OrientedEdge's end Vertex.

Each Loop has a normal. The direction of normal depends on how the [OrientedEdges](#orientededgeaspect) for the Loop are placed: OrientedEdges are connected clockwise around the Loop when viewed by the normal direction.

Loops are **never** shared.

*Parasolid Equivalent: Loop*

### FaceSet

FaceSet is a set of [Edge](#edge)-connected [Faces](#face) with compatible orientations. Both adjacent Faces must reference Edges that connect them. Edges can never overlap or intersect in a FaceSet.

The Faces of a FaceSet are defined through its ownership of [OrientedFaceAspects](#orientedfaceaspect). A valid FaceSet must always have at least one OrientedFaceAspect.

FaceSet is abstract and only has two subclasses (both sealed):

- [Shell](#shell) (Future) - a closed FaceSet defining the boundary of a [Region](#region) (future)
- [Sheet](#sheet) - an open or closed FaceSet that does not define the boundary of a Region

FaceSets are **never** shared.

### Sheet

Sheet is a [FaceSet](#faceset) that does not define the boundary of a [Region](#region) (future).

Sheet's boundary is defined by its child [Faces](#face). Every Face in a Sheet must have the same Surface (the motivation for this is to provide a single surface-based coordinate system for [SurfaceMembers](#surfacemember)).

Every Sheet has a parent ([ISheetOwner](#isheetowner)) that is one of the following:

- [SurfaceMember](#surfacemember)
- [SurfaceMemberRegion](#surfacememberregion) (and hence [SurfaceMemberModifier](#surfacemembermodifier) and [SurfaceMemberOpening](#surfacememberopening))

Sheets are **never** shared.

*Parasolid Equivalent: Sheet Body*

### AnalysisElement

AnalysisElements use [TopologyElements](#topologyelement) to define their location and connectivity between other AnalysisElements. By having this connectivity information, analysis elements are able to transfer their loads between each other.

### StructuralAnalysisElement

Derives from [AnalysisElement](#analysiselement) and provides base class for structural elements.

### Structure

A class that represents an entire structure and is sub-modeled by [StructuralAnalysisModel](#stucturalanalysismodel), derives from [StructuralAnalysisElement](#structuralanalysiselement).
Always has a single property to represent the definition container that is referred by the structure.
The sub-model of the definition container should be used as a default model for storing related DefinitionElements.

### StructurePart

A class that represents only a part of a Structure.
Used for grouping [StructuralAnalysisElements](#structuralanalysiselement) that form some specific Structure part. e.g. Story, Frame.
StructuralPart that defines a part for some specific Structure must be contained in a model that the Structure is broken down into.
Structure and elements that reference it must be contained in same model.

### Story

Defines an elevation for a [StructuralAnalysisElement](#structuralanalysiselement).

### IStoryAssignable

Indicates that an element can be assigned to a Story.

### Support

A support member in StructuralAnalysis represents a [StructuralAnalysisElement](#structuralanalysiselement) that is an analytical support. Currently, StructuralAnalysis schema includes [PointSupports](#pointsupport), [CurveSupports](#curvesupport) and [SurfaceSupports](#surfacesupport). Support elements have no direct physical meaning, they are interpreted by some applications to represent some type of support. Support connects to (supports) to elements that share same connectivity ([SharedTopologyElements](#sharedtopologyelements)). Each Support should refer to [SupportBehavior](#supportbehavior) which define how support behaves at specific connectivity.

### PointSupport

Represents an analytical support providing fixity at a point. For example: a support provided under column. The support has its own coordinate system and has fixity properties for each degree of freedom.

Each PointSupport refers to a [Vertex](#vertex) defining its location. Through this [topological](#topologyelement) location, support is connected to other [AnalysisMembers](#analysismember).

### CurveSupport

Represents an analytical support providing fixity along a curve. For example: a support provided under a wall. The support has its own coordinate system and has fixity properties for each degree of freedom.

Each CurveSupport has a child [Wire](#wire) defining its location. Through this [topological](#topologyelement) location, support is connected to other [AnalysisMembers](#analysismember).

### SurfaceSupport

Represents an analytical support providing fixity at a surface. For example: a support provided under a slab. The support has its own coordinate system and has fixity properties for each degree of freedom.

Each Surface Support refers to a [Sheet](#sheet) defining its location. Through this [topological](#topologyelement) location, support is connected to other [AnalysisMembers](#analysismember).

### SupportBehavior

Defines how a [Support](#support) behaves at its connectivity - [SharedTopology](#sharedtopologyelement). There is a separate SupportBehavior class for each Support:

- [PointSupport](#pointsupport) - [PointSupportBehavior](#pointsupportbehavior)
- [CurveSupport](#curvesupport) - [CurveSupportBehavior](#curvesupportbehavior)
- [SurfaceSupport](#surfacesupport) - [SurfaceSupportBehavior](#surfacesupportbehavior)

### PointSupportBehavior

Defines fixity behavior for each [PointSupport's](#pointsupport) Local Coordinate axis. There are 6 degrees of freedom: rotational and translational for each axis. PointSupport connects to other [StructuralAnalysisElements](#structuralanalysiselement) through its location point ([Vertex](#vertex)). Forces that are applied for the PointSupport or other Elements at that connection are transferred between each other. Fixities for each degree of freedom are defined by a separate behavior.

### CurveSupportBehavior

Defines fixity behavior for each [CurveSupport's](#curvesupport) Local Coordinate axis. There are 4 degrees of freedom: a single rotational about the tangent of a curve and three translational for each axis. CurveSupport connects to other [StructuralAnalysisElements](#structuralanalysiselement) through its location curve ([Wire](#wire)) and [Edges](#edge) that concatenate to that curve. Forces that are applied for the CurveSupport or other Elements at that connection are transferred between each other.

### SurfaceSupportBehavior

Defines fixity behavior for each [SurfaceSupport's](#surfacesupport) Local Coordinate axis. There are only translational degrees of freedom for each Axis. SurfaceSupport connects to other Elements by its location surface ([Sheet](#sheet)) and [Faces](#face) that concatenate to that surface. Forces that are applied for the SurfaceSupport or other Elements at that connection are transferred between each other.

### Member

Represents a major structural component such as: beam, column, wall. Members can transfer forces from one location to another. Members are analytical instances, however they should be modeled to mirror their actual physical locations and sizes as much as practical. “Simplifying” a model by moving Member locations (for example to locate all members on grid lines) is discouraged as these simplified models have little value for drawing production and detailing applications that may utilize the Structural Analysis schema.

Members always have at least one [PrivateTopologyElement](#privatetopologyelement) that defines their location and connectivity to other elements.

There are two types of members in StructuralAnalysisSchema:

- [CurveMembers](#curvemember) - defined by a [Wire](#wire)
- [SurfaceMembers](#surfacemember) - defined by a [Sheet](#sheet)

### CurveMember

CurveMember represents a [Member](#member) that is primarily linear in nature. CurveMember's purpose is to hold the structure by providing resistance from both lateral and gravity loads. Some examples are beams, columns, piles and cables.

CurveMember's analytical location is defined by its child [Wire](#wire) and [CurveMemberOwnsLocationWire](#curvememberownslocationwire) relationship. CurveMember has a direction which is defined by its location Wire.

CurveMember has local coordinate system (RST):

- RAxis matches direction of CurveMember
- TAxis matches CurveMember's orientation
- SAxis is defined by cross product of TAxis and RAxis
- Origin matches location Wire start point

Connectivity between CurveMember and other elements are defined through [Edges](#edge) and [Vertices](#vertex) that are referenced by CurveMember's **location** Wire. By default all fixities for the CurveMember are treated as **fixed**. However, these default fixities can be overridden with the aspects:

- [VertexReleaseAspect](#vertexreleaseaspect) - only used for adjusting fixity for a single specific Vertex
- [PathReleaseAspect](#pathreleaseaspect) - only used for adjusting fixity for all Edges that belong to a specific Path. There might be some cases where Edges need to have different fixities in a CurveMember. For this purpose additional **sub** Wires with [CurveMemberOwnsSubWire](#curvememberownssubwire) relationship should be used. Release aspects for sub wires will always override fixity behavior assigned the location Wire. Each Edge referenced by a sub Wire must be referenced by location Wire.

Not all properties of CurveMember are defined in CurveMember class. There are two additional types of properties that can be assigned to a CurveMember:

- Mandatory CurveMember properties, that can be repeated in multiple CurveMembers are grouped by a [CurveMemberType](#curvemembertype), these could include material, thickness, etc
- Optional properties, that define some more unique behavior for that CurveMember that might not exist at all. These behaviors are assigned by [MemberBehaviorAspect](#memberbehavioraspect) instances. A single CurveMember might have multiple different type behavior aspects assigned but only one of each kind.

### SurfaceMember

Represents [Member](#member) that has one dimension (thickness) much smaller than its other dimensions and is surface-like in nature. Some examples are slabs, wall and spread footings.

SurfaceMember provides a basic set of capabilities that can be used to model most real-world situations:

- SurfaceMembers with planar outlines
- SurfaceMembers with polygon openings
- Non-planar SurfaceMembers with planar outlines (future)
- SurfaceMembers with varying thicknesses (future)
- SurfaceMembers with (mildly) warped surfaces (future)

SurfaceMember's analytical location is defined by a child [Sheet](#sheet). SurfaceMember always has a local coordinate system (RST):

- RAxis is defined by inherited RAxis property from [IDefinedSurface](#idefinedsurface) mixin
- TAxis matches direction of SurfaceMember's Sheet's normal
- SAxis is defined by cross product of TAxis and RAxis
- Origin is defined by inherited Origin property from [IDefinedSurface](#idefinedsurface) mixin

Not all properties of SurfaceMember are defined in SurfaceMember class. There are two additional types of properties that can be assigned to a SurfaceMember:

- Mandatory SurfaceMember properties, that can be repeated in multiple SurfaceMembers are grouped by a [SurfaceType](#surfacetype), these could include material, thickness, etc.
- Optional properties, that define unique behavior for that SurfaceMember that might not exist at all. These behaviors are assigned by [MemberBehaviorAspect](#memberbehavioraspect) instances. A single SurfaceMember might have multiple different type behavior aspects assigned but only one of each kind

Complex SurfaceMembers are defined using three different classes:

- SurfaceMember - the SurfaceMember itself
- [SurfaceMemberModifier](#surfacemembermodifier) - a region of the SurfaceMember that has different properties. Child of SurfaceMember that is being modified
- [SurfaceMemberOpening](#surfacememberopening) - an opening in the SurfaceMember. Child of SurfaceMember that the opening modifies

### SurfaceMemberRegion

Defines [SurfaceMember](#surfacemember) region which has different behavior at that region than the rest of the SurfaceMember. It could have different thickness, material or other structural properties. SurfaceMemberRegions are permanently tied to the SurfaceMember they are created with. Regions can be removed from the model, but they cannot be switched from one SurfaceMember to another. If the SurfaceMember is removed from the model, the SurfaceMemberRegion is automatically removed from the model. SurfaceMemberRegions are child instances of SurfaceMember.

SurfaceMemberRegion has a single child [Sheet](#sheet) to define its area. Each SurfaceMemberRegion's Sheet's [Face](#face) must be referenced by a Sheet that is used to define location for parent SurfaceMember.

### SurfaceMemberModifier

Defines [SurfaceMember's](#surfacemember) region which has different structural properties than the rest of the surface. SurfaceMemberModifier can belong to different [SurfaceType](#surfacetype) and have different material, thickness than the parent SurfaceMember.

Multiple SurfaceMemberModifiers might overlap at some parts of SurfaceMember. **Priority** property allows to determine which SurfaceMemberModifier should be used for determining properties of intersecting volume. Higher value of this property means that SurfaceMemberModifier has higher priority over other lower valued SurfaceMemberModifiers. Only a single SurfaceMemberModifier at the intersecting volume can define that SurfaceMembers region.

### SurfaceMemberOpening

Cuts [SurfaceMember](#surfacemember) and all of its [SurfaceMemberModifiers](#surfacemembermodifier) along the [Sheet](#sheet) which is assigned to this [SurfaceMemberOpening](#surfacememberopening). SurfaceMemberOpenings can intersect, however that does not make difference how the SurfaceMember is cut.

### CurveMemberType

Multiple [CurveMember](#curvemember) properties might be grouped by a single entity/type. This entity is a CurveMemberType which holds all repeating properties for the  CurveMembers. Each CurveMember must have a CurveMemberType set. Materials, Profiles and Tapering (CurveMember's profile change along the length) can be defined in this way.

Available CurveMemberTypes:

- [SingleCurveMemberType](#singlecurvemembertype) - all CurveMembers have same Material and profile which are constant or change linearly along the length
- [SegmentedCurveMemberType](#segmentedcurvemembertype) (future) - all CurveMembers are segmented, each segment might have different material and profiles

### SingleCurveMemberType

[CurveMemberType](#curvemembertype) which defines a type where all [CurveMembers](#curvemember) are not segmented. Structural properties for a CurveMember change linearly or do not change at all.

### MaterialProfileType

[CurveMemberType](#curvemembertype) which defines a single Material and Profile for all CurveMembers of that type. CurveMember structural properties are constant along the length of each CurveMember.

### SurfaceType

[ISurfaces](#isurface) ([SurfaceMembers](#surfacemember) and [SurfaceMemberModifiers](#surfacemembermodifier)) might have some shared properties in a structure: thickness, material, etc... SurfaceType groups these ISurface instances to a single group and provides shared properties for the whole group-system.

Available SurfaceTypes:

- [SimpleSurfaceType](#simplesurfacetype) defines constant thickness and material for whole surface

### SimpleSurfaceType

Most common [SurfaceType](#surfacetype). Should be assigned to most walls, slabs which do not have any varying thickness, material layers. Simple Surface Type provides constant material and thickness for each [ISurface](#isurface).

### Load

Structure loads represent forces, deformations that are applied to [StructuralMembers](#member), [Supports](#support) or [Vertices](#vertex). Properties for load affected elements are calculated by assessing these Loads.

When multiple loads overlap (regardless of the Load Type) the result is always additive.

Loads in StructuralAnalysis schema are always hosted - they always have related [Member](#member), [Support](#support) or [Vertex](#vertex) which is assigned through [RelativeLocationAspect](#relativelocationaspect). Load values are assigned through [LoadValueAspect](#loadvalueaspect).

StructuralAnalysis provide multiple [LoadTypes](#loadtype), all these types could be grouped into a [LoadContainer](#loadcontainer) which can be either [LoadGroup](#loadgroup) or [LoadCase](#loadcase). LoadCases can reference LoadGroups.

Loads are subclassed by the area they affect:

- [PointLoad](#pointload) - affects such a small area that it can be contracted to a single spatial point
- [CurveLoad](#curveload) - affects over a curve
- [SurfaceLoad](#surfaceload) - affects over a surface

### PointLoad

[Load](#load) which affects such a small area that it can be contracted to a single spatial point. PointLoad should be placed on any [Member](#member), [Support](#support). However, because some applications are used to placing PointLoads on Vertices/Nodes - PointLoad has exception and can be placed on a [Vertex](#vertex).

Two aspects must always be assigned to a PointLoad:

- [RelativePointLocationAspect](#relativepointlocationaspect) - spatial point on a host (parent) element where this Load is located.
- [PointLoadValueAspect](#pointloadvalueaspect) - defines force (caused by this Load) at the location point.

### CurveLoad

Distributed [Load](#load) which affects a curve. These loads can be both **uniform** (all points on the curve are affected by same force) and **non-uniform** (forces that affect each point on the curve vary). CurveLoad can be applied on any curve or surface element ([CurveMember](#curvemember), [SurfaceMember](#surfacemember), [CurveSupport](#curvesupport), [SurfaceSupport](#surfacesupport)).

Two aspects must always be assigned to a CurveLoad:

- [RelativeCurveLocationAspect](#relativecurvelocationaspect) - curve on a host (parent) element where this Load is located.
- [CurveLoadValueAspect](#curveloadvalueaspect) - defines force (caused by this Load) for the location curve.

### SurfaceLoad

Distributed [Load](#load) which affects a surface. These loads can be both:

- **Uniform** - all points on the curve are affected by same force
- **Non-uniform** - forces that affect each point on the surface vary.

Curve Load can be applied only on a surface element ([SurfaceMember](#curvemember) or [SurfaceSupport](#surfacesupport)).

Two aspects must always be assigned to a Surface Load:

- [RelativeSurfaceLocationAspect](#relativesurfacelocationaspect) - surface on a host (parent) element where this Load is located.
- [SurfaceLoadValueAspect](#surfaceloadvalueaspect) - defines force (caused by this Load) for the location surface.

### LoadCombination

Modeled structure needs to be tested for different events that might occure in the liftime of the structure. Not all [Loads](#load) have same the effect on the structure at different events. For this purpose Loads are given different factors to test the structure for a given event. These groups of loads and factors are called Load Combinations (e.g. [ASCE7-10](https://www.waterboards.ca.gov/waterrights/water_issues/programs/bay_delta/california_waterfix/exhibits/docs/dd_jardins/DDJ-148%20ASCE%207-10.pdf)). Which LoadCombinations need to be used depend not only on the structure itself but also on how or where the structure is located, e.g. In case structure is located in Flood Zone, LoadCombinations would include Flood Loads.

Defines condition for a [LoadCase](#loadcase). Different structure conditions provided by [LoadCases](#loadcase) access different [Load](#load) types with some specific [factor](#factoredloadconditionaspect). LoadCombinations allow to assign these factors for a given Load Case.

### LoadContainer

[Loads](#loads) are grouped through **Parent** property by some specific [LoadType](#loadtype) (usually source of the Loads).

### LoadCase

Defines [LoadType](#loadtype) for a set of [Loads](#load) or [LoadGroups](#loadgroup). During analysis LoadCases are given different factors by each [LoadCombination](#loadcombination) based on the event against which the structure is tested.

### LoadGroup

Groups [Loads](#loads) which can be later added to multiple [LoadCases](#loadcase). [FactoredLoadGroupAspect](#factoredloadgroupaspect) is used for assinging LoadGroups to LoadCases.

## Aspects

### OrientedEdgeAspect

OrientedEdgeAspect allows to assign [Edge](#edge) for a [Path](#path).

A Path might refer to multiple Edges, one of OrientedEdgeAspect purposes is to define the order of Edges in a Path by providing a unique (for that Path) index.
Each Edge has a direction from its start Vertex to end Vertex. OrientedEdgeAspect can change the direction how the Edge is treated in Path's context. Edges in a Path are required to connect head to tail.

### OrientedFaceAspect

Each [Face](#face) has a direction (same as normal) which is provided by its bounding [Loop](#loop). IsForwardDirection property can be used when Face needs to have opposite direction to make it compatible with other Faces in a [FaceSet](#faceset).

### MemberBehaviorAspect

Specifies a structural behavior for a [Member](#member) element. The behavior is usually optional and unique for that member. Member behavior aspects are never shared. Each Member can have multiple MemberBehaviorAspects, however all aspects should be unique - there should not be any aspect instances of the same class.

Behavior aspects can be more generic that can be applied for all Members - [LoadResistanceBehaviorAspect](#loadresistancebehavioraspect) or more specialized for Member subclasses: [SurfaceMemberBehaviorAspect](#surfacememberbehavioraspect), [CurveMemberBehaviorAspect](#curvememberbehavioraspect).

### LoadResistanceBehaviorAspect

Defines the behavior of a structural [Member](#member) to resist forces caused by applied [Loads](#load).

### CurveMemberBehaviorAspect

Base aspect class to define behavior for a [CurveMember](#curvemember). Properties which come with derived aspects are optional for CurveMember. CurveMember might have multiple behavior aspects, however only a single instance of each behavior subclass can be assigned to a single CurveMember. Behavior aspects are [unique](./biscore.ecschema.md#uniqueelementaspect) and cannot be shared.

### CamberBehaviorAspect

Behavior specifies that the [CurveMember](#curvemember) is slightly curved or bent, tipically used with Beams. Positive camber means that the beam is curved upward, this usually provide some extra structural support to a wide span or space by counteracting deflection due to [Load](#load). If camber is negative - beam is bent downward, this can indicate a problem either a wear and tear, deterioration or deliberate destructive manipulation to a structure.

### AxialBehaviorAspect

Defines behavior for host [CurveMember](#curvemember) when subjected to axial [Loads](#load). see [AxialBehaviorType enum](#axialbehaviortype) for more information about possible values. Applications should not use this aspect unless they can represent multiple Axial Behavior values. Members should not use this aspect if [LoadResistanceBehavior Aspect](#loadresistancebehavioraspect) is already applied.

### StiffnessBehaviorAspect

Defines how [CurveMember](#curvemember) is able to resist deformation when force is applied along or about some specific local coordinate axis.

Local axes for [CurveMember](#curvemember):

- TAxis matches CurveMember's orientation
- RAxis matches CurveMember's direction
- SAxis matches Cross product of TAxis and RAxis

### SurfaceBehaviorAspect

Base aspect class to define behavior for a [SurfaceMember](#surfacemember). Properties which come with derived aspects are optional for SurfaceMember. SurfaceMember might have multiple behavior aspects, however only a single instance of each behavior kind can be assigned. Behavior aspects are [unique](./biscore.ecschema.md#uniqueelementaspect) and cannot be shared.

### BendingBehaviorAspect

Defines how [SurfaceMember](#surfacemember) is able to resist deformation when load is applied parallel to [Sheets](#sheet) normal. See [BendingBehaviorValue](#bendingbehaviorvalue) enum for possible values.

### LoadValueAspect

The actual force of a [Load](#load). Each load has to have assigned LoadValueAspect. There is a separate subclass of LoadValueAspect for each Load subclass:

- [PointLoadValueAspect](#pointloadvalueaspect) for [PointLoad](#pointload)
- [CurveLoadValueAspect](#curveloadvalueaspect) for [CurveLoad](#curveload)
- [SurfaceLoadValueAspect](#surfaceloadvalueaspect) for [SurfaceLoad](#surfaceload)

### PointLoadValueAspect

Defines an abstract aspect class for setting load values of [PointLoad](#pointload) values, curently the only property that can be assinged is **Force** ([PointForceValueAspect](#pointforcevalueaspect))

### ForcePointLoadValueAspect

Defines [PointForce](#pointforce) value for a [PointLoad](#pointload).

### CurveLoadValueAspect

Defines an abstract aspect class for setting load values of [CurveLoad](#curveload) (e.g. [Force](#linerforce)). Values along the Curve Load might be both [Uniform](#uniformcurveloadvalueaspect) and [Varying](#varyingcurveloadvalueaspect).

### UniformCurveLoadValueAspect

Currently only [UniformForceCurveLoadValueAspect](#uniformforcecurveloadvalueaspect) subclasses this aspect.

### UniformForceCurveLoadValueAspect

This aspect should not be used with [VaryingForceCurveLoadValueAspect](#varyingforcecurveloadvalueaspect) for the same Load.

### VaryingCurveLoadValueAspect

Currently only [VaryingForceCurveLoadValueAspect](#varyingforcecurveloadvalueaspect) subclasses this aspect.

### VaryingForceCurveLoadValueAspect

This aspect should not be used with [UniformForceCurveLoadValueAspect](#uniformforcecurveloadvalueaspect).

### SurfaceLoadValueAspect

Defines an abstract aspect class for setting load values of [SurfaceLoad](#surfaceload) (e.g. [Force](#surfaceforce)). Values along the Surface Load might be both [Uniform](#UniformSurfaceLoadValueAspect) and [Varying](#varyingsurfaceloadvalueaspect).

### UniformSurfaceLoadValueAspect

Currently only [UniformForceSurfaceLoadValueAspect](#uniformforcesurfaceloadvalueaspect) subclasses this aspect.

### UniformForceSurfaceLoadValueAspect

This aspect should not be used with [VaryingForceSurfaceLoadValueAspect](#varyingforcesurfaceloadvalueaspect) for the same Load.

### VaryingSurfaceLoadValueAspect

Currently only [UniformForceSurfaceLoadValueAspect](#uniformforcesurfaceloadvalueaspect) subclasses this aspect.

### VaryingForceSurfaceLoadValueAspect

This aspect should not be used with [UniformForceSurfaceLoadValueAspect](#uniformforcesurfaceloadvalueaspect) for the same Load.

### FactoredLoadGroupAspect

[LoadGroups](#loadgroup) can be assigned to a multiple [LoadCases](#loadcase) using this aspect.

### FactoredLoadConditionAspect

Different factors for each of [Load](#load) value are assinged based on the event for which structure is analyzed.

### FactoredLoadCaseAspect

Based on the [LoadType](#loadtype), [Load](loads) values should have different factors based on the event against which the structure is analyzed. [LoadCombinations](#loadcombination) define what factors should be used for each LoadType durring a specific event. These factors are assigned for all Loads in a Load Case using this aspect.

### FactoredLoadCombinationAspect

Allows to group multple [LoadCombinations](#loadcombination) into a single one, assigning a seperate factor for each combination.

### RelativeLocationAspect

[Loads](#load) are always hosted in Structural Analysis schema. Which means that their location are always relative to the host member. Relative Location Aspect provides base class for defining Load location relative to its host. This gives advantage that the load is always located at same parts of the host, when host is moved or rotated. Each Load host must subclass a mixin that defines properties required for a Load to define its relative location. The mixins are:

- [IDefinedPoint](#idefinedpoint) - implemented by [Vertex](#vertex) and [PointSupport](#pointsupport)
- [IDefinedCurve](#idefinedcurve) - implemented by [CurveMember](#curvemember) and [CurveSupport](#curvesupport)
- [IDefinedSurface](#idefinedsurface) - implemented by [SurfaceMember](#surfacemember) and [SurfaceSupport](#surfacesupport)

Each Load subclass has sepperate abstract Relative Location Aspects which are further subclassed by each possible host type:

- [RelativePointLocationAspect](#relativepointlocationaspect) - defines location for a [PointLoad](#pointload), subclasses:
  - [PointRelativeToPointAspect](#pointrelativetopointaspect) - defines location for a PointLoad on a point host - IDefinedPoint
  - [PointRelativeToCurveAspect](#pointrelativetocurveaspect) - defines location for a PointLoad on a curve host - IDefinedCurve
  - [PointRelativeToSurfaceAspect](#pointrelativetosurfaceaspect) - defines location for a PointLoad on a surface host - IDefineSurface
- [RelativeCurveLocationAspect](#relativecurvelocationaspect) - defines location for a [CurveLoad](#curveload), subclasses:
  - [CurveRelativeToCurveAspect](#curverelativetocurveaspect) - defines location for a CurveLoad on a curve host - IDefinedCurve
  - [CurveRelativeToSurfaceAspect](#curverelativetosurfaceaspect) - defines location for a CurveLoad on a surface host - IDefinedSurface
- [RelativeSurfaceLocationAspect](#relativesurfacelocationaspect) - defines location for a SurfaceLoad, the only subclass is [SurfaceRelativeToSurfaceAspect](#surfacerelativetosurfaceaspect) which defines relative location on a surface host - IDefinedSurface

### RelativePointLocationAspect

Defines relative location for a [PointLoad](#pointload). All IDefinedLocation mixins ([IDefinedPoint](#idefinedpoint), [IDefinedCurve](#idefinedcurve), [IDefinedSurface](#idefinedsurface)) can provide a relative location for this aspect. The aspect is subclassed based on the host type:

- [PointRelativeToPointAspect](#pointrelativetopointaspect) - defines location for a PointLoad on a point host - IDefinedPoint ([Vertex](#vertex), [PointSupport](#pointsupport))
- [PointRelativeToCurveAspect](#pointrelativetocurveaspect) - defines location for a PointLoad on a curve host - IDefinedCurve ([CurveMember](#curvemember), [CurveSupport](#curvesupport))
- [PointRelativeToSurfaceAspect](#pointrelativetosurfaceaspect) - defines location for a PointLoad on a surface host - IDefineSurface ([SurfaceMember](#surfacemember), [SurfaceSupport](#surfacesupport))

### RelativeCurveLocationAspect

Defines relative location for a [CurveLoad](#curveload). Only elemets that implement [IDefinedCurve](#idefinedcurve), [IDefinedSurface](#idefinedsurface) mixins can provide location for this aspect. The aspect is subclassed based on the host type:

- [CurveRelativeToCurveAspect](#curverelativetocurveaspect) - defines location for a CurveLoad on a curve host - IDefinedCurve ([CurveMember](#curvemember), [CurveSupport](#curvesupport))
- [CurveRelativeToSurfaceAspect](#curverelativetosurfaceaspect) - defines location for a CurveLoad on a surface host - IDefineSurface ([SurfaceMember](#surfacemember), [SurfaceSupport](#surfacesupport))

### RelativeSurfaceLocationAspect

Defines relative location for a [SurfaceLoad](#surfaceload). Only elemets that implement [IDefinedSurface](#idefinedsurface) mixins can provide location for this aspect. The aspect is subclassed based on the host type:

- [SurfaceRelativeToSurfaceAspect](#surfacerelativetosurfaceaspect) - defines location for a SurfaceLoad on a surface host - IDefineSurface ([SurfaceMember](#surfacemember), [SurfaceSupport](#surfacesupport))

### PointRelativeToPointAspect

Describes relationship between [PointLoad](#pointload) and its host point - [IDefinedPoint](#idefinedpoint) ([Vertex](#vertex), [PointSupport](#pointsupport)). Allows to define a location at that specific point where the force of PointLoad is applied to.

### PointRelativeToCurveAspect

Describes relationship between [PointLoad](#pointload) and its host curve - [IDefinedCurve](#idefinedcurve) ([CurveMember](#curvemember). [CurveSupport](#curvesupport)). Allows to define a location on a host where the force of a PointLoad is applied to.

### PointRelativeToSurfaceAspect

Describes relationship between [PointLoad](#pointload) and its host surface - [IDefinedSurface](#idefinedsurface) ([SurfaceMember](#surfacemember), [SurfaceSupport](#surfacesupport)). Allows to define a location on a host where the force of a PointLoad is applied to.

### SurfaceRelativeToSurfaceAspect

Describes relationship between [SurfaceLoad](#surfaceload) and its host surface - [IDefinedSurface](#idefinedsurface) ([SurfaceMember](#surfacemember), [SurfaceSupport](#surfacesupport)). Allows to define a location on a host where the force of a surface load is applied to.

### CurveRelativeToCurveAspect

Describes relationship between [CurveLoad](#curveload) and its host curve - [IDefinedCurve](#idefinedcurve) ([CurveMember](#curvemember), [CurveSupport](#curvesupport)). Allows to define a location on a host where the force of a CurveLoad is applied to.

### CurveRelativeToSurfaceAspect

Describes relationship between [CurveLoad](#curveload) and its host surface - [IDefinedSurface](#idefinedsurface) ([SurfaceMember](#surfacemember), [SurfaceSupport](#surfacesupport)). Allows to define a location on a host where the force of a CurveLoad is applied to.

SurfaceMember might have some [SurfaceMemberModifiers](#surfacemembermodifier) which have different thickness than the rest of SurfaceMember. Since CurveLoads are defined by SurfaceMember's plane, CurveLoad might not always rest on a modifier. For this case SurfaceAlignmentType and offset properties can be used to adjust load location to match modifier's plane.

### PointRotationalBehavior

Indicates how a [PointSupport](#pointsupport) behaves at connection when affected by a force about some specific rotational axis.

### CurveRotationalBehavior

Indicates how a [CurveSupport](#curvesupport) behaves at connection when affected by a force about some specific rotational axis. TODO: more detailed description, add derived classes..

### SurfaceRotationalBehavior

Indicates how a [SurfaceSupport](#surfacesupport) behaves at connection when affected by a force about some specific rotational axis.

### PointTranslationalBehavior

Indicates how a [PointSupport](#pointsupport) behaves at connection when affected by a force along some specific axis. The behavior is assigned through [PointSupportBehavior](#pointsupportbehavior) class.

### CurveTranslationalBehavior

Indicates how a [CurveSupport](#pointsupport) behaves at connection when affected by a force along some specific axis. The behavior is assigned through [CurveSupportBehavior](#curvesupportbehavior) class.

### SurfaceTranslationalBehavior

Indicates how a [SurfaceSupport](#surfacesupport) behaves at connection when affected by a force along some specific axis. The behavior is assigned through [SurfaceSupportBehavior](#surfacesupportbehavior) class.

### FixedCurveRotationalBehavior

Indicates that a [CurveSupport](#curvesupport) is fixed about some specific rotational axis. CurveSupport prevent elements from moving freely about the specified axis. Both CurveSupport and Elements at the connection curve transfer forces between each other, if the direction of that force matches direction about the specified axis.

### ReleasedCurveRotationalBehavior

Indicates that a [CurveSupport](#curvesupport) is released about some specific rotational axis. CurveSupport does not prevent elements from moving freely about the specified axis. Both CurveSupport and Elements at the connection do not transfer any force between each other, if the direction of that force matches direction about the specified axis.

### FixedCurveTranslationalBehavior

Indicates that a [CurveSupport](#curvesupport) is fixed along some specific axis. CurveSupport prevent elements from moving freely along the specified axis. Both CurveSupport and Elements at the connection curve transfer forces between each other, if the direction of that force matches direction along that specified axis.

### ReleasedCurveTranslationalBehavior

Indicates that a [CurveSupport](#curvesupport) is released along some specific axis. CurveSupport does not prevent elements from moving freely along the specified axis. Both CurveSupport and Elements at the connection curve do not transfer any force between each other, if the direction of that force matches direction along that specified axis.

### FixedPointRotationalBehavior

Indicates that a [PointSupport](#pointsupport) is fixed about some specific rotational axis. PointSupport prevent elements from moving freely about the specified axis. Both PointSupport and Elements at the connection point transfer forces between each other, if the direction of that force matches direction about the specified axis.

### ReleasedPointRotationalBehavior

Indicates that a [PointSupport](#pointsupport) is released about some specific rotational axis. PointSupport does not prevent elements from moving freely about the specified axis. Both PointSupport and Elements at the connection point do not transfer any force between each other, if the direction of that force matches direction about the specified axis.

### FixedPointTranslationalBehavior

Indicates that a [PointSupport](#pointsupport) is fixed along some specific axis. PointSupport prevent elements from moving freely along the specified axis. BothPoint Support and Elements at the connection point transfer forces between each other, if the direction of that force matches direction along that specified axis.

### ReleasedPointTranslationalBehavior

Indicates that a [PointSupport](#pointsupport) is released along some specific axis. PointSupport does not prevent elements from moving freely along the specified axis. Both PointSupport and Elements at the connection point do not transfer any force between each other, if the direction of that force matches direction along that specified axis.

### FixedSurfaceRotationalBehavior

Indicates that a [SurfaceSupport](#surfacesupport) is fixed about some specific rotational axis. SurfaceSupport prevents elements from moving freely about the specified axis. Both SurfaceSupport and Elements at the connection surface transfer forces between each other, if the direction of that force matches direction about the specified axis.

### ReleasedSurfaceRotationalBehavior

Indicates that a [SurfaceSupport](#surfacesupport) is released about some specific rotational axis. SurfaceSupport does not prevent elements from moving freely about the specified axis. Both SurfaceSupport and Elements at the connection surface do not transfer any force between each other, if the direction of that force matches direction about the specified axis.

### FixedSurfaceTranslationalBehavior

Indicates that a [SurfaceSupport](#surfacesupport) is fixed along some specific axis. SurfaceSupport prevents elements from moving freely along the specified axis. Both SurfaceSupport and Elements at the connection surface transfer forces between each other, if the direction of that force matches direction along that specified axis.

### ReleasedSurfaceTranslationalBehavior

Indicates that a [SurfaceSupport](#surfacesupport) is released along some specific axis. SurfaceSupport prevents elements from moving freely along the specified axis. Both SurfaceSupport and Elements at the connection surface do not transfer any force between each other, if the direction of that force matches direction along that specified axis.

### LinearSpringCurveRotationalBehavior

Indicates that a [CurveSupport](#curvesupport) has a spring behavior about some specific axis. CurveSupport prevents elements from moving freely about the specified axis. Both CurveSupport and Elements at the connection curve transfer forces between each other, if the direction of that force matches direction about the specified axis. However, unlike [FixedCurveRotationalBehavior](#fixedcurverotationalbehavior), LinearSpringCurveRotational behavior has a stiffness at the connection which prevents elements from transferring full force through that connection.

### LinearSpringCurveTranslationalBehavior

Indicates that a [CurveSupport](#curvesupport) has a spring behavior along some specific axis. CurveSupport prevents elements from moving freely along the specified axis. Both CurveSupport and Elements at the connection curve transfer forces between each other, if the direction of that force matches direction along that specified axis. However, unlike [FixedCurveTranslationalBehavior](#fixedcurvetranslationalbehavior), LinearSpringCurveTranslational behavior has a stiffness at the connection which prevents elements from transferring full force through that connection.

### LinearSpringPointRotationalBehavior

Indicates that a [PointSupport](#pointsupport) has a spring behavior about some specific axis. PointSupport prevents elements from moving freely about the specified axis. Both PointSupport and Elements at the connection point transfer forces between each other, if the direction of that force matches direction about the specified axis. However, unlike [FixedPointRotationalBehavior](#fixedpointrotationalbehavior), LinearSpringPointRotational behavior has a stiffness at the connection which prevents elements from transferring full force through that connection.

### LinearSpringPointTranslationalBehavior

Indicates that a [PointSupport](#pointsupport) has a spring behavior along some specific axis. PointSupport prevents elements from moving freely along the specified axis. Both PointSupport and Elements at the connection point transfer forces between each other, if the direction of that force matches direction along that specified axis. However, unlike [FixedPointTranslationalBehavior](#fixedpointtranslationalbehavior), LinearSpringPointTranslational behavior has a stiffness at the connection which prevents elements from transferring full force through that connection.

### LinearSpringSurfaceRotationalBehavior

Indicates that a [SurfaceSupport](#surfacesupport) has a spring behavior about some specific axis. SurfaceSupport prevents elements from moving freely about the specified axis. Both SurfacesSupport and Elements at the connection surface transfer forces between each other, if the direction of that force matches direction about the specified axis. However, unlike [FixedSurfaceRotationalBehavior](#fixedsurfacerotationalbehavior), LinearSpringSurfaceRotational behavior has a stiffness at the connection which prevents elements from transferring full force through that connection.

### LinearSpringSurfaceTranslationalBehavior

Indicates that a [SurfaceSupport](#surfacesupport) has a spring behavior along some specific axis. SurfaceSupport prevents elements from moving freely along the specified axis. Both SurfaceSupport and Elements at the connection surface transfer forces between each other, if the direction of that force matches direction along that specified axis. However, unlike [FixedSurfaceTranslationalBehavior](#fixedsurfacetranslationalbehavior), LinearSpringSurfaceTranslational behavior has a stiffness at the connection which prevents elements from transferring full force through that connection.

### ReleaseAspect

By default all conectivities through [Topology](#topologyelement) are treated as Fixed. ReleaseAspects allow to override these conectivities. Connectivities can be overriden for each [SharedTopologyElement](#sharedtopologyelement):

- [VertexReleaseAspect](#vertexreleaseaspect) overrides [Vertex](#vertex) connectivities
- [PathReleaseAspect](#pathreleaseaspect) overrides [Edge](#edge) connectivities
- [SheetReleaseAspect](#sheetreleaseaspect) overrides [Face](#face) connectivities

### VertexReleaseAspect

Adjusts fixities at [Vertex](#vertex) connectivity.

### LogicalVertexReleaseAspect

Indicates **Logical** release at a [Vertex](#vertex). Logical release can be fully released or fully fixed. see [TODO: Add release enum].

### PathReleaseAspect

Adjust fixities for all [Edges](#edge) in a [Path](#path). At the momment fixities can be only fully fixed or fully released: [LogicalPathReleaseAspect](#logicalpathreleaseaspect).

### LogicalPathReleaseAspect

Indicates **Logical** release for all [Edges](#edge) in a [Path](#path). By default all connectivities at Edges are fixed. Fixities can be overriden with this aspect.

There might be some cases where applications will need to have varying fixities at Edges in a Path, for this, elements can use "SubPaths". e.g. [CurveMember](#curveemmber) always owns a single **location** [Wire](#wire) which defines location. Logical Path Release Aspect could override all Edge fixities in that **location Wire**, however there might be some Edges that need to have different fixities. This can be achived with **sub Wires** that share Edges with **location Wire**. CurveMember can have additional aspects that reference sub Wires. Location Path fixities will always override default fixities, sub Wire fixities will always override location Path defined fixities.

Elements should never have multiple release aspects refering to the same Path.

### SheetReleaseAspect

Adjust fixities for all [Faces](#face) in a [Sheet](#sheet). At the momment fixities can be only fully fixed or fully released: [LogicalSheetReleaseAspect](#logicalsheetreleaseaspect).

### LogicalSheetReleaseAspect

Indicates **Logical** release for all [Faces](#face) in a [Sheet](#sheet). By default all connectivities at Faces are fixed. Fixities can be overriden with this aspect.

(Future) There might be some cases where applications will need to have varying fixities at Faces in a Sheet, for this, elements can use "SubSheets". e.g. [SurfaceMember](#surfaceemmber) always owns a single **location** [Sheet](#sheet) which defines location. Logical Sheet Release Aspect could override all Face fixities in that **location Sheet**, however there might be some Faces that need to have different fixities. This can be achived with **sub Sheets** that share Faces with **location Sheet**. SurfaceMember can have additional aspects that reference sub Sheets. Location Sheet fixities will always override default fixities, sub Sheet fixities will always override location Sheet defined fixities.

Elements should never have multiple release aspects refering to the same Sheet.

## Enumerations

### CardinalPoint

Specifies locations (points/curves) on a Profile.

### SurfaceMemberClassificationType

Specifies classification for [SurfaceMember](#surfacemember).

### CurveVariationType

Specifies how [Load](#load) vary along the host [IDefinedCurve](#idefinedcurve)

### PlacementPoint

Specifies how the surface ([Sheet](#sheet)) is referenced by a [SurfaceMember](#surfacemember).

### BendingBehaviorValue

This enum is used to describe the structural behavior of a [SurfaceMember](#surfacemember) subject to transverse loads. Please note:

- These values define the behavior of a SurfaceMember in its interior. The [Edge](#edge) releases/fixities of the member have no effect on its interior behavior
- These values affect how a member is analyzed; they are not intended to indicate design parameters
- These values do NOT reflect which analysis models ("Lateral" vs "Gravity") a member is analyzed in. See [LoadResistanceAspect](#loadresistanceaspect)

### LoadResistanceValue

Classifies [Members](#member) according to the types of loads they can resist. Check [LoadResistanceValue](#loadresistancevalue) enum for possible values.

### AxialBehaviorType

Describes the structural behavior of a [CurveMember](#curvemember) subject to axial loads. Please note:

- These values define the behavior of a member between its ends. The end releases/fixities of the member have no effect on its interior behavior
- These values affect how a member is analyzed; they are not intended to indicate design parameters
- These values do NOT reflect which analysis models ("Lateral" vs "Gravity") a member is analyzed in. See [LoadResistanceValue](#loadresistancevalue)

## MixIns

### ISheetOwner

Defines parent for a [Sheet](#sheet). Each class which can have a Sheet as a child should subclass from this mix-in. [TopologyElements](#topologyelement) are smallest part of StructuralAnalysis schema, these classes should not reference directly any more complex entity (e.g. [SurfaceMember](#surfacemember), [PointSupport](#pointsupport)), ISheetOwner allows to avoid the need of such direct relationship.

### IPathsOwner

Defines parent for a [Path](#path). Each class which can have a Path as a child should subclass from this mix-in. [TopologyElements](#topologyelement) are smallest part of StructuralAnalysis schema, these classes should not reference directly any more complex entity (e.g. [SurfaceMember](#surfacemember), [PointSupport](#pointsupport)), IPathOwner allows to avoid the need of such direct relationship.

### ILoopOwner

Defines parent for a [Loop](#loop). Each class which can have a Loop as a child should subclass from this mix-in. [TopologyElements](#topologyelement) are smallest part of StructuralAnalysis schema, these classes should not reference directly any more complex entity (e.g. [SurfaceMember](#surfacemember), [PointSupport](#pointsupport)), ILoopOwner allows to avoid the need of such direct relationship.

### IWireOwner

Defines parent for a [Wire](#wire). Each class which can have a Wire as a child should subclass from this mix-in. [TopologyElements](#topologyelement) are smallest part of StructuralAnalysis schema, these classes should not reference directly any more complex entity (e.g. [SurfaceMember](#surfacemember), [PointSupport](#pointsupport)), IWireOwner allows to avoid the need of such direct relationship.

### ISurface

[SurfaceMember](#surfacemember) and [SurfaceMemberModifier](#surfacemembermodifier) require many of the same properties and behave in similar manners. Because of this similarity, both interfaces implement the same mixing - ISurface.
 ISurface always has a normal, which is provided by some other related element ([Sheet](#sheet)).

### IDefinedPoint

Commonly used for defining relative location for [PointLoad](#pointload). IDefinedPoint is usually implemented by [Vertex](#vertex) class. However, it is possible that in the future additional elements will implement this mixin. its is recommended for applications that work with PointLoads, to reference Vertices through IDefinedPoint mixins and [PointRelativeToPointAspect](#pointrelativetopointaspect).

### IDefinedCurve

Commonly used for defining relative location for [PointLoad](#pointload) and [CurveLoad](#curveload). IDefinedCurve is usually implemented by [CurveMember](#curvemember) and [CurveSupport](#curvesupport) classes. Applications that work with [Loads](#load) should reference host [Members](#member) through IDefinedCurve mixin and [PointRelativeToCurveAspect](#pointrelativetopointaspect) or [CurveRelativeToCurveAspect](#curverelativetocurveaspect).

### IDefinedSurface

Commonly used for defining relative location for [PointLoad](#pointload), [CurveLoad](#curveload) and [SurfaceLoad](#surfaceload). IDefinedSurface implemented by [SurfaceMember](#surfacemember) and [SurfaceSupport](#surfacesupport) classes. Applications that work with [Loads](#load) should reference host [Members](#member) through IDefinedSurface mixin and [PointRelativeToSurfaceAspect](#pointrelativetosurfaceaspect), [CurveRelativeToSurfaceAspect](#curverelativetosurfaceaspect) or [SurfaceRelativeToSurfaceAspect](#surfacerelativetosurfaceaspect).
