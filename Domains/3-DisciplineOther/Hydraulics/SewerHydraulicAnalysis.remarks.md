---
noEditThisPage: true
remarksTarget: SewerHydraulicAnalysis.ecschema.md
---

# SewerHydraulicAnalysis

This schema defines classes that represent data for Hydraulic modeling of Stormwater and Sanitary networks.

## Entity Classes

### TimeOfConcentrationFlowPath

Instances of `TimeOfConcentrationFlowPath` have a `FlowPath` property, which stores the path representing the longest flow path that water travels along to the low point for a catchment area. The geometry should be encoded as a [Path](https://www.itwinjs.org/reference/core-geometry/curve/path/), composed of the following geometry options:
- Linear segments, stored as [LineSegment3d](https://www.itwinjs.org/reference/core-geometry/curve/linesegment3d/)s.
- Line strings, stored as [LineString3d](https://www.itwinjs.org/reference/core-geometry/curve/linestring3d/)s.
- Arc segments, stored as [Arc3d](https://www.itwinjs.org/reference/core-geometry/curve/arc3d/)s.