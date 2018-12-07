---
remarksTarget: StructuralAnalysis.md
---

### TopologyElement

All `TopologyElement`s within a `Model` have the same `Origin`, `Roll`, `Pitch` and `Yaw`. This matches the approach of IFC's `IfcStructuralAnalysisDomain` and simplifies many calculations within `Element`s in the `Model`.

### SharedTopologyElement

`SharedTopologyElement`s provide location and connectivity. There is one and only one subclass of `SharedTopologyElement` for each dimensionality:

- `Vertex` for 0D
- `Edge` for 1D
- `Face` for 2D
- `Region` (future) for 3D

 Every subclass must be sealed.

`SharedTopologyElement`s are `Model`-scope resources that never have a parent `DgnElement`. The sharing (via referencing relationships) of these `DgnElement`s provides and defines the location and connectivity of the structural analysis `DgnElement`s.

 `SharedTopologyElement`s are generally immutable, except for two use cases:

  1. Move Model (translate or rotate the entire structural model)
  2. Stretch Model (stretch a portion of a structural model)

Stretching is not always possible. Stretching the model is not allowed unless the entire model data can be updated to be valid.

Instead of being modified, `ShareTopologyElement`s are typically replaced. For example, an `Edge` that is split is replaced by two `Edge`s.

### Vertex

`Vertex`es provide a point location and connectivity at the point.

 `Vertex`es are `Model`-scope shared resources that ***never*** have a parent `DgnElement`.

*Parasolid Equivalent: Vertex*

### Edge

`Edge`s provide a curve location (between two `Vertex`es) and connectivity along the curve .

`Edge`s are ***only*** referred to by `Path`s (through `OrientedEdgeAspect`s). Any other DgnElement with a relationship to an `Edge` will not be considered (for updating) in operations that split, merge or delete the `Edge`.

`Edge`s are `Model`-scope shared resources that ***never*** have a parent `DgnElement`.

*Parasolid Equivalent: Edge*

### Face

`Face`s provide a surface location (bounded by `Loop`s) and connectivity across that surface.

`Face`s contain `Loop`s and `Wire`s as children. The `Loop`s represent `Face` boundaries and the `Wire`s represent linear connectivity within the `Face`.

`Vertex`es that are connected to the `Face` (and are not part of `Loop`s or `Wire`s) are related to the Face with the `FaceHasInternalVertices` relationship.

`Face`s are ***only*** referred to by `FaceSet`s (through `OrientedFaceAspect`s). Any other DgnElement with a relationship to a `Face` will not be considered in operations that split, merge or delete the `Face`.

`Face`s are `Model`-scope shared resources that ***never*** have a parent `DgnElement`.

*Parasolid Equivalent: Face*

### PrivateTopologyElement

`PrivateTopologyElement`s ***always*** have a parent `DgnElement` that owns them; if the parent is deleted, the `PrivateTopologyElement` is deleted also. The parent DgnElement may be a `TopologyElement` (such as a `Face` owning `Loop`s) or may be a `StructuralElement` (such as a `CurveMember` owning a `Wire`).

There is one and only one subclass of `PrivateTopologyElement` for each dimensionality above zero:

- `Path` for 1D (collection of `Edge`s)
- `FaceSet` for 2D (collection of `Face`s)
- `Solid` (future) for 3D (collection of `Region`s)

(there is no need for a 0D SharedTopologyElement, as there is no strong motivation to manage a collection of `Vertex`es)

### Path

`Path` is a sequence of `Vertex`-connected `Edge`s.

`Path` is abstract and only has two subclasses (both sealed):

 1. `Loop` - a closed `Path` defining the boundary of a `Face`.
 2. `Wire` - an open or closed `Path` that does not define the boundary of a `Face`.

The `Edge`s of a `Path` are defined through its ownership of `OrientedEdgeAspect`s. A valid `Path` must always have at least one `OrientedEdgeAspect`.

### Wire

`Wire` is a `Path` that does not define the boundary of a `Face`. `Wire`s may be open or closed.

Every Wire has a parent that is one of the following:

- Face
- CurveMember
- CurveSupport
- xxxx

When a `Wire`'s parent is a `Face`, all of the `Wire`'s `Edge`s  must reside in the `Surface` of its `Face`.

*Parasolid Equivalent: Wire Body*

### Loop

`Loop` is a `Path` that defines the boundary of a `Face` (and is owned by the `Face`).

Every `Loop` has a parent that is a `Face`.

All `Edge`s in a `Loop` must reside in the `Surface` of its `Face`.

*Parasolid Equivalent: Loop*

### FaceSet

`FaceSet` is a set of `Edge`-connected `Face`s with compatible orientations.

The `Face`s of a `FaceSet` are defined through its ownership of `OrientedFaceAspect`s. A valid `FaceSet` must always have at least one `OrientedFaceAspect`.

`FaceSet` is abstract and only has two subclasses (both sealed):

 1. `Shell` (Future) - a closed `FaceSet` defining the boundary of a `Region` (future).
 2. `Sheet` - an open or closed `FaceSet` that does not define the boundary of a `Region`.

### Sheet

`Sheet` is a `FaceSet` that does not define the boundary of a `Region` (future).

`Sheet` further constrains the `Surface` property of its children's `Face`s. Every `Face` in a `Sheet` must have the same `Surface` (the motivation for this is to provide a single surface-based coordinate system for `SurfaceMember`s).

Every `Sheet` has a parent that is one of the following:

- `SurfaceMember`
- `SurfaceMemberRegion` (and hence `SurfaceMemberModifier` and `SurfaceMemberOpening`)

*Parasolid Equivalent: Sheet Body*

### OrientedEdgeAspect

`OrientedEdgeAspect` shows relationship between a `Path` and `Edge`.
A `Path` might have multiple `Edges` one of `OrientedEdgeAspect` purposes is to define the order of multiple `Edge`s in a `Path` by prociding a unique (for that `Path`) index.
`Edge`s in a `Path` are required to be connecting from one's start to other's end. It is posible to have a case where two `Edge`s are connected by their start points or end points, 
for this case direction proeprty of `OrientedEdgeAspect` needs to be configure, so that in a `Path` all `Edge`s would have same direction.
API user does not need to create `OrientedEdgeAspect`, since it will be auto-created after assigning `Edge` to a `Path`.

### OrientedFaceAspect
