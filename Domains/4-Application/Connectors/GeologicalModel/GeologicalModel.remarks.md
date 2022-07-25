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

Instances of `FaultBlock` typically do not have geometry on their own. An instance of `FaultBlock` is submodeled by a `GeologicalModel` containing instances of `GeologicalCategoryVolume` and adjacent `ContactSurface`s.

### GeologicalCategoryVolume

Instances of `GeologicalCategoryVolume` are expected to be contained in a submodel of a `FaultBlock` instance that it is part of. An instance of `GeologicalCategoryVolume` can use multiple `ContactSurfaceIsAdjecentToVolume` relationship instances to associate it with its adjacent `ContactSurface`s.

### ContactSurface

Instances of `ContactSurface` are expected to be contained in a submodel of a `FaultBlock` instance that it is part of. An instance of `ContactSurface` can use multiple `ContactSurfaceIsAdjecentToVolume` relationship instances to associate it with its adjacent `GeologicalCategoryVolume`s.