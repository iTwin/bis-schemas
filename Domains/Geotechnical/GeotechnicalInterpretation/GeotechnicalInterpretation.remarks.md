---
remarksTarget: GeotechnicalInterpretation.ecschema.md
---

# GeotechnicalInterpretation

**alias:** GeoInterp

The `GeotechnicalInterpretation` schema defines classes that represent data for interpreting the earth's subterranean structure based on (always limited) geotechnical exploration. The `GeotechnicalInterpretation` schema is an *analytical* schema as:

- It models one view of reality and not reality itself.
- There can be multiple interpretations of the same subsurface region.

In most workflows, the source data upon which to base an interpretation will be modeled using the `GeotechnicalExploration` schema, which is used to model exploratory data such as boreholes (and their logs).

In most workflows an interpretation will be published to the `GeotechnicalPhysical` schema. Data modeled in that schema is intended to represent the physical truth, to the best of the geotechnical experts' knowledge (other publishing use cases, such as "worst case scenario" may occur as well). Portions of the `GeotechnicalInterpretation` schema are mirrored in the `GeotechnicalPhysical` schema for simple and error-free publishing.

## Entity Classes

### GeotechnicalInterpretationPartition

A `GeotechnicalInterpretationPartition` is always parented to a `bis:Subject` and broken down by a `GeotechnicalInterpretationModel`. A `GeotechnicalInterpretationPartition` (and its `GeotechnicalInterpretationModel` submodel) are created for a `bis:Subject` when the need/desire for one or more (geotechnical) `Interpretation`s for the `Subject` is identified.

The structure of the Geotechnical Information hierarchy is:

- `bis:Subject`, has children
  - 0..1 `GeotechnicalInterpretationPartition`, each with a `GeotechnicalInterpretationModel` sub-model containing:
    - 0..N `Interpretation`s, each with a `GeotechnicalInterpretationModel` sub-model containing:
      - 0..N `InvestigationReference`s refering to exploration data.
      - (more to be added here)

### GeotechnicalInterpretationModel

All `bis:Model`s in the hierarchy under a `GeotechnicalInterpretationPartition` are `GeotechnicalInterpretationModel`s.

See [GeotechnicalInterpretationPartition](./GeotechnicalInterpretation.remarks.md#GeotechnicalInterpretationPartition) for an outline of the overall Geotechnical Interpretation information hierarchy.

### GeotechnicalInterpretationElement

`GeotechnicalInterpretationElement` exists primarily for clarity and facilitating checking that `bis:Element`s are contained in the appropriate `bis:Model`s.
`GeotechnicalInterpretationElement`s are always contained in a `GeotechnicalInterpretationModel`.

`GeotechnicalInterpretationElement`s are spatial in nature (they usually have real-world locations) while `GeotechnicalInformationElement`s are used for non-spatial information.
All (almost all?) `Element`s in `GeotechnicalInterpretationModel`s subclass from these two classes.

TBD: Should all `GeotechnicalInterpretationElement`s in the same `bis:Model` have the same `Origin`?

### GeotechnicalInformationElement

`GeotechnicalInformationElement` exists primarily for clarity and facilitating checking that `bis:Element`s are contained in the appropriate `bis:Model`s.
`GeotechnicalInformationElement`s are always contained in a `GeotechnicalInterpretationModel`.

`GeotechnicalInterpretationElement`s are spatial in nature (they usually have real-world locations) while `GeotechnicalInformationElement`s are used for non-spatial information.
All (almost all?) `Element`s in `GeotechnicalInterpretationModel`s subclass from these two classes.


### Interpretation

An `Interpretation` is broken down into a sub-model that contains the information relevant to the (single) `Interpretation`, such as references to exploration data, imported topography, assumptions about faults, adjusted fence diagrams, etc..

### IOperand

`IOperand`s are related to their `Operation`s through the `OperationHasInput` and/or `OperationHasOutput` s relationships. An `IOperand` may be used as the input for many `Operation`s, but can only be the output of a single `Operation`.

`IOperand`s that are the result of an `Operation` should never be directly modified by the user. These `IOperand`s should only be updated by re-running the `Operation`.

`IOperand`s and `Operation`s form a directed acyclic network.

TBD: organization of complex `Operation` output.

### Operation

`Operation`s form the nodes in the directed acyclic graph of `Operation`s/`IOperand`s. Every `Operation` has at least one `IOperand` input and at least one `IOperand` output.

The input `IOperand`s are defined through the `OperationHasInput` relationship. The output `IOperand`s are defined through the `OperationHasOutput` relationship.

### OperationParameters

`OperationParameter`s is an `Element` (and `IOperand`) separate from the `Operation` so the standard dependency logic of `IOperand`s and `Operation`s can be used to determine when an `Operation` is out of date relative to its parameters.

### InvestigationReference

An `InvestigationReference` may refer to an entire `GeotechnicalInvestigation`, a `GeotechnicalInvestigationBreakdown` or an individual `ExploratoryLocation`.

The `InvestigationReferenceRefersToInvestigation` relationship is used for the connection.

## Relationship Classes

### OperationHasInput

See [Operation](./GeotechnicalInterpretation.remarks.md#Operation) and [IOperand](./GeotechnicalInterpretation.remarks.md#IOperand).

### OperationHasOutput

See [Operation](./GeotechnicalInterpretation.remarks.md#Operation) and [IResultOperand](./GeotechnicalInterpretation.remarks.md#IOperand).
