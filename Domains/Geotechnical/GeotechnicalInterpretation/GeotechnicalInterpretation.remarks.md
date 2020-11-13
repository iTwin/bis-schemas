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
      - 0..N `BoreholeSource`s each with
        - 0..N `Borehole`s
      - 0..N `BoreholeGroup`s (referencing `Borehole`s)
      - 0..N `SubsurfaceGeneration`s
      - 0..N `Subsurface`s **Need to determine if this has a submodel or not**
        - 1..N `Boundary`s **Need to clarify if 0 is valid**
        - 1..N `Block`s **Need to clarify if 0 is valid**
          - 1..N `Stratum`s **Need to clarify if 0 is valid**
          - 0..N `WaterTable`s
  - 0..1 `DefinitionPartition`, each with a `DefinitionModel` sub-model containing:
    - 0..N `GeoInterpretationConfiguration`s, each with a `DefinitionModel` sub-model containing:
      - 0..1 `InvestigationMapping`
      - 0..N `Material`s

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

### IMaterial

`IMaterial` is a mix-in that is used in classes that can identify the material of a `MaterialDepthRange` of a `Borehole` or the material of a `Stratum`.

There are only expected to be two implementations of `IMaterial`:

- `Material`
- `AliasMaterial`

### Material

A `Material` for interpretation purposes may be different than the geotechnical materials/classifications that appear in boring logs. Multiple exploration classifications may correspond (and be mapped to) to a single `Material`.

See [InvestigationMapping](./GeotechnicalInterpretation.remarks.md#InvestigationMapping) for an explanation of the investigation relationships and `ILithology`s that are used in the mapping.

In the simplest case where the `Interpretation` is not coordinated with any `GeotechnicalInvestigation` (and there are no `InvestigationMapping`s), the `Material`s will not have any relationships to investigation `ILithology`s.

In the most common case where the `Interpretation` is coordinated with a single `GeotechnicalInvestigation` (and there is one `InvestigationMapping`), each `Material` may have zero or more relationships to investigation `ILithology`s (all part of the same `GeotechnicalInvestigationConfiguration`). All of the relationships will be with the the same subclass of `ILithology`.

In the most complex case where the `Interpretation` is coordinated with multiple `GeotechnicalInvestigation`s using different `GeotechnicalInvestigationConfiguration`s (and therefore there are multiple `InvestigationMapping`s), Each `Material` may have zero or more relationships to investigation `ILithology`s. Consistency of the `ILithology` subclass that is related to by `Material`s is only required per-`InvestigationMapping` (per-`GeotechnicalInvestigationConfiguration`).

It is desireable - but not required - that all `ILithology`s of the mapped class in a mapped `GeotechnicalInvestigationConfiguration` be mapped to a `Material`

### AliasMaterial

`AliasMaterial` exists solely for the purpose of splitting a single `Material` into one or more additional `IMaterial`s. The need for this splitting is due to limitations of either:

- Engines that consumes `Borehole`s and generate `Subsurface`s
- Analysis (or other) applications that assume the material in one `Stratum` never appears in another `Stratum`.

The `AliasFor` navigation property must always be set; the `AliasMaterial` must always refer to a real `Material`.

An example of the need for an Alias material is when a borehole log shows *Silty-Sand* from depth 7.2m to 9m and depth 13.4m to 15m. To remove the "duplicate" material, either:

- Two `AliasMaterial`s, *Silty-Sand 1* and *Silty-Sand 2* could be created (and the original *Silty-Sand* would only be used indirectly); or
- One `AliasMaterial`, *Silty-Sand 2* could be created (and the original *Silty-Sand* Material would be used both directly and indirectly).

### IBoreholeCollection

`IBoreholeCollection` exists to unify `BoreholeSource` (an exclusive collection of `Borehole`s) and `BoreholeGroup` (a non-exclusive collection of `Borehole`s).
It is not intended for other subclassing. Consumers of `IBoreholeCollection` will need special case logic to access the `Borehole`s in `BoreholeSource` and `BoreholeGroup`,
as each holds its constituent `Borehole`s using different relationships.

### BoreholeGroup

The use of `BoreholeGroup` is entirely optional.
`BoreholeGroup` provides value where a membership concept that is more flexible than that provided by `BoreholeSource` is required.

The `Borehole`s contained in a `BoreholeGroup` (through the `BoreholeGroupIncludesBorehole` relationship) must be contained in the same `GeotechnicalInterpretationModel`
as the `BoreholeGroup`.

### BoreholeSource

Every `Borehole` must have a parent `BoreholeSource`.

`BoreholeSource`s may optionally be related to a GeoExp:`GeotechnicalInvestigationElement` through the `DerivedFrom` navigation property. It is important to remember that the target `GeotechnicalInvestigationElement` may be an individual `ExploratoryLocation`, a `GeotechnicalInvestigationBreakdown`, or an entire `GeotechnicalInvestigation`.

### Borehole

Every `Borehole` must have a parent `BoreholeSource`.
Additionally, each `Borehole` may belong to zero or more `BoreholeGroup`s (through the `BoreholeGroupIncludesBorehole` relationship).

The Origin of a `Borehole` should be the top of the `Borehole`.
*NEED TO THINK ABOUT THIS....*

The `Location` property is a 3D curve with the start point being the top of the Borehole (ground surface). The `Location` property should always be set.

### MaterialDepthRange

The `Origin` of a `MaterialDepthRange` should be identical to that of its owning `Borehole`.

The `DepthTop`, `DepthBase` and `Material` of the `MaterialDepthRange` should always be set. The `Location` is effectively a cache that can be calculated from the other `MaterialDepthRange` properties and the properties in the parent `Borehole`. The *depth* values are actually "downhole distances".

### WaterTableDepth

The `Origin` of a `WaterTableDepth` should be identical to that of its owning `Borehole`.

The `Depth`, of the `WaterTableDepth` should always be set. The `Location` is effectively a cache that can be calculated from the other `Depth` and the properties in the parent `Borehole`.  The `Depth` property actually defines a "downhole distance".

### ISurface

`ISurface` is used to unify all of the various types that contain surfaces that can be used for downstream consumption (primarily in `Operation`s). Every `ISurface` is also an `IOperand`. 

*Should the Surface property **always** be defined?*

### IVolume

`IVolume` is used to unify all of the various types that contain volumwa that can be used for downstream consumption (primarily in `Operation`s). Every `IVolume` is also an `IOperand`. 

*Should the Volume property **always** be defined?*

### ITerrain

Currently the only `ITerrain` subclass is `TerrainSurface`. In the future it is likely others will be created, such as `TerrainPointCloud` and `TerrainContours`.

### TerrainSurface

`TerrainSurface` is used to unify all of the various types that contain surfaces that can be used for downstream consumption (primarily in `Operation`s). Every `ISurface` is also an `IOperand`. 

*Should the Surface property **always** be defined?*

### Subsurface

`Subsurface` is an `IOperand` that is the result of a subsurface generation operation. `Subsurface` is the head of an Element parent/child tree that looks like this:

- `Subsurface` **Need to determine if this has a submodel or not**
  - 1..N `Boundary`s **Need to clarify if 0 is valid**
  - 1..N `Block`s **Need to clarify if 0 is valid**
    - 1..N `Stratum`s **Need to clarify if 0 is valid**
    - 0..N `WaterTable`s

### Volume

`Volume` is an abstract concept that exists for future extensibility. Currently, every `Volume` is a `Stratum`, but in the future subclasses to represent tunnels, caves or other items may be added.

The `Volume` property contains a cache of the geometry that can be calculated from the `BoundaryBoundsVolume` relationships.  The mesh has a consistent positive normal direction (by the order of the vertices in each triangular face) that faces outward.

**We need to think about how we handle a `Volume` with one or more interior voids**

### Boundary

`Boundary` currently only bounds `Stratum`s (as `Stratum` is the only concrete `Volume` subclass).

Every `Boundary` must have 1 or 2 `BoundaryBoundsVolumes` relationships, as otherwise the `Boundary` would have no reason for existence (it would bound nothing). Those relationship can be of either of these classes:

- `BoundaryBoundsVolumeOnPositiveSide` (maximum of 1 relationship per `Boundary`)
- `BoundaryBoundsVolumeOnNegativeSide` (maximum of 1 relationship per `Boundary`)

A `Boundary` that has only one `BoundaryBoundsVolumes` relationship is either:

- Part or all of the bottom surface of the `Subsurface`, or
- Part or all of the top surface (ground level) of the `Subsurface`, or
- Part or all of a sidewall of the `Subsurface`.

**Is the above statement strictly true? Short-term is it possible for us to have voids?**

The `Surface` property contains a triangular mesh. The mesh has a consistent positive normal direction (by the order of the vertices in each triangular face). The terms "positive side and "negative side" in the relationships `BoundaryBoundsVolumeOnPositiveSide` and `BoundaryBoundsVolumeOnNegativeSide` refer to this normal.

### Block

`Block`s contain `Stratum`s and `WaterTable`s as child `Element`s. `Block`s do not have geometry of their own. The child `WaterTable`s should be fully contained in the child `Stratum`s.

**Do we need to temper the statement above for cases of surface water (lake,etc) or water in subterranean voids?**

Currently there is only a single `Block` in each `Subsurface`, but this will change with more powerful subsurface generation engines.

### Stratum

`Stratum` is currently the only concrete subclass of `Volume`.

### WaterTable

`WaterTable`s may be inconsistent in adjacent `Block`s as the `Block` border may act as a water conduit or barrier.

**Need to figure out how perched water is modeled. Is there a closed surface in WaterTable.Surface?**

**Need to figure out a strategy for naming/tagging seasonal water table variations....or maybe the date of the info to generate the water table?**

The positive normal of the `Surface` mesh represents the unsaturated soil side of the `Surface`.

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

### BoundaryBoundsVolumes

There are only 2 intended subclasses of `BoundaryBoundsVolumes`:

- `BoundaryBoundsVolumeOnPositiveSide`
- `BoundaryBoundsVolumeOnNegativeSide`
