---
remarksTarget: RoadRailAlignment.ecschema.md
---

# RoadRailAlignment

Contains the main classes to capture Alignment information primarily used in Road & Rail disciplines.

## Entity Classes

### Alignment

When an `Alignment` drives the design of a linear asset, it is referred to as a *Design Alignment*. `Alignment`s used for design purposes shall be contained in a `SpatialLocationModel`, submodel of a `DesignAlignments` instance, and by default, shall use the Domain-ranked `Alignment` category.

On the other hand, when an `Alignment` describes a secondary entity of a linear asset, it is referred to as a *Linear*. `Alignment`s created for the purpose of a *Linear* shall be contained in any `SpatialModel`, and by default, shall use the Domain-ranked `Linear` category.

An `Alignment` shall always have an associated `HorizontalAlignment`, but `VerticalAlignment`s are optional. When an `Alignment` has one or more associated `VerticalAlignment`s, it refers to the one used to describe its profile as being the *Main Vertical*.

The `Alignment` class inherits its `LengthValue` property from the `ILinearElement` mix-in. In the case of `Alignment`s, such property shall store its horizontal length rather than its 3D length. Such horizontal length is computed from the associated `HorizontalAlignment` instance and cached into the `LengthValue` property of the `Alignment`.

An `Alignment` stores its visible geometry, typically a 3D approximation calculated as a stroked line-string, in its `GeometryStream` encoded as a *Path*.


### DesignAlignments

A `DesignAlignments` instance, by default, shall use the Domain-ranked `Alignment` category.


### HorizontalAlignments

Every set of `Alignment`s, contained in a `SpatialModel`, shall have one and only one instance of `HorizontalAlignments` leading to a *Plan-projection* `SpatialLocationModel` containing one `HorizontalAlignment` instance for each `Alignment` in the parent model. 

Each `HorizontalAlignments` instance shall set its `CodeValue` property to "Horizontal Alignments", and by default, shall use the Domain-ranked `Alignment` category in the case of *Design Alignments* or the `Linear` category in the case of *Linears*.


### HorizontalAlignment

A `HorizontalAlignment` instance shall be contained in a *Plan-projection* `SpatialLocationModel` submodel of a `HorizontalAlignments` instance, and shall be associated with one `Alignment` on such parent model via the `AlignmentRefersToHorizontal` relationship.

A `HorizontalAlignment` typically has the same `CodeValue` and Category as its associated `Alignment`.

A `HorizontalAlignment` stores its visual geometry separately from geometry used for linear-referencing and design purposes, although the two could be identical. The former shall be stored in its `GeometryStream` whereas the latter shall be stored in the `HorizontalGeometry` property, encoded as a *Path*. Each curve primitive in such *Path* describes a segment along the `HorizontalAlignment` as follows:

- Linear segments shall be encoded as *LineSegment3d*s.
- Circular arc segments shall be encoded as *Arc3d*s.
- Transition segments (spirals) shall be encoded as *TransitionSpiral3d*s.

The Z-coordinate of all of these primitives shall be zero.


### VerticalAlignment

A `VerticalAlignment` instance shall be contained in a `VerticalAlignmentModel` submodel of the `Alignment` instance it is associated with. Only one `VerticalAlignment` instance is considered being the Main Vertical for a given `Alignment`. Other `VerticalAlignment`s associated with the same `Alignment` are typically used to describe the profile of assets designed along the same `Alignment`, e.g. the profile of the bottom of a Road ditch.

A `VerticalAlignment` by default use the Domain-ranked `Vertical Alignment` Category.

A `VerticalAlignment` stores its visual geometry separately from geometry used for linear-referencing and design purposes, although the two could be identical. The former shall be stored in its `GeometryStream` whereas the latter shall be stored in the `VerticalGeometry` property, encoded as a *Path*. Each curve primitive in such *Path* describes a segment along the `VerticalAlignment` as follows:

- Linear segments shall be encoded as *LineSegment3d*s.
- Circular arc segments shall be encoded as *Arc3d*s.
- Transition segments (parabolic) shall be encoded as *BSplineCurve3d*s.

The X-coordinate of all of these primitives shall indicate *distance along* measurements in terms of the corresponding `HorizontalAlignment`. That is, an X-coordinate = 0.0 corresponds to the start location of its `HorizontalAlignment`. Y-coordinates shall indicate *elevation* at such location. Z-coordinate of all of these primitives shall be zero. 

It is not uncommon for  a `VerticalAlignment` instance to capture *elevations* only for a partial range of its corresponding `HorizontalAlignment` instance. Note that the opposite situation, a `VerticalAlignment` instance capturing *elevations* before or after the range of its corresponding `HorizontalAlignment`, while possible in theory is typically considered invalid in practice. This schema leaves the decision to validate against such case to particular implementations, however.

### AlignmentStation

`AlignmentStation`s shall be used to map *distances along from start* measurements with *station values* along an `Alignment`. `AlignmentStation`s are linearly-located elements along an `Alignment`. They  shall carry the *distance along* measurement in a `LinearlyReferencedAtLocation` aspect whereas the mapped *station value* shall be stored in their `Station` property. `Alignment`s shall define its initial *station value* in their `StartStation` property.