---
remarksTarget: GeotechnicalModel.ecschema.md
---

# GeotechnicalModel

**alias:** geomodel

The `GeologicalModel` schema defines classes that represent data for interpreting the earth's subterranean structure based on (always limited) geotechnical exploration. The `GeologicalModel` schema is an *analytical* schema as:

- It models one view of reality and not reality itself.
- There can be multiple interpretations of the same subterranean region.

## Entity Classes

### FaultBlock

An instance of `FaultBlock` is submodeled by a `GeologicalModel` containing instances of `GeologicalCategoryVolume` and adjacent `ContactSurfaces`.
