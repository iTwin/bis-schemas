---
remarksTarget: GeotechnicalInterpretation.ecschema.md
---

# GeotechnicalInterpretation

**alias:** GeoInterp

The `GeotechnicalInterpretation` schema defines classes that represent data for interpreting the earth's subterranean structure based on (always limited) geotechnical exploration. The `GeotechnicalInterpretation` schema is an *analytical* schema as:

- It models one view of reality and not reality itself.
- There can be multiple interpretations of the same subsurface region.

In many workflows, the source data upon which to base an interpretation will be modeled using the `GeotechnicalExploration` schema, which is used to model exploratory data such as boreholes (and their logs).

In most workflows an interpretation will be published to the `GeotechnicalPhysical` schema. Data modeled in that schema is intended to represent the physical truth, to the best of the geotechnical experts' knowledge (other publishing use cases, such as "worst case scenario" may occur as well). Portions of the `GeotechnicalInterpretation` schema are mirrored in the `GeotechnicalPhysical` schema for simple and error-free publishing.

## Entity Classes

### GeotechnicalInterpretationPartition

A `GeotechnicalInterpretationPartition` is always parented to a `bis:Subject` and broken down by a `GeotechnicalInterpretationModel`. A `GeotechnicalInterpretationPartition` (and its `GeotechnicalInterpretationModel` submodel) are created for a `bis:Subject` when the need/desire for one or more (geotechnical) `Interpretation`s for the `Subject` is identified.

The overall structure of the Geotechnical Information hierarchy is:

- `bis:Subject`, has children
  - 0..1 `GeotechnicalInterpretationPartition`, each with a `GeotechnicalInterpretationModel` sub-model containing:
    - 0..N `Interpretation`s, each with a `GeotechnicalInterpretationModel` sub-model containing:
      - 0..N `BoreholeSet`s each with
        - 0..N `Borehole`s
      - 0..N `SubsurfaceGeneration`s
      - 0..N `Subsurface`s

### GeotechnicalInterpretationModel

All `bis:Model`s in the hierarchy under a `GeotechnicalInterpretationPartition` are `GeotechnicalInterpretationModel`s.

See [GeotechnicalInterpretationPartition](./GeotechnicalInterpretation.remarks.md#GeotechnicalInterpretationPartition) for an outline of the overall Geotechnical Interpretation information hierarchy.

### GeotechnicalInterpretationElement

`GeotechnicalInterpretationElement` exists primarily for clarity and facilitating checking that `bis:Element`s are contained in the appropriate `bis:Model`s.
`GeotechnicalInterpretationElement`s are always contained in a `GeotechnicalInterpretationModel`.

`GeotechnicalInterpretationElement`s are spatial in nature (they usually have real-world locations) while `GeotechnicalInformationElement`s are used for non-spatial information.
Almost all `Element`s in `GeotechnicalInterpretationModel`s subclass from these two classes.

**TBD: Should all `GeotechnicalInterpretationElement`s in the same `bis:Model` have the same `Origin`? Probably not...but need to decide.**

### GeotechnicalInformationElement

`GeotechnicalInformationElement` exists primarily for clarity and facilitating checking that `bis:Element`s are contained in the appropriate `bis:Model`s.
`GeotechnicalInformationElement`s are always contained in a `GeotechnicalInterpretationModel`.

`GeotechnicalInterpretationElement`s are spatial in nature (they usually have real-world locations) while `GeotechnicalInformationElement`s are used for non-spatial information.
Almost all `Element`s in `GeotechnicalInterpretationModel`s subclass from these two classes.

### Interpretation

An `Interpretation` is broken down into a sub-model that contains the information relevant to the (single) `Interpretation`, such as borehole data, imported topography, assumptions about faults, adjusted fence diagrams, etc..

There will often be only a single `Interpretation` in the top `GeotechnicalInterpretationModel`.

### GeotechnicalInterpretationConfiguration

Most commonly, a `GeotechnicalInterpretationConfiguration` will provide configuration information for a single  `Interpretation`, but it may be used by multiple `Interpretation`s.

Similarly, most commonly the `GeotechnicalInterpretationConfiguration` will reside in the top `DefinitionModel` under the same `Subject` as the `Interpretation` it is the configuration for. However, there is no restriction to which `Subject` a `GeotechnicalInterpretationConfiguration` falls under.

`GeotechnicalInterpretationConfiguration` is broken down into a sub-model that contains the `DefinitionElements` relevant to the configuration, such as `Material`s and `InvestigationMapping`s.

### InvestigationMapping

A `GeotechnicalInterpretationConfiguration` requires an `InvestigationMapping`  for every `GeotechnicalInvestigation` that is coordinated with an `Interpretation` that uses the configuration. Note that it is *not* required for an `Interpretation` to be coordinated with any `GeotechnicalInvestigation`s

The `MaterialMappedClass` property defines which `ILithology` subclass (and relationship of `FieldGeologicDescription`) is considered relevant for mapping to the `Material`s. The valid values for this property are:

| Value                  | Meaning                                                                                  |
|------------------------|------------------------------------------------------------------------------------------|
| "LegendCode"           | Map `LegendCode` to `Material` (use `FieldGeologicDescription.LegendCode`)               |
| "GeologyCode"          | Map `GeologyCode` to `Material` (use `FieldGeologicDescription.GeologyCode`)             |
| "AlternateGeologyCode" | Map `AlternateGeologyCode` to `Material` (use `FieldGeologicDescription.AltGeologyCode`) |

### Material

A `Material` for interpretation purposes may be different than the geotechnical materials/classifications that appear in boring logs. Multiple exploration classifications may correspond (and be mapped to) to a single `Material`.

See [InvestigationMapping](./GeotechnicalInterpretation.remarks.md#InvestigationMapping) for an explanation of the investigation relationships and `ILithology`s that are used in the mapping.

In the simplest case where the `Interpretation` is not coordinated with any `GeotechnicalInvestigation` (and there are no `InvestigationMapping`s), the `Material`s will not have any relationships to investigation `ILithology`s.

In the most common case where the `Interpretation` is coordinated with a single `GeotechnicalInvestigation` (and there is one `InvestigationMapping`), each `Material` may have zero or more relationships to investigation `ILithology`s (all part of the same `GeotechnicalInvestigationConfiguration`). All of the relationships will be with the the same subclass of `ILithology`.

In the most complex case where the `Interpretation` is coordinated with multiple `GeotechnicalInvestigation`s using different `GeotechnicalInvestigationConfiguration`s (and therefore there are multiple `InvestigationMapping`s), Each `Material` may have zero or more relationships to investigation `ILithology`s. Consistency of the `ILithology` subclass that is related to by `Material`s is only required per-`InvestigationMapping` (per-`GeotechnicalInvestigationConfiguration`).

It is desireable - but not required - that all `ILithology`s of the mapped class in a mapped `GeotechnicalInvestigationConfiguration` be mapped to a `Material`

### BoreholeSet

Every `Borehole` must have a parent `BoreholeSet`.

`BoreholeSet`s may optionally be related to a GeoExp:`GeotechnicalInvestigationElement` through the `Represents` navigation property. It is important to remember that the target `GeotechnicalInvestigationElement` may be an individual `ExploratoryLocation`, a `GeotechnicalInvestigationBreakdown`, or an entire `GeotechnicalInvestigation`.

### Borehole

Every `Borehole` must have a parent `BoreholeSet`.

The Origin of a `Borehole` should be the top of the `Borehole`.
*NEED TO THINK ABOUT THIS....*

The `Location` property is a 3D curve with the start point being the top of the Borehole (ground surface). The `Location` property should always be set.

### MaterialDepthRange

The `Origin` of a `MaterialDepthRange` should be identical to that of its owning `Borehole`.

The `DepthTop`, `DepthBase` and `Material` of the `MaterialDepthRange` should always be set. The `Location` is effectively a cache that can be calculated from the other `MaterialDepthRange` properties and the properties in the parent `Borehole`. The *depth* values are actually "downhole distances".

### WaterTableDepth

The `Origin` of a `WaterTableDepth` should be identical to that of its owning `Borehole`.

The `Depth`, of the `WaterTableDepth` should always be set. The `Location` is effectively a cache that can be calculated from the other `Depth` and the properties in the parent `Borehole`.  The `Depth` property actually defines a "downhole distance".

### Subsurface

`Subsurface` xxxxxxxxxxx

### SubsurfaceGeneration

`SubsurfaceSubsurfaceGeneration` xxxxxxxxxxx

### IOperand

`IOperand`s are related to their `Operation`s through the `OperationHasInput` and/or `OperationHasOutput` relationships. An `IOperand` may be used as the input for many `Operation`s, but can only be the output of a single `Operation`.

`IOperand`s that are the result of an `Operation` should never be directly modified by the user. These `IOperand`s should only be updated by re-running the `Operation`.

`IOperand`s and `Operation`s form a directed acyclic network.

TBD: organization of complex `Operation` output.

### Operation

`Operation`s form the nodes in the directed acyclic graph of `Operation`s/`IOperand`s. Every `Operation` has at least one `IOperand` input and at least one `IOperand` output.

The input `IOperand`s are defined through the `OperationHasInput` relationship. The output `IOperand`s are defined through the `OperationHasOutput` relationship.

### OperationParameters

`OperationParameter`s is an `Element` (and `IOperand`) separate from the `Operation` so the standard dependency logic of `IOperand`s and `Operation`s can be used to determine when an `Operation` is out of date relative to its parameters.

## Relationship Classes

### OperationHasInput

See [Operation](./GeotechnicalInterpretation.remarks.md#Operation) and [IOperand](./GeotechnicalInterpretation.remarks.md#IOperand).

### OperationHasOutput

See [Operation](./GeotechnicalInterpretation.remarks.md#Operation) and [IResultOperand](./GeotechnicalInterpretation.remarks.md#IOperand).
