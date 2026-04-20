## Table of Content

- [Introduction](#introduction)
  - [Authoring workflow - Overview](#authoring-workflow---overview)
- [Channel Layout](#channel-layout)
- [BIS schemas](#bis-schemas)
  - [Targeted Standard BIS schemas](#targeted-standard-bis-schemas)
  - [Application schemas](#application-schemas)
- [Definition Elements](#definition-elements)

## Introduction

This article provides schema and data organization details for the Site Design data created by Bentley OpenSite+.

### Authoring workflow - Overview

In a nutshell, OpenSite+'s design is highly parametric, focused on capturing the end-user's design-intent in terms of a set of _authoring objects_, which in turn are used as the input to an engine that produces the actual Site Design in terms of sets of _output objects_.  

Since the former set is OpenSite+ specific, its classes and properties are defined in an Application BIS schema. On the other hand, since the latter sets are meant to be used for various purposes beyond OpenSite+ core functionality, they follow the semantics, rules and patterns defined by the applicable Standard BIS schemas.

Note that OpenSite+'s functionality includes Stormwater (drainage) simulation. The input of such kind of analysis is captured as a separate modeling perspective (i.e. Analitical), which is kept in sync with the associated Physical modeling perspective. Also note that the result data of the aforementioned simulations are not stored in the iModel, but in separate file-formats. That's due to the transient nature of such kind of information.

## Channel Layout

OpenSite+ organizes its data into multiple Subjects under one [Editing Channel](https://www.itwinjs.org/learning/backend/channel/) identified with the _Channel Key_ 'bentley:opensiteplus'.

The following table lists all the Subjects expected in the OpenSite+'s channel:

| Subject's CodeValue | Parent Subject | Description |
|---|---|---|
| OpenSite+ | <Root Subject> | Channel Subject |
| Default | OpenSite+ | Hierarchy Subject, kept hidden from User-interfaces |
| Draft | Default | Leads to a _PlanProjection_ `SpatialLocationModel` (via `SpatialLocationPartition`) that contains Graphical instances used as helpers during drafting |
| Alignment | Default | Leads to a _PlanProjection_ `SpatialLocationModel` (via `SpatialLocationPartition`) that contains `rralign:HorizontalAlignment` instances | 
| Physical | Default | Leads to a `PhysicalModel` (via `PhysicalPartition`) that contains full-3D _Physical_ and `rralign:Alignment` elements that capture the output of a Site Design |
| Plan | Default | Leads to a _PlanProjection_ `SpatialLocationModel` (via `SpatialLocationPartition`) that contains `SpatialLocation` elements with plannar representations of the entities in the Site Design |
| Authoring | Default | Leads to a _PlanProjection_ `SpatialLocationModel` (via `SpatialLocationPartition`) that contains application-specific elements that capture parametric input into a Site Design workflow |
| Hydraulic Analysis | Default | Leads to a `swrhyd:SewerHydraulicAnalysisModel` (via `swrhyd:SewerHydraulicAnalysisPartition`) that contains _Analytical_ elements capturing input data for hydraulic analysis simulation |
| Definitions | Default | Leads to a `DefinitionModel` (via `DefinitionPartition`) that contains elements carrying data shared among elements in other partitions |

The following instance diagram shows the Subject hierarchy used by OpenSite+ in its channel:

![Bentley OpenSite+ - Channel Layout](opensite-subject-hierarchy.png)

## BIS schemas

### Targeted Standard BIS schemas

#### Core:
* [Analytical](https://www.itwinjs.org/bis/domains/analytical.ecschema/)
* [BisCore](https://www.itwinjs.org/bis/domains/biscore.ecschema/)
* [Generic](https://www.itwinjs.org/bis/domains/generic.ecschema/)
* [PhysicalMaterial](https://www.itwinjs.org/bis/domains/physicalmaterial.ecschema/)

#### Common:
* [AecValueDefinitions](https://www.itwinjs.org/bis/domains/aecvaluedefinitions.ecschema/)
* [ClassificationSystems](https://www.itwinjs.org/bis/domains/classificationsystems.ecschema/)

#### Hydraulic Analysis:
* [NetworkTopology](https://www.itwinjs.org/bis/domains/networktopology.ecschema/)
* [PipeNetworkHydraulicAnalysis](https://www.itwinjs.org/bis/domains/pipenetworkhydraulicanalysis.ecschema/)
* [SewerHydraulicAnalysis](https://www.itwinjs.org/bis/domains/sewerhydraulicanalysis.ecschema/)

#### Linear Referencing:
* [LinearReferencing](https://www.itwinjs.org/bis/domains/linearreferencing.ecschema/)
* [RoadRailAlignment](https://www.itwinjs.org/bis/domains/roadrailalignment.ecschema/)

#### Physical-modeling
* [CivilPhysical](https://www.itwinjs.org/bis/domains/civilphysical.ecschema/)
* [DistributionSystems](https://www.itwinjs.org/bis/domains/distributionsystems.ecschema/)
* [Earthwork](https://www.itwinjs.org/bis/domains/earthwork.ecschema/)
* [PipeworkPhysical](https://www.itwinjs.org/bis/domains/pipeworkphysical.ecschema/)
* [StormSewerPhysical](https://www.itwinjs.org/bis/domains/stormsewerphysical.ecschema/)
* [StormSewerPhysicalViews](https://www.itwinjs.org/bis/domains/stormsewerphysicalviews.ecschema/)
* [Terrain](https://www.itwinjs.org/bis/domains/terrain.ecschema/)
* [WaterDistributionPhysical](https://www.itwinjs.org/bis/domains/waterdistributionphysical.ecschema/)

#### Spatial Composition
* [SpatialComposition](https://www.itwinjs.org/bis/domains/spatialcomposition.ecschema/)
* [BuildingSpatial](https://www.itwinjs.org/bis/domains/buildingspatial.ecschema/)
* [CivilSpatial](https://www.itwinjs.org/bis/domains/civilspatial.ecschema/)
* [RoadSpatial](https://www.itwinjs.org/bis/domains/roadspatial.ecschema/)

#### Kind of Quantities
* [CivilUnits](https://www.itwinjs.org/bis/domains/civilunits.ecschema/)

### Application Schemas

* [OpenSite](https://www.itwinjs.org/bis/domains/opensite.ecschema/)
* [OpenSiteDraft](https://www.itwinjs.org/bis/domains/opensitedraft.ecschema/)

## Definition Elements

