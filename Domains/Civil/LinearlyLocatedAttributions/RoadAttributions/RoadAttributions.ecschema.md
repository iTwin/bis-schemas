---
remarksTarget: RoadAttributions.ecschema.md
---

# RoadAttributions

Contains classes specific to the Road-discipline, capturing Linearly-located attributions.

## Entity Classes

### SuperelevationRange

`SuperelevationRange`s must be contained in either `SpatialLocationModel`s or `PhysicalModel`s. They shall be linearly located along a *Linear-Element*.

The `GeometryStream` of `SuperelevationRange`s can optionally store a graphical representation aimed at helping visually understand the range its values apply to.

### ThroughLaneCount

 The count captured by instances of `ThroughLaneCount` excludes auxiliary lanes, parking and turning lanes, acceleration /deceleration lanes, toll collection lanes, shoulders, etc.

 `ThroughLaneCount`s must be contained in either `SpatialLocationModel`s or `PhysicalModel`s. They shall be linearly located along a *Linear-Element*.

The `GeometryStream` of `TroughLaneCount`s can optionally store a graphical representation aimed at helping visually understand the range its value applies to.