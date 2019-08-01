---
noEditThisPage: true
remarksTarget: Terrain.ecschema.md
---

# Terrain

This schema contains classes that are used to provide *context* terrains. Cuts, fills and modifications to terrain are defined in the Earthwork schema.

See the `TerrainReference` documentation for details on how terrain is defined in iModels.

## Entity Classes

### TerrainReference

`TerrainReference` is used to define a static *context* for assets and projects. The terrain data is always provided by a service, but may be locally cached.

There are three terrain types in iModels:

1. *Background Default Terrain* (defined in the iModel settings)
2. `TerrainReference`s
3. `TBD` in the Earthwork schema.

<!-- TODO: update TBD above once the class is known -->

These three terrain types interact as follows.

The *Background Default Terrain* comes from a service (typically Cesium World Terrain). This background terrain is typically available world-wide. For the iModel, the *Background Default Terrain* is used wherever there is no other terrain defined.

`TerrainReference`s also provide terrain from a service. The terrain defined by `TerrainReference`s tends to be from data that was captured specifically for the project or asset under consideration and is generally more accurate and/or more current than the terrain provided by the *Background Default Terrain*. `TerrainReference`s are always used instead of *Background Default Terrain* where the two overlap. In many large projects there will be multiple `TerrainReference`s provided. For example, one `TerrainReference` may provide a low-resolution terrain for the entire project site and other `TerrainReference`s may define high-resolution terrain for focused areas where most of the work will occur. Where `TerrainReference`s' *Footprints* overlap, the `TerrainReference` with the highest `Priority` will be used.

In Digital Twins, both *Background Default Terrain* and `TerrainReference`s provide the context for the infrastructure or the starting (or current) conditions of the site.

`TBD` in the Earthwork schema is used to define modifications to terrain. Where `TBD` overlaps *Background Default Terrain* or `TerrainReference`s, `TBD` is always used.

<!-- TODO: update TBD above once the class is known -->

Every `TerrainReference` has a *Footprint* that is stored in its `GeometryStream`. *Footprints* are always polygons with z=0 (effectively making them 2D).

`TerrainReference`s must be contained in `SpatialLocationModel`s or `PhysicalModel`s. The choice of the containing `Model` has these repercussions:

- The visibility of the terrain is controlled along with the visibility of other `Element`s in the `Model`.
- There is an implication that the party responsible for the other `Element`s in the `Model` is also responsible for the `TerrainReference`.

**ServiceName Property**

`ServiceName` also indirectly defines the API and data format of the service. Currently these services are supported:

| ServiceName Value | Service |
|-------------------|---------|
| "ScalableMesh" | Bentley's scalable mesh service |

## Relationship Classes
