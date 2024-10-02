---
noEditThisPage: true
remarksTarget: StormSewerPhysicalViews.ecschema.md
---

# StormSewerPhysicalViews

This schema contains view-classes that extend the StormSewerPhysical schema with concepts that can be derived from it, in light of  Stormwater and Sewage collection systems.

## Entity Classes

### PipeView

The `PipeView` class is typically joined with the `pipphys:Pipe` class in ECSQL queries in order to retrieve both persisted and derived properties about Pipe instances.