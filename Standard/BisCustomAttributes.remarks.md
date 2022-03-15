---
noEditThisPage: true
remarksTarget: BisCustomAttributes.ecschema.md
---

# BisCustomAttributes

## SchemaGradeValue

The `SchemaGradeValue` enumeration is use in the `SchemaInfo` `CustomAttribute` to declare the schema author's intended compatibility level with BIS concepts and patterns for the schema.

### A

True BIS schemas carefully designed for editing and interoperability.

### B

Either: Legacy “consensus” schemas intelligently converted to BIS, or new BIS schemas, with one-way conversion to BIS in mind, but not intended for editing (native format).

### C

Legacy schema with software-discoverable semantics, intelligently converted to follow applicable BIS rules and patterns.

### D

Legacy schema with minimim or no software-discoverable semantics, converted to follow basic BIS rules and patterns.

## SchemaLayerValue

The `SchemaLayerValue` enumeration is use in the `SchemaInfo` `CustomAttribute` to declare the schema author's intended layer for the schema. A schema at a particular layer can reference schemas at the same layer or lower.

### Core

Schemas defining the 'fabric of the universe' and some key organizational strategies.

### Common

Schemas defining abstract concepts and patterns used by multiple disciplines.

### DisciplinePhysical

Schemas defining physical/spatial and closely associated concepts, in light of a specific discipline.

### DisciplineOther

Schemas defining concepts from modeling perspectives other than physical, in light of a specific discipline.

### Application

Schemas defining concepts that no other schema would need or want to reference. Product and iModel Connector schemas as well as dynamically-generated or user-customized schemas belong to this layer.

## SchemaInfo

The `SchemaInfo` `CustomAttribute` is used by the schema author to declare the intended usage and compatibility level of a schema in light of the BIS ecosystem. 

BIS schemas should be tagged with the `SchemaInfo` `CustomAttribute` to enable this error checking.