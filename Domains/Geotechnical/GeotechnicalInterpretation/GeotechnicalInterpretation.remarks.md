---
remarksTarget: GeotechnicalInterpretation.ecschema.md
---

# GeotechnicalInterpretation

**alias:** GeoInterp

The `GeotechnicalInterpretation` schema defines classes that represent data for interpreting the earth's subterranean structure based on (always limited) geotechnical exploration. The `GeotechnicalInterpretation` schema is an *analytical* schema as:

- It models one view of reality and not reality itself.
- There can be multiple interpretations of the same subterranean region.

In many workflows, the source data upon which to base an interpretation will be modeled using the `GeotechnicalExploration` schema, which is used to model exploratory data such as boreholes (and their logs).

In most workflows an interpretation will be published to the `GeotechnicalPhysical` schema. Data modeled in that schema is intended to represent the physical truth, to the best of the geotechnical experts' knowledge (other publishing use cases, such as "worst case scenario" may occur as well). Portions of the `GeotechnicalInterpretation` schema are mirrored in the `GeotechnicalPhysical` schema for simple and error-free publishing.

## Entity Classes

### GeotechnicalInterpretationPartition

A `GeotechnicalInterpretationPartition` is always parented to a `bis:Subject` and broken down by a `GeotechnicalInterpretationModel`. A `GeotechnicalInterpretationPartition` (and its `GeotechnicalInterpretationModel` sub-model) are created for a `bis:Subject` when the need/desire for one or more (geotechnical) `Interpretation`s for the `Subject` is identified.

The overall structure of the Geotechnical Information hierarchy is:

- `bis:Subject`, has children
  - 0..1 `GeotechnicalInterpretationPartition`, each with a `GeotechnicalInterpretationModel` sub-model containing:
    - 0..N `Interpretation`s, each with a `GeotechnicalInterpretationModel` sub-model containing:
      - 1..1 `GeologicalHistory` 
        - 0..N `GeologicalHistoryStep` (currently always `AdditiveGeologicalHistoryStep`)
      - 0..N `BoreholeSource`s each with
        - 0..N `Borehole`s
      - 0..N `BoreholeGroup`s (referencing `Borehole`s)
      - 0..N `FencePost`
      - 0..N `GroundGeneration`s (exactly 1 for GeoModeler V1)
        - 1..N `GroundGenerationParameters` (exactly 1 for GeoModeler V1)
        - 0..N `FenceDiagram`
          - 0..N `FencePanel`
          - 0..N `FenceBoundary`
          - 0..N `FenceStratum`
      - 0..N `Region`s 
      - 0..N `Ground`s (exactly 1 for V1), each with a `GeotechnicalInterpretationModel` sub-model containing:
        - 1..N `Boundary`s **Need to clarify if 0 is valid**
        - 1..N `Block`s **Need to clarify if 0 is valid**
          - 1..N `Stratum`s **Need to clarify if 0 is valid**
          - 0..N `WaterTable`s
  - 0..1 `DefinitionPartition`, each with a `DefinitionModel` sub-model containing:
    - 0..N `GeoInterpretationConfiguration`s, each with a `DefinitionModel` sub-model containing:
      - 0..1 `InvestigationMapping`
      - 0..N `Material`s
      - 0..N `AliasMaterial`s
      - 1..1 `UnknownMaterial`

### GeotechnicalInterpretationModel

All `bis:Model`s in the hierarchy under a `GeotechnicalInterpretationPartition` are `GeotechnicalInterpretationModel`s.

See [GeotechnicalInterpretationPartition](./GeotechnicalInterpretation.remarks.md#GeotechnicalInterpretationPartition) for an outline of the overall Geotechnical Interpretation information hierarchy.

### GeotechnicalInterpretationElement

`GeotechnicalInterpretationElement` exists primarily for clarity and facilitating checking that `bis:Element`s are contained in the appropriate `bis:Model`s.
`GeotechnicalInterpretationElement`s are always contained in a `GeotechnicalInterpretationModel`.

`GeotechnicalInterpretationElement`s are spatial in nature (they usually have real-world locations) while `GeotechnicalInformationElement`s are used for non-spatial information.
Almost all `Element`s in `GeotechnicalInterpretationModel`s subclass from these two classes.

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
Every `IMaterial` has a `RenderMaterial` child element that controls the appearance of items (such as `Stratum`s and `MaterialDepthRange`s) that use the `IMaterial`.

There are only expected to be three implementations of `IMaterial`:

- `Material`
- `AliasMaterial`
- `UnknownMaterial`

### Material

A `Material` for interpretation purposes may be different than the geotechnical materials/classifications that appear in boring logs. Multiple exploration classifications may correspond (and be mapped to) to a single `Material`.

See [InvestigationMapping](./GeotechnicalInterpretation.remarks.md#InvestigationMapping) for an explanation of the investigation relationships and `ILithology`s that are used in the mapping.

In the simplest case where the `Interpretation` is not coordinated with any `GeotechnicalInvestigation` (and there are no `InvestigationMapping`s), the `Material`s will not have any relationships to investigation `ILithology`s.

In the most common case where the `Interpretation` is coordinated with a single `GeotechnicalInvestigation` (and there is one `InvestigationMapping`), each `Material` may have zero or more relationships to investigation `ILithology`s (all part of the same `GeotechnicalInvestigationConfiguration`). All of the relationships will be with the the same subclass of `ILithology`.

In the most complex case where the `Interpretation` is coordinated with multiple `GeotechnicalInvestigation`s using different `GeotechnicalInvestigationConfiguration`s (and therefore there are multiple `InvestigationMapping`s), Each `Material` may have zero or more relationships to investigation `ILithology`s. Consistency of the `ILithology` subclass that is related to by `Material`s is only required per-`InvestigationMapping` (per-`GeotechnicalInvestigationConfiguration`).

It is desireable - but not required - that all `ILithology`s of the mapped class in a mapped `GeotechnicalInvestigationConfiguration` be mapped to a `Material`

### AliasMaterial

`AliasMaterial` exists solely for the purpose of splitting a single `Material` into one or more additional `IMaterial`s. The need for this splitting is due to limitations of either:

- Engines that consumes `Borehole`s and generate `Ground`s
- Analysis (or other) applications that assume the material in one `Stratum` never appears in another `Stratum`.

The `AliasFor` navigation property must always be set; the `AliasMaterial` must always refer to a real `Material`.

An example of the need for an Alias material is when a borehole log shows *Silty-Sand* from depth 7.2m to 9m and depth 13.4m to 15m. To remove the "duplicate" material, either:

- Two `AliasMaterial`s, *Silty-Sand 1* and *Silty-Sand 2* could be created (and the original *Silty-Sand* would only be used indirectly); or
- One `AliasMaterial`, *Silty-Sand 2* could be created (and the original *Silty-Sand* Material would be used both directly and indirectly).

### UnknownMaterial

`UnknownMaterial` exists to fill the role of an `IMaterial` when the material is not known.
For example, if `MaterialDepthRange`s are inserted in gaps of `Borehole` data, there will need to be a material associated with each new `MaterialDepthRange`.
There is always a single `UnknownMaterial` in any `GeoInterpretationConfiguration` sub-model.

### IGeologicalHistoryProvider

`IGeologicalHistoryProvider` exists for future extensibility. Currently the only `IGeologicalHistoryProvider` is `GeologicalHistory`.

### GeologicalHistory

`GeologicalHistory` is a singleton class (there is one instance per `Interpretation`) that heads a tree of `GeologicalHistoryStep`s 
that describe the geological history of the region being interpreted.

### GeologicalHistoryStep

`GeologicalHistoryStep` represents processes like deposits, erosion, intrusions, etc.. `GeologicalHistoryStep`s always have a `GeologicalHistory` parent.

### AdditiveGeologicalHistoryStep

The (required) related `Material` is defined through the `AdditiveGeologicalHistoryStepAddsMaterial` relationship.

The additive process might technically be one that displaces other `Material` (such as an intrusion).
In the future, a property will likely be added to specify the specific geological process at work.

### IBoreholeProvider

`IBoreholeProvider` exists to unify `BoreholeSource` (an exclusive collection of `Borehole`s), `BoreholeGroup` (a non-exclusive collection of `Borehole`s) and any future class that is able to produce a set of `Borehole`s (e.g. perhaps in the future there will be a `BoreholeFilter` concept) for downstream processing.

The TypeScript wrapper for each `IBoreholeProvider` subclass is expected to have a XXXX() method.

### BoreholeGroup

The use of `BoreholeGroup` in modeling is entirely optional.
`BoreholeGroup` provides value where a membership concept that is more flexible than that provided by `BoreholeSource` is required.

The `Borehole`s contained in a `BoreholeGroup` (through the `BoreholeInBoreholeGroup` relationship) must be contained in the same `GeotechnicalInterpretationModel` as the `BoreholeGroup`.

### BoreholeSource

Every `Borehole` must have a parent `BoreholeSource`.

`BoreholeSource`s may optionally be related to a GeoExp:`GeotechnicalInvestigationElement` through the `DerivedFrom` navigation property. It is important to remember that the target `GeotechnicalInvestigationElement` may be an individual `ExploratoryLocation`, a `GeotechnicalInvestigationBreakdown`, or an entire `GeotechnicalInvestigation`.

### Borehole

Every `Borehole` must have a parent `BoreholeSource`.
Additionally, each `Borehole` may belong to zero or more `BoreholeGroup`s (through the `BoreholeInBoreholeGroup` relationship).

The `Origin` of a `Borehole` should be the top of the `Borehole`. XXXX VERIFY XXXX

The `Location` property is a 3D curve with the start point being the top of the Borehole (ground surface). The `Location` property is in global coordinates.

### MaterialDepthRange

The `Origin` of a `MaterialDepthRange` should be identical to that of its owning `Borehole`. XXXXXXXX VERIFY XXXXXXX

The `DepthTop`, `DepthBase`, `Material` and `Location` of the `MaterialDepthRange` should always be set. The `Location` is effectively a cache that can be calculated from the other `MaterialDepthRange` properties and the properties in the parent `Borehole`. The *depth* values are actually "downhole distances".

The `Location` property is a 3D curve with the start point corresponding to the `DepthTop`. The `Location` property is in global coordinates.

### WaterTableDepth

The `Origin` of a `WaterTableDepth` should be identical to that of its owning `Borehole`.  XXXXXXXX VERIFY XXXXXXX

The `Depth` and `Location` of the `WaterTableDepth` should always be set. The `Location` is effectively a cache that can be calculated from the other `Depth` and the properties in the parent `Borehole`.  The `Depth` property actually defines a "downhole distance".

The `Location` property is in global coordinates.

### IRegionProvider

An `IOperand` that can provide a 2D plan view polygon region.

### Region

A user-defined `IRegionProvider`.

The `Shape` property is a 2D polygon in global coordinates.

### Section

XXXXXXX Need clear definition and usage XXXXX

The `Line` property is a 2D line segment in global coordinates.

### Plaxis2dLink

XXXXXXX Need clear definition and usage XXXXX

### Plaxis3dLink

XXXXXXX Need clear definition and usage XXXXX

The associated `Region` must have a rectangular shape, but the rectangle may have any orientation about the z-axis.

### ISurfaceProvider

`ISurfaceProvider` is used to unify all of the various types that can provide surfaces that can be used for downstream consumption (primarily in `Operation`s). Every `ISurfaceProvider` is also an `IOperand`. 

The TypeScript wrapper for each `ISurfaceProvider` subclass is expected to have a XXXX() method.

### GenericSurface

`GenericSurface` is an `ISurfaceProvider` and hence can be used as input to downstream operations that require that type.

The `Surface` property is always defined, and is in global coordinates.

### IFenceDiagramProvider

`IFenceDiagramProvider` is an abstract concept that exists for future extensibility. Currently, every `IFenceDiagramProvider` is a `FenceDiagram`.

`IFenceDiagramProvider` is always a child of `GroundGeneration`.

The TypeScript wrapper for each `IFenceDiagramProvider` subclass is expected to have a XXXX() method.

### FenceDiagram

`FenceDiagram` is always a child of `GroundGeneration`. The `GroundGenerationOwnsFenceDiagram` relationship is used. A `FenceDiagram` has a two-way relationship with its owning `GroundGeneration`:

1. It is (`IOperand`) input for the `GroundGeneration`. The user-adjusted `FenceBoundary`s are considered as the input.

2. It displays the sliced output of the `GroundGeneration` (the `Ground` or technically `IGroundProvider`) for `FenceStratum`s and `FenceBoundary`s that are not user-adjusted. When the `GroundGeneration` is rerun, the related `FenceDiagram`s must be updated.

`Borehole`s can be associated to the `FenceDiagram` with the `BoreholeGuidesFenceDiagram` relationship.
These "guiding" boreholes are used as context for the geotechnical engineer working with the `FenceDiagram`s.
When the `Width` property changes the `BoreholeGuidesFenceDiagram` relationships must be updated to reflect the new `Width`.

`FenceDiagram`s define a 2-D coordinate system in which their `FenceBoundary` and `FenceStratum` data is defined.
The x-axis follows the `FencePanel`s and starts at x=0 at the first `FencePost` of the first `FencePanel` and continues along the `FencePanel`s.
The y-axis is the elevation (equivalent to global-z).

XXX Need to decide what is in the `GeometryStream` (if anything) for `FenceDiagram`s XXXX

For V1, `FenceDiagram`s are constrained to layer-cake representations (conceptual layers can have zero thickness in areas).

See [GeotechnicalInterpretationPartition](./GeotechnicalInterpretation.remarks.md#GeotechnicalInterpretationPartition) for an outline of the overall Geotechnical Interpretation information hierarchy, including the `Fence*` classes.

### FencePanel

`FencePanel` is vertical planar rectangle upon which `FenceStratum`s and `FenceBoundary`s are displayed.

The (2D) start point for the `FencePanel` is defined through the `FencePanelHasStartFencePost` relationship and its target `FencePost`.
The (2D) end point for the `FencePanel` is defined through the `FencePanelHasStartFencePost` relationship and its target `FencePost`.

The order of `FencePanel`s within a `FenceDiagram` is defined by the `Index` property.
The end `FencePost` for `FencePanel` *N* is identical to the start `FencePost` for `FencePanel` *N+1*.

XXX Need to determine the code/mechanism for updating `FencePanel` (and `FenceDiagram`) base on moved `FencePost`. XXX

XXX Need to decide what is in the `GeometryStream` (if anything) for `FencePanel`s XXXX

See [GeotechnicalInterpretationPartition](./GeotechnicalInterpretation.remarks.md#GeotechnicalInterpretationPartition) for an outline of the overall Geotechnical Interpretation information hierarchy, including the `Fence*` classes.

### FencePost

`FencePost`s define the start and end points of `FencePanel`s. Wherever two `FencePanel`s intersect, a `FencePost` is inserted
(splitting the `FencePanel`s in two). `FencePost`s are NOT a user-facing concept and are generally hidden from users.
There can never be 2 `FencePost`s at the same location

`FencePost`s are NOT owned by `FencePanel`s nor by `FenceDiagram`s; they are top-level `Element`s. However, `FencePost`s that are not
used by any `FencePanel` should be deleted.

A `FencePost` can be located at a `Borehole` via the `BoreholeLocatesFencePost` relationship.
That relationship defines that the `FencePost` is located at x-y coordinates of the top of the `Borehole`.
If the `Borehole` moves the `FencePost` moves with it.

XXX Need to determine the code/mechanism for updating `FencePost` based on a moved `Borehole`. XXX

XXX Need to decide what is in the `GeometryStream` (if anything) for `FencePost`s XXXX

See [GeotechnicalInterpretationPartition](./GeotechnicalInterpretation.remarks.md#GeotechnicalInterpretationPartition) for an outline of the overall Geotechnical Interpretation information hierarchy, including the `Fence*` classes.

### FenceVolume

`FenceVolume` is an abstract concept that exists for future extensibility. Currently, every `FenceVolume` is a `FenceStratum`, but in the future subclasses to represent tunnels, caves or other items that may be added.

`FenceVolume` corresponds to `GroundVolume` in the cut `Ground` (hence the name "FenceVolume" instead of "FenceRegion" or something like that).

Every `FenceVolume` will have at least 2 `FenceBoundary`s.
Vertical "closure" `FenceBoundary`s are NOT provided at the end of the `FenceDiagram`.

The `Shape` property is effectively a cache of what is defined by the related `FenceBoundary`s

### FenceStratum

`FenceStratum` is currently the only concrete subclass of `FenceVolume`.

`FenceStratum` corresponds to `Stratum` in the cut `Ground`.

The `GeometryStream` of `FenceStratum` contains the `Shape` converted from `FenceDiagram` coordinates to global coordinates, using the appropriate `IMaterial` symbology.

See [GeotechnicalInterpretationPartition](./GeotechnicalInterpretation.remarks.md#GeotechnicalInterpretationPartition) for an outline of the overall Geotechnical Interpretation information hierarchy, including the `Fence*` classes.

### FenceBoundary

`FenceBoundary`s either represent the boundary between two generated `Stratum`s, or the user's desire for the boundary between two generated `Stratum`s; 
the `UserSpecified` property demarks these two cases.
When a `FenceDiagram` is updated after a `Ground` generation, the `UserSpecified` property of `FenceBoundary`s must be preserved.

`FenceBoundary` corresponds to `Boundary` in the cut `Ground`. `FenceBoundary`s follow these strict rules:

1. The x-coordinates of `FenceBoundary`.`Location` is limited to the `FenceDiagram` range.

2. `FenceBoundary`.`Location` can only touch the `FenceDiagram` start `FencePost` and end `FencePost` at its (the `FenceBoundary`'s) ends.

3. A `FenceBoundary` cannot cross another `FenceBoundary`.

4. A `FenceBoundary` may intersect another `FenceBoundary` only at a common end point.
This rule will cause a `FenceBoundary` to be split in two if another `FenceBoundary` attempts to intersect away from an end point.

5. A `FenceBoundary` must start and end either at a intersection with another `FenceBoundary` or at the first or last `FencePost` in the `FenceDiagram`.

6. `FenceBoundary`s must have consistent left/right `FenceVolume`s where they intersect.

For V1, these further constraints apply:

1. `FenceBoundary`.`Location` must have increasing x-coordinates (no vertical or "backward" segments).
This makes "left" correspond to "up" and "right" correspond to "down".

2. `FenceBoundary`.`Location` cannot be a closed curve (no lenses) (this would violate rule 1 also).

The `GeometryStream` of `FenceBoundary` contains the `Location` converted from `FenceDiagram` coordinates to global coordinates.
The symbology of the `FenceBoundary` depends upon the value of the `UserSpecified` property.

See [GeotechnicalInterpretationPartition](./GeotechnicalInterpretation.remarks.md#GeotechnicalInterpretationPartition) for an outline of the overall Geotechnical Interpretation information hierarchy, including the `Fence*` classes.

### IGroundProvider

`IGroundProvider` is used to unify all of the various types that can provide `Ground` that can be used for downstream consumption (primarily in `Operation`s).
Every `IGroundProvider` is also an `IOperand`. 

The TypeScript wrapper for each `IGroundProvider` subclass is expected to have a XXXX() method.

Currently the only `IGroundProvider` subclass is `Ground`. 

### Ground

`Ground` is an `IGroundProvider` that is most commonly the result of a ground generation operation. Every `Ground` is sub-modeled by a `GeotechnicalInterpretationModel` that only contains `Ground` related Elements. Element hierarchy for `Ground` looks like this:

- `Ground`
  - 1..N `Boundary`s **Need to clarify if 0 is valid**
  - 1..N `Block`s **Need to clarify if 0 is valid**
    - 1..N `Stratum`s **Need to clarify if 0 is valid**
    - 0..N `WaterTable`s
    - 0..1 `LayerOrder`

### GroundVolume

`GroundVolume` is an abstract concept that exists for future extensibility. Currently, every `GroundVolume` is a `Stratum`, but in the future subclasses to represent tunnels, caves or other items may be added.

The `Volume` property contains a cache of the geometry that can be calculated from the `BoundaryBoundsVolumes` relationships.  The mesh has a consistent positive normal direction (by the order of the vertices in each triangular face) that faces outward. The `Volume` may have interior void.

### Boundary

`Boundary` currently only bounds `Stratum`s (as `Stratum` is the only concrete `Volume` subclass).

Every `Boundary` must have 1 or 2 `BoundaryBoundsVolumes` relationships, as otherwise the `Boundary` would have no reason for existence (it would bound nothing). Those relationship can be of either of these classes:

- `BoundaryBoundsVolumeOnPositiveSide` (maximum of 1 relationship per `Boundary`)
- `BoundaryBoundsVolumeOnNegativeSide` (maximum of 1 relationship per `Boundary`)

A `Boundary` that has only one `BoundaryBoundsVolumes` relationship is either:

- Part or all of the bottom surface of the `Ground`, or
- Part or all of the top surface (ground level) of the `Ground`, or
- Part or all of a sidewall of the `Ground`.

The `Surface` property contains a triangular mesh. The mesh has a consistent positive normal direction (by the order of the vertices in each triangular face). The terms "positive side" and "negative side" in the relationships `BoundaryBoundsVolumeOnPositiveSide` and `BoundaryBoundsVolumeOnNegativeSide` refer to this normal.

### Block

`Block`s contain `Stratum`s and `WaterTable`s as child `Element`s. `Block`s do not have geometry of their own. The child `WaterTable`s should be fully contained in the child `Stratum`s.

**Do we need to temper the statement above for cases of surface water (lake, etc.) or water in subterranean voids?**

Currently there is only a single `Block` in each `Ground`, but this will change with more powerful ground generation engines.

### Stratum

`Stratum` is currently the only concrete subclass of `GroundVolume`.

### WaterTable

`WaterTable`s may be inconsistent in adjacent `Block`s as the `Block` border may act as a water conduit or barrier.

### LayerOrder

`LayerOrder` represents the top-down order of `IMaterials` (through its `LayerOrderOrdersMaterials` relationship) in the `Stratums` in a `Block`.
A `Block` may or may not have a `LayerOrder` child, as a "layer cake" analogy for the `Stratum`s may not be possible.

The following layer constraints must be met:

- No `IMaterial` appears more than once in the layer ordering.
- At any vertical line in the `Block` the `IMaterial`s of the intersected `Stratum`s must appear in the same order as in the layer ordering.
  - However, there may be fewer `Stratum`s than ordered `IMaterial`s, so any ordered `IMaterial` may be "missing" at the vertical line. A missing `IMaterial` can be thought of as an infinitely thin `Stratum`.

**Meaning and naming of WaterTable is still under discussion.**

The positive normal of the `Surface` mesh represents the unsaturated soil side of the `Surface` (is usually upward).

### GroundGeneration

TODO: describe GroundGeneration input.

`GroundGeneration` output is defined as `IGroundProvider`. In the no error case, the actual output will be `Ground`.

`GroundGeneration` always has at least 1 `GroundGenerationParameters` child.

### GroundGenerationParameters

`GroundGenerationParameters` is always a child of `GroundGeneration`. Each `GroundGeneration` may own multiple `GroundGenerationParameters` (of different subclasses)
as there may be multiple engines available for use.

### IOperand

`IOperand`s are related to their `Operation`s through the `InputDrivesOperation` and/or `OperationHasOutput` relationships. An `IOperand` may be used as the input for many `Operation`s, but can only be the output of a single `Operation`.

`IOperand`s that are the (direct or indirect) result of an `Operation` should never be directly modified by the user. These `IOperand`s should only be updated by re-running the `Operation`.

`IOperand`s and `Operation`s form a directed acyclic network.

#### IOperand Subclassing

The general pattern of `IOperand` subclassing is:

- Create an `IXxxProvider` whenever `Xxx` is needed for input (e.g. `ISurfaceProvider`)
- Use *applies-to* `Element` to give implementation flexibility.
- The TypeScript wrappers for `IXxxProvider` will have a `getXxx()` method. (e.g. `getSurface()`) **Karolis - please comment**
- Add `IxxxProvider` to the base classes for `UniversalOperand`
- If there is a specific `Xxx`-related property (or properties) that multiple `IXxxProvider` subclasses will contain, it *may* be useful to create a specialized descendent mixin class, such as `IXxx`. (e.g. `ISurface`).
- Create concrete classes that (directly or indirectly) incorporate `IXxxProvider`.

#### Complex IOperand Outputs

`Operation`s always create a *single* ouput `IOperand` that is part of the Operation/Operand network. Sometimes the output `IOperand` is too complex to capture in a single `Element`. In those cases, the output `IOperand` is the head `Element` of the complex output.

#### Editability of IOperands

`IOperand`s that are the output of an operation (directly or indirectly) can only be edited by rerunning the operation that created them.

### Operation

`Operation`s form the nodes in the directed acyclic graph of `Operation`s/`IOperand`s. Every `Operation` has at least one `IOperand` input and at least one `IOperand` output.

The input `IOperand`s are defined through the `InputDrivesOperation` relationship. The output `IOperand`s are defined through the `OperationHasOutput` relationship.

### OperationParameters

`OperationParameter`s is an `Element` (and `IOperand`) separate from the `Operation` so the standard dependency logic of `IOperand`s and `Operation`s can be used to determine when an `Operation` is out of date relative to its parameters.

### UniversalOperand

`UniversalOperand`s is convenient place to gather (union) all of the `IOperand` subclasses that can be the result of an `Operation`.
Currently, there are only two expected subclasses of `UniversalOperand`: `EmptyOperand` and `ErrorOperand`

### EmptyOperand

`EmptyOperand` roughly corresponds to the *null* an `Operation` might return if its result (due to the particular inputs) was "nothing".
It is necessary for an `Operation` to return *something* in that condition to keep the network of `Operations` and `IOperands` intact.

You can think of `EmptyOperand` corresponding to an empty cell in a spreadsheet.

### ErrorOperand

`ErrorOperand` roughly corresponds to an exception or error code an `Operation` might throw/return if its inputs were invalid.
It is necessary for an `Operation` to return *something* in that condition to keep the network of `Operations` and `IOperands` intact.

You can think of `ErrorOperand` corresponding to an error cell (e.g. *#NAME?* or *#REF!* )in a spreadsheet.

## Relationship Classes

### BoreholeInBoreholeGroup

This relationship is followed during Element-Drives-Element dependency tracing to notify the `BoreholeGroup` of changes to the `Borehole`.

### BoreholeSourceOwnsBoreholes

This relationship is followed during Element-Drives-Element dependency tracing to notify the `BoreholeSource` of changes to the `Borehole`.

### MaterialDefinesMaterialDepthRange

This relationship is followed during Element-Drives-Element dependency tracing to notify the `MaterialDepthRange` of changes to the `IMaterial`.

### BoreholeOwnsMaterialDepthRanges

This relationship is followed during Element-Drives-Element dependency tracing to notify the `Borehole` of changes to the `MaterialDepthRange`.

### BoreholeOwnsWaterTableDepths

This relationship is followed during Element-Drives-Element dependency tracing to notify the `Borehole` of changes to the `WaterTableDepth`.

### BoundaryBoundsVolumes

There are only 2 intended subclasses of `BoundaryBoundsVolumes`:

- `BoundaryBoundsVolumeOnPositiveSide`
- `BoundaryBoundsVolumeOnNegativeSide`

### BoreholeProviderDrivesGroundGeneration

This relationship is followed during Element-Drives-Element dependency tracing to notify the `GroundGeneration` of changes to the `IBoreholeProvider`.

### TerrainSurfaceDrivesGroundGeneration

This relationship is followed during Element-Drives-Element dependency tracing to notify the `GroundGeneration` of changes to the `ISurfaceProvider`.

### InputDrivesOperation

This relationship is followed during Element-Drives-Element dependency tracing to notify the `Operation` of changes to the `IOperand`.

See also [Operation](./GeotechnicalInterpretation.remarks.md#Operation) and [IOperand](./GeotechnicalInterpretation.remarks.md#IOperand).

### OperationHasOutput

See [Operation](./GeotechnicalInterpretation.remarks.md#Operation) and [IResultOperand](./GeotechnicalInterpretation.remarks.md#IOperand).

### OperationOwnsParameters

This relationship is followed during Element-Drives-Element dependency tracing to notify the `Operation` of changes to the `OperationParameters`.

### LayerOrderOrdersMaterials

The `LayerIndex` property must always be set. No gaps may exist in the index values.

### FencePanelIsBoundedByFencePost

This class is conceptually abstract and should never be used. Use `FencePanelHasStartFencePost` or `FencePanelHasEndFencePost` instead.