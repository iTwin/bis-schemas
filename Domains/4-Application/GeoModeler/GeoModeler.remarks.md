---
remarksTarget: GeoModeler.ecschema.md
---

# GeoModeler

**alias:** GeoMdlr

The `GeoModeler` schema extends the `GeotechnicalInterpretation` schema providing data types that are only of interest to the GeoModeler application.

It is recommended that other applications and services NOT rely on the information stored this schema. Other applications and services
should rely on the GeotechnicalInterpretation schema which will be used to store information of general interest.

## Entity Classes

### Plaxis2dLink

XXXXXXX Need clear definition and usage XXXXX

### Plaxis3dLink

XXXXXXX Need clear definition and usage XXXXX

### SurfaceLayeringGenerationParameters

`SurfaceLayeringGenerationParameters` contains parameters for the Surface Layering ground generation engine.

`ExtentConcavityRadius` defines the circle that is used when defining the plan-view extent of the created `Ground`.
A very large value (e.g. 100 times the maximum distance between boreholes) will lead to a near-convex hull shape.
A small value (e.g. half the spacing between boreholes) will lead to a shape with significant concavities.
Background information can be found at https://en.wikipedia.org/wiki/Alpha_shape .

## Relationship Classes

