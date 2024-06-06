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

### CrossPerspectiveRelationship

Note that the `CrossPerspectiveRelationship` `CustomAttribute` does not imply by itself a particular multiplicity among the elements of the two associated modeling perspectives. A relationship class tagged with it shall specify the expected multiplicity at each end-point.