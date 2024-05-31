---
noEditThisPage: true
remarksTarget: BisCustomAttributes.ecschema.md
---

# BisCustomAttributes

## Enumerations

### SchemaLayer

A schema at a particular layer can only reference schemas at the same layer or lower.

#### Core

It includes schemas such as *BisCore*, *Analytic* and *Functional*.

#### Common

The Common layer is laid out right above Core. Examples of BIS schemas at this layer include *ClassificationSystems*, *NetworkTopology* and *SpatialComposition*.

#### DisciplinePhysical

The Discipline-Physical layer is defined above Common. Examples of BIS schemas at this layer include *Earthwork*, *RoadSpatial* and *StructuralPhysical*.

#### DisciplineOther

The Discipline-Other layer is defined above Discipline-Physical. Examples of BIS schemas at this layer include *StructuralAnalysis*, *IoTDeviceFunctional* and *GeologicalModel*.

### Application

Application is the highest layer in the BIS schema hierarchy. Examples of BIS schemas at this layer include static iModel Connector schemas such as OpenBuilding Designer's *BuildingDataGroupBase* and Bentley Civil's *CifRoads*. It also includes all dynamically-generated iModel Connector schemas, such as *IFCDynamic* and *RevitDynamic*.

Other technology-specific schemas not meant to be referenced by other schemas belong to this layer. Examples include *PresentationRules*, *PointCloud* and *ScalableMesh*.

## Custom Attribute Classes

### SchemaLayerInfo

BIS schemas should be tagged with the `SchemaLayerInfo` `CustomAttribute` to enable validation and error checking related to schema-references.

### TypeDefinitionRelationship

Under this _type definition_ semantics, the element at the source end of the relationship is subclassified by the element at the target end (its Type-Definition). That is, the latter provides a finer classification of the former than what its _element class_ targets. Furthermore, any business properties and their values captured by the element at the target end of the relationship are considered shared among all the elements at the source of the relationship.

Note that the `TypeDefinitionRelationship` `CustomAttribute` implies that a relationship tagged with it uses a _referencing_ **strenght**, has a _0..*_ **multiplicity** on its source end, and a _0..1_ **multiplicity** on its target end-point.