---
noEditThisPage: true
remarksTarget: BisCustomAttributes.ecschema.md
---

# BisCustomAttributes

## SchemaGrade

The `SchemaGrade` enumeration is use in the `SchemaInfo` `CustomAttribute` to declare the schema author's intended compatibility level with BIS concepts and patterns for the schema.

### A

Grade A schemas at layers lower than *Application* aim to standardize the concepts and patterns in their scope throughout the BIS ecosystem. Such *data alignment* goal enables the development of software that understands such concepts in order to offer valuable functionality or services for them. 

Grade A schemas at the *Application* layer are designed with authoring in mind.

### B

Examples of Grade B include schemas such as `Bentley OpenPlant`'s implementation of ISO 15926, considered the standard in the Plant discipline, but developed outside of BIS. In that case, an intelligent conversion process into BIS for `OpenPlant` schemas exist, but the resulting BIS schemas typically do not support authoring correctly.

### C

An example of Grade C include auto-generated schemas classifying their data in terms of one or more Grade A schemas at the *Common*, *Discipline-Physical* or *Discipline-Other* layers. In such cases, software-driven understanding of classes in the schema is possible without human intervention.

Another example of Grade C include *Application* schemas not designed with authoring or alignment in mind. Static iModel Connector schemas designed to capture concepts in the source format that are not or cannot be aligned are also considered Grade C.

### D

An example of Grade D include auto-generated schemas introducing direct, generic concrete subclasses of Element-classes in *BisCore* (e.g. `bis:PhysicalElement`). Since no other discipline-specific schemas are involved, software-driven understanding of those classes is not possible without human intervention.

## SchemaLayer

A schema at a particular layer can reference schemas at the same layer or lower.

### Core

The Core layer includes schemas such as *BisCore*, *Analytic* and *Functional*.

### Common

Examples of BIS schemas at the Common layer include *ClassificationSystems*, *NetworkTopology* and *SpatialComposition*.

### DisciplinePhysical

Examples of BIS schemas at the Discipline-Physical layer include *Earthwork*, *RoadSpatial* and *Rebar*.

### DisciplineOther

Examples of BIS schemas at the Discipline-Other layer include *StructuralAnalytical* and *StructuralDesign*.

### Application

Examples of BIS schemas at the Application layer include static iModel Connector schemas such as ConceptStation's *CSSegments* and Bentley Civil's *CifRoads*. It also includes all dynamically-generated iModel Connector schemas.

Other technology-specific schemas not meant to be referenced by other schemas belong to this layer. Examples include *PresentationRules*, *PointCloud* and *ScalableMesh*.

## SchemaInfo

The `SchemaInfo` `CustomAttribute` is used by the schema author to declare the intended usage and compatibility level of a schema in light of the BIS ecosystem. 

BIS schemas should be tagged with the `SchemaInfo` `CustomAttribute` to enable this error checking.