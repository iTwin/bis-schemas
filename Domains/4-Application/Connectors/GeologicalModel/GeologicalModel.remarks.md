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

Instances of `FaultBlock` do not have geometry on their own, and are separated by `FaultSurface`s. An instance of `FaultBlock` owns instances of `GeologicalCategoryVolume` and adjacent `ContactSurface`s modeling its parts. Instances of `FaultBlock` are expected to always be contained in a `GeologicalModel`.

### GeologicAnalyticalPartition

A `GeologicAnalyticalPartition` is always submodeled by a `GeologicalModel`.

### GeologicalCategoryVolume

Instances of `GeologicalCategoryVolume` are expected to be children of a `FaultBlock` instance that they are part of. They represent a particular Geological Category, such as lithology. An instance of `GeologicalCategoryVolume` can use multiple `ContactSurfaceIsAdjecentToVolume` relationship instances to associate it with its adjacent `ContactSurface`s.

### GeologicalModel

A `GeologicalModel` contain all `GeologicalElement3d` instances resulting from the interpretation of a specific Geological model. A `GeologicalModel` always sub-models an instance of `GeologicAnalyticalPartition`.

### ContactSurface

Instances of `ContactSurface` are expected to be children of a `FaultBlock` instance that they are part of. They represent the contact between `GeologicalCategoryVolume`s. An instance of `ContactSurface` can use multiple `ContactSurfaceIsAdjecentToVolume` relationship instances to associate it with its adjacent `GeologicalCategoryVolume`s.