# ElectricDistribution BIS Domain Schema — Design Context

This document provides design context to author the
`ElectricDistribution` ECSchema (`edist`) as a formal BIS domain schema proposal
for the `iTwin/bis-schemas` repository. It captures the conceptual model, UPM
mapping decisions, schema layer placement, and authoring conventions.


---

## Purpose

The goal is to author a new BIS Discipline-Physical domain schema —
`ElectricDistribution` — that covers overhead electric distribution
infrastructure. This schema is intended to:

1. Formalize the Universal Pole Model (UPM) as a standards-grade BIS domain
2. Enable iTwin connectors (SPIDAcalc, O-Calc Pro, PLS-POLE, UPM native) to
   write to a shared semantic model in Bentley Infrastructure Cloud
3. Be proposed upstream to the `iTwin/bis-schemas` repository via pull request
4. Serve as the schema backbone for EPC Studio's Bentley Infrastructure Cloud
   integration
5. Support the DistribuTECH 2027 talk on AI agents for distribution pole loading
   and clearance analysis

---

## BIS Schema Architecture Background

### Layer placement

BIS schemas are organized into layers. This schema belongs at layer
**2-DisciplinePhysical**, alongside building, civil, and structural domains.
It references schemas from:

- `2-DisciplinePhysical`: `PowerSystemResourcesPhysical` (alias `psrp`) — the
  **shared power-system schema** this domain extends. Distribution classes derive
  from their specific psrp classes (`Pole`, `Conductor`, `Transformer`,
  `Insulator`, `GuyWire`, `SpanGuy`, `AnchorCage`, `CableSupports`,
  `AuxiliaryEquipment`, `PolePhysicalType`) so they reuse the power-system domain
  hierarchy shared with the substation+ domain rather than re-deriving from
  `bis:PhysicalElement` (per iTwin/bis-schemas PR #733 review).
- `0-Core`: `BisCore` — `psrp` bases ultimately subclass `bis:PhysicalElement`
- `0-Core`: `Analytical` — for loading analysis elements
- `1-Common`: `DistributionSystems` (alias `dsys`) — flow/control mixin source
  (`IDistributionElement`, `IDistributionFlowElement`); also referenced by `psrp`
- `1-Common`: `AecUnits` — for unit definitions (length, force, stress, angle)

### ECSchema file format

Schemas are authored in ECXML 3.2 format. File naming convention:
`ElectricDistribution.ecschema.xml`. Released versions copy to
`Released/ElectricDistribution.MM.mm.bb.ecschema.xml`.

### Key BIS modeling patterns used here

- **Type/Instance split**: `bis:PhysicalType` holds catalog/spec data shared
  across many instances. `bis:PhysicalElement` holds instance-specific field
  data (location, install date, condition).
- **Physical + Analytical separation**: Physical elements live in a
  `PhysicalModel`. Corresponding analytical results (loading, clearance) live
  in an `AnalyticalModel` linked by relationships.
- **Assembly relationships**: `bis:PhysicalElementAssemblesElements` expresses
  that a pole assembles its attachments.
- **ElementAspects**: Used for inspection findings and per-case loading results
  that augment an element without being a separate addressable entity.
- **Mixins**: `dsys:IDistributionFlowElement`,
  `dsys:IDistributionControlElement`, `dsys:IDistributionSensorElement` are
  implemented where appropriate.

### UPM → BIS unit mapping

The UPM uses a `MeasuredValue` struct for all dimensional quantities:
```python
class MeasuredValue:
    value_si: Optional[float]   # canonical SI value (metres, newtons, etc.)
    unit_si: str                # e.g. "m", "N"
    source_value: Optional[float]  # original tool value before conversion
    source_unit: Optional[str]     # e.g. "ft", "in", "lbs"
```
BIS properties have explicit named units. The connector is responsible for
extracting `value_si` from `MeasuredValue` and converting to the BIS property's
declared unit. The `source_value`/`source_unit` pair is preserved in the iModel
as a custom attribute or extra property on the element so round-tripping to the
source tool is lossless.

### UPM freeform strings vs. true enumerations

Not all UPM string fields are enumerations. This distinction matters for BIS
property types and for connector mapping:

- **True UPM `Literal` types** (match these values exactly in connectors):
  `NescGrade` (B/C/C_WITH_CROSSINGS/N), `GO95Grade` (A/B/C/F),
  `NescDistrict` (HEAVY/MEDIUM/LIGHT/WARM_ISLAND_UNDER_9000_FT/WARM_ISLAND_OVER_9000_FT),
  `GO95Zone` (HEAVY/LIGHT), `InstallType` (install/replacement),
  `TransformerCoolingClass` (ONAN/ONAF/ODAF),
  `TransformerPhaseConfig` (single_phase/three_phase),
  `FramingBreakdown.crossarm_structure` (single/double/mixed/unknown),
  `ClearanceRelationship.dimension` (vertical/horizontal/radial/unknown),
  `ClearanceFinding.severity` (info/warning/error/critical),
  `InspectionSection.pole_test_result` and `.verdict` (pass/marginal/fail),
  `EnvironmentalDesignContext.fire_threat_zone` (none/tier_2/tier_3).

- **UPM freeform `Optional[str]` fields** (adapters write varied values; BIS
  provides an enumeration derived from the union across all adapters; the
  connector must map adapter-specific strings to the BIS enum):
  `insulator_type`, `crossarm_type`, `equipment_type`, `attachment_type`,
  `guy_type`, `soil_class`, `treatment_type`, `sound_test_result`,
  `recommendation`.

---

## Schema Declaration

```xml
<ECSchema schemaName="ElectricDistribution" alias="edist" version="01.00.00"
    xmlns="http://www.bentley.com/schemas/Bentley.ECXML.3.2"
    displayLabel="Electric Distribution"
    description="BIS domain schema for overhead electric distribution
    infrastructure including poles, attachments, conductors, and structural
    analysis.">

  <ECSchemaReference name="BisCore"                      version="01.00.25" alias="bis"/>
  <ECSchemaReference name="Analytical"                   version="01.00.02" alias="anlyt"/>
  <ECSchemaReference name="DistributionSystems"          version="01.00.02" alias="dsys"/>
  <ECSchemaReference name="PowerSystemResourcesPhysical" version="01.00.02" alias="psrp"/>
  <ECSchemaReference name="AecUnits"                     version="01.00.03" alias="AECU"/>
  <ECSchemaReference name="Units"                        version="01.00.06" alias="u"/>
  <ECSchemaReference name="Formats"                      version="01.00.00" alias="f"/>
  <ECSchemaReference name="CoreCustomAttributes"         version="01.00.04" alias="CoreCA"/>
  <ECSchemaReference name="BisCustomAttributes"          version="01.00.00" alias="bisCA"/>

</ECSchema>
```

> **Version note:** Reference versions are aligned to `PowerSystemResourcesPhysical 01.00.02`
> and validated against the current `iTwin/bis-schemas` repo with `SchemaValidationRunner`.

---

## Gap 1: Distribution Poles

### UPM source concepts

**Primary UPM models:** `PoleIdentity`, `PoleGeometry` in
`domain/pole_model/models.py`.

Species (western red cedar, douglas fir, southern yellow pine, steel, concrete,
composite), class (1–10, H1–H6), manufactured height, setting depth, ground-line
circumference, pole-top circumference, condition rating, install date, lean
angle (not in UPM — see TODO), owner, map number, GPS coordinates, elevation,
heading.

### BIS classes

#### `edist:DistributionPoleType` — catalog/spec record

Subclass of `bis:PhysicalType`. Holds properties shared across all poles of the
same species/class/height combination.

| BIS Property | UPM Field | Type | Unit | Notes |
|---|---|---|---|---|
| `PoleClass` | `PoleGeometry.pole_class` | string | — | ANSI/NESC class (1, 2, H1, H2, etc.) |
| `ManufacturedHeight` | `PoleGeometry.manufactured_height` | double | ft | Nominal height; UPM stores as MeasuredValue in metres |
| `PoleMaterial` | (inferred from `pole_species`) | enum | — | `edist:PoleMaterial`; UPM has `pole_species` (freeform string) — Wood poles derive material from species; steel/concrete/composite from explicit species names |
| `PoleSpecies` | `PoleGeometry.pole_species` | string | — | Freeform species string (WRC, DF, SYP, GL, Steel, Concrete) |
| `NominalGroundlineStrength` | — | double | ft-lbs | ANSI O5.1 tabulated strength; not a UPM field — sourced from O5.1 table lookup by class+species |
| `NominalTipCircumference` | `PoleGeometry.pole_top_circumference` | double | in | UPM uses circumference (not diameter); stores as MeasuredValue in metres |
| `NominalGroundlineCircumference` | — | double | in | Derived from class+height+species per O5.1; not a direct UPM instance field |
| `TreatmentType` | `InspectionSection.treatment_type` | string | — | Preservative treatment (CCA, Penta, copper_naphthenate); freeform in UPM |

> **Structural note:** The original draft used `NominalTipDiameter` and
> `NominalGroundlineDiameter` (inches, diameter). The UPM stores
> `pole_top_circumference` and `ground_line_circumference` (metres,
> circumference). BIS properties are renamed to circumference to match the UPM's
> physical measurement convention; connectors convert from metres to inches.

#### `edist:DistributionPole` — placed instance

Subclass of `psrp:Pole` (`Pole → OverheadStructure → Structure`). Implements `dsys:IDistributionElement`.

| BIS Property | UPM Field | Type | Unit | Notes |
|---|---|---|---|---|
| `InstallDate` | — | dateTime | — | Not a direct UPM field; sourced from utility GIS on ingest |
| `SetDepth` | `PoleGeometry.set_depth` | double | ft | UPM: `set_depth` (MeasuredValue, metres) |
| `GroundlineCircumference` | `PoleGeometry.ground_line_circumference` | double | in | Measured field value; UPM stores in metres |
| `PoleTipCircumference` | `PoleGeometry.pole_top_circumference` | double | in | Measured field value; UPM field name is `pole_top_circumference` |
| `Elevation` | `PoleGeometry.elevation_m` | double | ft | WGS84 ellipsoid elevation; UPM stores in metres |
| `HeadingDegrees` | `PoleGeometry.heading_deg` | double | degrees | Compass bearing of pole facing (0=N, 90=E) |
| `GpsAccuracyMeters` | `PoleGeometry.gps_accuracy_m` | double | m | GPS horizontal uncertainty; stored in metres in both UPM and BIS |
| `ConditionRating` | — | enum | — | `edist:PoleConditionRating`; not a direct UPM field — derived from inspection verdict |
| `MapNumber` | `PoleIdentity.pole_id` | string | — | Utility GIS map label |
| `StructureNumber` | `PoleIdentity.structure_id` | string | — | Utility asset ID |
| `StructureName` | `PoleIdentity.structure_name` | string | — | Human-readable label |
| `PoleOwner` | — | string | — | Owner of record; not in UPM PoleIdentity — sourced from GIS |
| `JointUse` | — | boolean | — | Whether joint use attachments present; not in UPM |

> **TODO:** `LeanAngle` and `LeanDirection` are in the original draft but are
> **absent from the UPM** (`PoleGeometry` has no lean fields). These are
> meaningful structural measurements (NESC Rule 217 limits lean to 2° from
> vertical for new construction). Add them only as optional properties derived
> from field survey; the connector cannot populate them from UPM data.

> **TODO:** The UPM `PoleIdentity.source_ref` (`source_system`, `source_key`,
> `source_path`) has no BIS counterpart yet. The connector framework's external
> source ID map handles round-trip identity; no schema property needed, but the
> mapping doc should call this out explicitly.

#### Relationship: `edist:DistributionPoleIsOfType`

Subclass of `bis:PhysicalElementIsOfType`.
`edist:DistributionPole` → `edist:DistributionPoleType`.

---

## Gap 2: Pole Loading Analysis

### UPM source concepts

**Primary UPM models:** `domain/loading/grades.py`, `domain/loading/zones.py`,
`domain/loading/load_case_builder.py`, `domain/loading/tensions.py`.

Loading codes (NESC, GO95), construction grades (NESC B/C/C_WITH_CROSSINGS/N;
GO95 A/B/C/F), loading districts (NESC: Heavy/Medium/Light/Warm Island; GO95:
Heavy/Light), construction type (new/replacement), load case weather (wind speed,
ice, temperature), allowable tensions.

> **Structural note — no UPM loading result dataclass:** The UPM does not define
> a persistent loading result model (there is no `UtilizationResult` or similar
> dataclass in the `domain/` package). Loading results come from SPIDAcalc's
> `analysisResults` JSON block (`actualRatio`, `allowedRatio`, `passes`) or
> equivalent O-Calc / PLS-POLE output, which the connector reads directly from
> the source tool. The `edist:PoleLoadingResult` aspect below is a BIS-only
> design that the connector populates from the source tool's native output — it
> has no UPM field-for-field mapping.

### BIS classes

#### `edist:LoadCaseDefinition` — reusable load case

Subclass of `bis:DefinitionElement`.

| Property | Type | UPM Source | Description |
|---|---|---|---|
| `AnalysisCode` | enum | `LoadingCode` ("nesc"/"go95") | `edist:AnalysisCode`; replaces the old conflated `AnalysisStandard` |
| `NescGrade` | enum | `NescGrade` (Literal from grades.py) | `edist:NescGrade`; null when AnalysisCode is GO95 |
| `GO95Grade` | enum | `GO95Grade` (Literal from grades.py) | `edist:GO95Grade`; null when AnalysisCode is NESC |
| `NescDistrict` | enum | `NescDistrict` (Literal from zones.py) | `edist:NescDistrict`; null when AnalysisCode is GO95 |
| `GO95Zone` | enum | `GO95Zone` (Literal from zones.py) | `edist:GO95Zone`; null when AnalysisCode is NESC |
| `ConstructionType` | enum | `InstallType` ("install"/"replacement") | `edist:ConstructionType`; drives overload capacity factors |
| `NescRevision` | string | load_case_builder constants | e.g. "NESC 2023", "NESC 2012-2017" |
| `GO95Revision` | string | load_case_builder constants | e.g. "GO95 01-2020" |
| `WindSpeed` | double | district/zone lookup | mph at conductor height |
| `IceThickness` | double | district/zone lookup | inches radial |
| `WindOnIce` | boolean | — | Wind-on-ice combination case |
| `TemperatureLow` | double | district/zone lookup | °F |
| `TemperatureHigh` | double | — | °F |
| `OverloadCapacityFactor` | double | grades.py factors | Applied to allowable stress |
| `WindLoadFactor` | double | — | LRFD wind load factor |
| `Description` | string | — | Human-readable name |

> **Structural note — AnalysisStandard split:** The original draft had a single
> `edist:AnalysisStandard` enum with values `NESC_B`, `NESC_C`, `GO95`,
> `RUS_Bulletin_1724`, `Custom`. This is wrong in two ways: (1) the UPM treats
> analysis code (NESC vs. GO95) and construction grade (B, C, N; or A, B, C, F)
> as orthogonal concepts with separate `Literal` types; (2) the NESC revision
> ("NESC 2023") is a third independent axis. All three are now separate
> properties. `RUS_1724E200` is moved to `AnalysisCode`; Custom remains.

> **TODO:** Tension limits (NESC Rule 261H: initial loaded 60% RBS, initial
> unloaded at 60°F 35% RBS, final unloaded 25% RBS; guy strand 90% at loading)
> are not BIS properties — they are computed from the `NescGrade` and the wire's
> catalog rated breaking strength. Document in the `rationale.md` mapping doc
> that tension limits are not stored on `LoadCaseDefinition`.

#### `edist:PoleLoadingAnalysis` — analytical element

Subclass of `anlyt:AnalyticalElement`. Lives in an `AnalyticalModel`.
One per pole per analysis run.

| Property | Type | Source | Description |
|---|---|---|---|
| `AnalysisDate` | dateTime | — | When analysis was run |
| `AnalysisSoftware` | string | — | SPIDAcalc, O-Calc Pro, PLS-POLE, EPC Studio |
| `AnalysisSoftwareVersion` | string | — | |
| `OverallPassFail` | boolean | SPIDA `passes` / OCalc pass/fail | True = pass |
| `GoverningUtilizationRatio` | double | SPIDA `actualRatio/allowedRatio` | Highest ratio across all load cases |
| `GoverningLoadCase` | string | — | Name of governing load case |
| `GoverningLoadComponent` | string | — | Wire tension, wind, vertical, etc. |

#### `edist:PoleLoadingResult` — per-case result aspect

Subclass of `bis:ElementMultiAspect` on `edist:PoleLoadingAnalysis`.
One aspect per load case. **BIS-only — not derived from a UPM dataclass.**
Populated by the connector from SPIDAcalc `analysisResults`, OCalc per-case
output, or PLS-POLE component utilization.

| Property | Type | SPIDA Field | Description |
|---|---|---|---|
| `LoadCaseId` | string | load case name | References `LoadCaseDefinition` CodeValue |
| `UtilizationRatio` | double | `actualRatio / allowedRatio` | 0.0–1.0+ |
| `PassFail` | boolean | `passes` | |
| `ActualMoment` | double | — | ft-lbs at groundline (moment-method tools) |
| `AllowableMoment` | double | — | ft-lbs |
| `GoverningComponent` | string | — | Which load direction governed |

> **TODO:** PLS-POLE uses component-level stress ratios (pole shaft, guy, anchor)
> rather than SPIDAcalc's single groundline-moment ratio. The `UtilizationRatio`
> field captures the governing component, but PLS multi-component output may need
> additional aspects or an array property. Resolve before schema 1.0 release.

#### Relationship: `edist:PoleLoadingAnalysisAnalyzesPole`

Subclass of `anlyt:AnalyticalElementAnalyzesElement`.
`edist:PoleLoadingAnalysis` → `edist:DistributionPole`.

---

## Gap 3: Attachments

### General pattern

All direct pole attachments derive from their specific `psrp` class and apply the `edist:PoleAttachment` mixin.
They are assembled to the pole via `bis:PhysicalElementAssemblesElements`. Each
has an `AttachmentHeight` (ft above grade) derived from the UPM `attachment_height`
MeasuredValue (metres in UPM).

> **UPM parallel structure note:** The UPM maintains two parallel representations:
> (1) typed collections (`crossarms`, `guys`, `anchors`, `equipment`) as first-class
> lists on `PoleModel`, and (2) a flat `attachments: List[Attachment]` list where
> each entry has `attachment_type` (freeform string like "crossarm", "insulator",
> "guy", "equipment") for clearance and rendering lookups. BIS models only the
> typed structure — the flat attachment list is a UPM internal view, not a separate
> BIS class.

#### `edist:PoleAttachment` — abstract base

A **mixin** (`IsMixin`, applies to `bis:PhysicalElement`) carrying the shared
attachment properties (AttachmentHeight, DirectionDegrees, InstallDate); it is
the target of `DistributionPoleAssemblesAttachments`. Each attachment class
derives from its specific psrp base (e.g. `Crossarm → CableSupports`,
`Insulator → Insulator`, `GuyWire → GuyWire`, `Transformer → Transformer`) **and**
applies this mixin, since the attachments span both the `Structure` and
`Equipment` psrp branches and no longer share a single entity base.

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `AttachmentHeight` | `attachment_height.value_si` (converted) | double | Height above grade (ft) |
| `DirectionDegrees` | `direction_deg` | double | Compass bearing (0=N, 90=E) |
| `InstallDate` | — | dateTime | Not in UPM; sourced from GIS |

> **TODO:** Original draft had `MountHeight` and `Offset` as base attachment
> properties. Renamed `MountHeight` → `AttachmentHeight` to match UPM field name.
> `Offset` applies only to crossarms (UPM `Crossarm.offset`) — moved to
> `edist:Crossarm`. Base class `Offset` removed.

#### `edist:Crossarm`

Subclass of `edist:PoleAttachment`.

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `CrossarmType` | `Crossarm.crossarm_type` | string | Freeform; e.g. "Wood - 8' Double" |
| `Offset` | `Crossarm.offset` | double | Horizontal distance from pole center (ft) |
| `ArmSide` | `Crossarm.side` | enum | `edist:CrossarmSide` — arm configuration (single/double) |
| `ArmLength` | — | double | ft; not a direct UPM field — inferred from span geometry or crossarm catalog |
| `ArmMaterial` | — | enum | `edist:CrossarmMaterial`; not in UPM — inferred from `crossarm_type` string |
| `ArmSize` | — | string | e.g. "3.5x4.5"; not in UPM |
| `BraceType` | — | string | None, Single, Double; not in UPM |

> **Structural note:** UPM `Crossarm` nests its `insulators: List[Insulator]`
> directly on the crossarm object. BIS represents this as assembly relationships:
> `edist:Crossarm` assembles `edist:Insulator` children via
> `bis:PhysicalElementAssemblesElements`. The UPM's crossarm-to-insulator
> association is preserved via `edist:Insulator.CrossarmId` (external reference).

> **TODO:** The UPM `Crossarm.metadata` dict (from adapters) may carry
> `arm_count` (1=single, 2=sandwich/double). Map `arm_count` → `ArmSide`.
> `FramingBreakdown.crossarm_structure` (single/double/mixed/unknown) is a
> pole-level rollup, not the per-crossarm value.

#### `edist:Insulator`

Subclass of `edist:PoleAttachment`.

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `InsulatorType` | `Insulator.insulator_type` | enum | `edist:InsulatorType`; UPM freeform — see enum table |
| `CrossarmId` | `Insulator.crossarm_id` | string | External reference to parent crossarm; null for pole-mounted |
| `VerticalOffset` | `Insulator.vertical_offset` | double | Vertical offset from attachment height (ft) |
| `HorizontalOffset` | `Insulator.horizontal_offset` | double | Horizontal offset from crossarm/pole center (ft) |
| `VoltageRating` | — | double | kV; not in UPM — sourced from wire catalog |
| `PhaseDesignation` | — | string | A, B, C, N; not in UPM |

> **Structural note:** UPM `Insulator` contains `spans: List[Span]` — the
> conductor spans leaving from this insulator position. BIS models spans as
> `edist:OverheadConductor` elements (standalone), linked to the insulator by
> relationship rather than containment. This avoids the UPM's nested structure
> and makes conductors independently queryable. The trade-off: the BIS connector
> must explicitly create the insulator-to-conductor link; the UPM embeds it.

#### `edist:SpanGuy` — pole-to-pole guy wire

**New class — absent from original draft.**
Subclass of `edist:PoleAttachment`. Represents a guy wire running from this
pole to a backup stub or another anchoring structure (NOT down to a ground
anchor). SPIDA models these as paired structures; each end has a `SpanGuy`
entry sharing the same `ExternalId`.

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `ExternalId` | `SpanGuy.external_id` | string | Shared ID across paired poles for renderer reconstruction |
| `Distance` | `SpanGuy.distance` | double | Horizontal wire length (ft) |
| `GuySize` | `SpanGuy.size` | string | Freeform; e.g. "3/8 EHS" |

#### `edist:GuyWire` — ground-anchored guy

Subclass of `edist:PoleAttachment`.

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `AnchorId` | `Guy.anchor_id` | string | External reference to the anchor |
| `GuyType` | `Guy.guy_type` | string | Freeform; e.g. "Down Guy" |
| `GuySize` | (from metadata) | string | e.g. "3/8 EHS", "7/16 HS" |
| `GuyGrade` | (from metadata) | enum | `edist:GuyGrade` |
| `GuyStrand` | (from metadata) | string | e.g. "7x" |
| `LeadDistance` | (from metadata) | double | ft horizontal to anchor |
| `DownAngle` | (from metadata) | double | degrees from horizontal |
| `PreloadedTension` | (from metadata) | double | lbs |
| `AllowableTension` | (from metadata) | double | lbs |

> **Structural note:** UPM `Guy` is intentionally sparse — it has only
> `guy_id`, `guy_type`, `attachment_height`, and `anchor_id`. The detailed
> properties (`GuySize`, `GuyGrade`, etc.) live in `Guy.metadata` as passed
> through from the source tool. BIS promotes them to first-class properties
> because structural analysis requires them. The connector must extract these
> from `metadata`. Mark these BIS properties as optional to tolerate UPM poles
> where the metadata is absent.

#### `edist:AnchorAssembly`

Subclass of `psrp:AnchorCage` (`AnchorCage → UndergroundStructure → Structure`). Associated to the pole, not a subtype of
`PoleAttachment` (anchors are ground-mounted, not pole-mounted).

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `AnchorType` | — | enum | `edist:AnchorType`; not in UPM — sourced from anchor catalog or metadata |
| `EmbedDepth` | — | double | ft; not in UPM `Anchor` model |
| `SoilClass` | — | string | Not in UPM `Anchor` model |

> **TODO:** UPM `Anchor` has only `anchor_id`, `distance` (ft), `direction_deg`,
> `height` (stub pole height), and `guy_ids` (list of connected guys). It does
> NOT have `AnchorRating`, `EmbedDepth`, or `SoilClass`. These properties in
> the original draft have no UPM source — they must come from the anchor catalog
> or a separate soil data input. Remove `AnchorRating` from the BIS class until
> a UPM or connector source is identified. `SoilClass` for grounding analysis
> belongs on `edist:GroundingConfiguration` (Gap 6), not on the anchor.

#### Relationship: `edist:GuyWireConnectsToAnchor`

New relationship. `edist:GuyWire` → `edist:AnchorAssembly`.

#### `edist:OverheadConductor`

Subclass of `psrp:Conductor` (`Conductor → Equipment`; inherits `dsys:IDistributionFlowElement`).
Represents a conductor span between two poles. Populated from UPM `Span` objects
(which are nested under `Insulator.spans` in the UPM).

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `WireId` | `Span.wire_id` | string | Wire label (e.g. "Phase A", "Neutral N") |
| `WireCode` | `Span.size` | string | Conductor size label (ACSR 336, 2/0 ACSR, #2 CU) |
| `ConductorUsageGroup` | `Attachment.attachment_type` or span metadata | enum | `edist:ConductorUsageGroup`; UPM stores as freeform usage group |
| `NominalVoltage` | `Attachment.voltage_v` | double | kV |
| `SpanLength` | `Span.length` | double | ft horizontal |
| `AttachmentHeightNear` | parent `Insulator.attachment_height` | double | ft at near pole |
| `AttachmentHeightFar` | (far-pole insulator) | double | ft at far pole |
| `RotationDegrees` | `Span.rotation_deg` | double | Compass bearing from near pole |
| `EndpointType` | `Span.endpoint_type` | string | PREVIOUS_POLE, OTHER_POLE, etc. |
| `IsInsulated` | — | boolean | Not in UPM |
| `CoverType` | — | string | Tree wire, bare, spacer; not in UPM |
| `TensionGroup` | `Span.metadata.tension_type` | string | "full" or "slack" |

> **Structural note:** The UPM nests spans under insulators
> (`Insulator.spans: List[Span]`). BIS models each span as a standalone
> `edist:OverheadConductor` element linked to its source insulator by a
> relationship. This makes conductors independently addressable in the iModel
> (required for clearance checks and iTwin visualization) at the cost of
> requiring explicit relationship creation in the connector.

#### `edist:DistributionTransformer`

Subclass of `edist:PoleAttachment`. Implements `dsys:IDistributionFlowElement`.

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `RatedKva` | `TransformerNameplate.rated_kva` | double | kVA |
| `CoolingClass` | `TransformerNameplate.cooling_class` | enum | `edist:TransformerCoolingClass` (ONAN/ONAF/ODAF) |
| `PrimaryVoltageKv` | `TransformerNameplate.primary_voltage_kv` | double | kV |
| `SecondaryVoltageV` | `TransformerNameplate.secondary_voltage_v` | double | V |
| `PhaseConfig` | `TransformerNameplate.phase_config` | enum | `edist:TransformerPhaseConfig` (SinglePhase/ThreePhase) |
| `ConnectionType` | `TransformerNameplate.connection_type` | string | Freeform; e.g. "Delta-Wye" |
| `LossRatioR` | `TransformerNameplate.loss_ratio_R` | double | PCC/PNL ratio for IEEE C57.91 thermal model |
| `ActualLoadKva` | `TransformerNameplate.actual_load_kva` | double | Measured / SCADA load at time of analysis |
| `RatedTopOilRiseC` | `TransformerNameplate.rated_top_oil_rise_c` | double | °C; IEEE C57.91 thermal parameter |
| `RatedHottestSpotRiseC` | `TransformerNameplate.rated_hottest_spot_rise_c` | double | °C; IEEE C57.91 thermal parameter |
| `EquipmentSize` | `Equipment.equipment_size` | string | Freeform size label |
| `BottomHeight` | `Equipment.bottom_height` | double | ft; lower edge height above grade |
| `SerialNumber` | — | string | Not in UPM |
| `MountType` | — | enum | Overhead, Padmount, SubSurface; not in UPM |

> **Note:** Original draft was missing all `TransformerNameplate` fields. The
> UPM's `TransformerNameplate` is the source for IEEE C57.91 thermal loading
> analysis — these fields are required for the transformer thermal analyzer.

#### `edist:PoleEquipment` — general pole-mounted equipment

Subclass of `edist:PoleAttachment`. Used for non-transformer equipment: street
lights, capacitors, regulators, reclosers, switches, cutouts, arresters, risers,
termination brackets, and communication equipment. The `EquipmentType` enum
(below) classifies the item; a future release may add typed subclasses for each.

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `EquipmentType` | `Equipment.equipment_type` | enum | `edist:EquipmentType`; UPM freeform |
| `EquipmentSize` | `Equipment.equipment_size` | string | Freeform size label |
| `BottomHeight` | `Equipment.bottom_height` | double | ft; lower edge height above grade |

> **Note:** Equipment types seen across UPM adapters (SPIDA, OCalc, PLS):
> `TRANSFORMER`, `STREET_LIGHT`, `CUTOUT_ARRESTOR`, `RISER`,
> `TERMINATION_BRACKET`, `CAPACITOR`, `REGULATOR`, `RECLOSER`, `SWITCH`,
> `COMMUNICATION`, `CATV`, `TELCO`, `FIBER`. Original draft modeled only
> `DistributionTransformer`; all others were missing. `RISER` and
> `TERMINATION_BRACKET` are SPIDA-specific (underground-to-overhead transition).

---

## Gap 4: Clearance Zones and Conductor Sag Geometry

### UPM source concepts

**Primary UPM models:** `ClearanceSection`, `ClearanceCheck`, `ClearanceFinding`,
`ClearanceSummary`, `ClearanceProfileRef`, `ClearanceRelationship`,
`ClearanceContext` in `domain/pole_model/models.py`; clearance section builder
in `domain/pole_model/adapters/clearance.py`.

Clearance profile (rule set and version), per-pair attachment clearance checks
(required, actual, delta, pass/fail), table classification (Table 1 = conductor-
to-ground/crossing; Table 2 = conductor-to-conductor for GO95), severity findings,
pole-level clearance summary.

> **Structural note — profile-based vs. type-based model:** The original draft
> modeled clearance with a `ClearanceType` enum classifying checks by physical
> relationship (ToGrade, ToCrossing, ToBulding, etc.). The UPM uses a
> profile-based approach: each check references a `ClearanceProfileRef`
> (rule_profile, rule_version) and a `table_id` (GO95 "Table 1"/"Table 2"; NESC
> Table 232-1, Table 235-5, Table 235-6). Attachment pair voltage classes drive
> the required clearance lookup, not an enum type. The BIS classes below blend
> both approaches: the profile and table_id from the UPM for connector fidelity,
> and a clearance-type classification for human readability.

### BIS classes

#### `edist:ClearanceRequirement` — reusable profile definition

Subclass of `bis:DefinitionElement`.

| Property | Type | UPM Field | Description |
|---|---|---|---|
| `RuleProfile` | string | `ClearanceProfileRef.rule_profile` | e.g. "CPUC_GO95", "NESC_2023" |
| `RuleVersion` | string | `ClearanceProfileRef.rule_version` | e.g. "01-2020" |
| `TableId` | string | `ClearanceCheck.table_id` | e.g. "Table 1", "Table 232-1" |
| `ApplicableCode` | enum | — | `edist:AnalysisCode` |
| `StandardSection` | string | — | e.g. "NESC Rule 232" |
| `RequiredClearance` | double | `ClearanceCheck.required.value_si` (converted) | ft |
| `ConditionClass` | string | — | Normal, Loaded, Extreme |

#### `edist:ClearanceCheck` — per-attachment-pair check

Subclass of `anlyt:AnalyticalElement`. One per attachment pair per analysis.

| Property | Type | UPM Field | Description |
|---|---|---|---|
| `CheckDate` | dateTime | — | |
| `ProfileRef` | string | `ClearanceCheck.profile.rule_profile` | Which rule set was applied |
| `TableId` | string | `ClearanceCheck.table_id` | "Table 1", "Table 2", "Table 232-1", etc. |
| `ClearanceTypeId` | int | `ClearanceCheck.clearance_type_id` | Numeric clearance type from rule table |
| `Dimension` | enum | `ClearanceRelationship.dimension` | `edist:ClearanceDimension` (Vertical/Horizontal/Radial/Unknown) |
| `SameSupport` | boolean | `ClearanceRelationship.same_support` | Whether subject and object are on the same pole |
| `SubjectAttachmentId` | string | `ClearanceRelationship.subject_attachment_id` | |
| `ObjectAttachmentId` | string | `ClearanceRelationship.object_attachment_id` | |
| `SubjectVoltageV` | double | `ClearanceCheck.subject_voltage_v` | V |
| `ObjectVoltageV` | double | `ClearanceCheck.object_voltage_v` | V |
| `RequiredClearance` | double | `ClearanceCheck.required.value_si` (converted) | ft |
| `ActualClearance` | double | `ClearanceCheck.actual.value_si` (converted) | ft |
| `ClearanceDelta` | double | `ClearanceCheck.delta.value_si` (converted) | ft; positive = margin, negative = violation |
| `Passed` | boolean | `ClearanceCheck.passed` | |
| `Message` | string | `ClearanceCheck.message` | |
| `OverallPassFail` | boolean | — | Aggregate for the span/check set |
| `MinimumClearanceFound` | double | — | ft — worst case found in this analysis |

#### `edist:ClearanceViolation` — finding record

Subclass of `bis:InformationContentElement`. One per violation found.

| Property | Type | UPM Field | Description |
|---|---|---|---|
| `Severity` | enum | `ClearanceFinding.severity` | `edist:ClearanceSeverity` (Info/Warning/Error/Critical) |
| `Category` | string | `ClearanceFinding.category` | |
| `RequiredClearance` | double | — | ft |
| `ActualClearance` | double | — | ft |
| `DeficiencyAmount` | double | `ClearanceCheck.delta` | ft (negative = violation) |
| `LocationDescription` | string | — | |
| `StandardSection` | string | — | |

#### `edist:ClearanceSummary` — pole-level rollup

Subclass of `bis:ElementMultiAspect` on `edist:DistributionPole`. Captures the
UPM `ClearanceSummary` block directly.

| Property | Type | UPM Field | Description |
|---|---|---|---|
| `Status` | string | `ClearanceSummary.status` | "pass", "fail", "unknown" |
| `TotalIssues` | int | `ClearanceSummary.total_issues` | |
| `Table1Issues` | int | `ClearanceSummary.table_1_issues` | Conductor-to-ground/crossing |
| `Table2Issues` | int | `ClearanceSummary.table_2_issues` | Conductor-to-conductor |
| `CriticalIssues` | int | `ClearanceSummary.critical_issues` | |
| `MinorIssues` | int | `ClearanceSummary.minor_issues` | |

#### `edist:ConductorSagCondition` — multi-aspect on OverheadConductor

Subclass of `bis:ElementMultiAspect`. Captures sag at multiple
temperature/load conditions on a single conductor element.

| Property | Type | Description |
|---|---|---|
| `Condition` | enum | `edist:ConductorSagConditionType` |
| `Temperature` | double | °F |
| `MidspanSag` | double | ft |
| `HorizontalTension` | double | lbs |
| `VerticalClearanceAtMidspan` | double | ft to grade |

---

## Gap 5: Field Inspection Results

### UPM source concepts

**Primary UPM models:** `InspectionSection` in `domain/pole_model/models.py`;
`InspectionRecord` in `domain/inspection/pge_ptt.py`.

Inspection program, date, inspector, pole test result (pass/marginal/fail),
sound test result (freeform), borehole result (freeform), groundline decay
percent, residual strength percent, shell thickness, treatment history,
condition factor (circumference-derived), PG&E PTT-specific measured
circumferences, visual findings, recommendation, overall verdict.

### BIS classes

#### `edist:PoleInspection` — inspection record

Subclass of `bis:InformationRecordElement`.

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `InspectionDate` | `InspectionSection.last_inspection_date` | dateTime | ISO date |
| `Inspector` | `InspectionSection.inspector` | string | Inspector name |
| `InspectionProgram` | `InspectionSection.program` | string | e.g. "Annual Pole Test & Treat" |
| `InspectionMethod` | — | enum | `edist:InspectionMethod`; UPM does not prescribe a method enum — infer from program name or default to Intrusive for PTT records |
| `PoleTestResult` | `InspectionSection.pole_test_result` | enum | `edist:InspectionVerdict` (Pass/Marginal/Fail) — matches UPM Literal |
| `SoundTestResult` | `InspectionSection.sound_test_result` | string | Freeform; e.g. "no_decay", "hollow_at_groundline" |
| `BoreholeTestResult` | `InspectionSection.borehole_test_result` | string | Freeform |
| `GroundlineDecayPct` | `InspectionSection.groundline_decay_pct` | double | % of original circumference lost to decay |
| `ResidualStrengthPct` | `InspectionSection.residual_strength_pct` | double | Post-decay strength as % of original |
| `ShellThicknessIn` | `InspectionSection.shell_thickness_in` | double | Inches; from boring measurement |
| `TreatedBool` | `InspectionSection.treated_bool` | boolean | Whether pole has been chemically treated |
| `TreatmentType` | `InspectionSection.treatment_type` | string | Freeform; e.g. "CCA-C", "copper_naphthenate" |
| `LastTreatmentDate` | `InspectionSection.last_treatment_date` | dateTime | |
| `ConditionFactor` | `InspectionRecord.condition_factor` | double | (effective_circ/orig_circ)^3; remaining strength fraction |
| `OrigCircumferenceIn` | `InspectionRecord.orig_circ_in` | double | As-installed groundline circumference (capacity baseline) |
| `CurrentCircumferenceIn` | `InspectionRecord.current_circ_in` | double | Current external measured circumference |
| `EffectiveCircumferenceIn` | `InspectionRecord.effective_circ_in` | double | Sound-wood equivalent-solid circumference (decay removed) |
| `GlShellAvgIn` | `InspectionRecord.gl_shell_avg` | double | Groundline shell average from boring |
| `WoodStrengthPct` | `InspectionRecord.wood_strength_pct` | double | Utility-computed % of original strength remaining |
| `VisualFindings` | `InspectionSection.visual_findings` | string | Freeform narrative |
| `Recommendation` | `InspectionSection.recommendation` | string | Freeform; e.g. "Re-inspect in 5 yrs", "Replace" |
| `Verdict` | `InspectionSection.verdict` | enum | `edist:InspectionVerdict` (Pass/Marginal/Fail) — matches UPM Literal |
| `InspectionStandard` | — | string | ANSI O5.1, RUS, Utility custom; not in UPM |
| `NextInspectionDate` | — | dateTime | Not in UPM |
| `Notes` | — | string | Supplemental notes; not in UPM |

> **Enum correction:** Original draft had `InspectionOverallRating` with values
> Satisfactory/Marginal/Unsatisfactory/Condemned. UPM uses
> `Literal["pass", "marginal", "fail"]` for both `pole_test_result` and
> `verdict`. BIS enum `edist:InspectionVerdict` matches UPM: Pass, Marginal,
> Fail. The original "Condemned" state maps to Fail (no separate UPM value).

#### `edist:InspectionFinding` — individual finding aspect

Subclass of `bis:ElementMultiAspect` on `edist:PoleInspection`.

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `FindingType` | — | enum | `edist:FindingType`; no direct UPM enum — UPM uses freeform `visual_findings` |
| `Severity` | `ClearanceFinding.severity` | enum | `edist:FindingSeverity` (Info/Warning/Error/Critical) — matches UPM Literal |
| `HeightLocation` | — | double | ft above grade where found |
| `Description` | — | string | |
| `PhotoReference` | — | string | URI to attached photo |

> **Enum correction:** Original draft had `FindingSeverity` values
> Minor/Moderate/Severe/Critical. UPM `ClearanceFinding.severity` uses
> `Literal["info", "warning", "error", "critical"]`. BIS enum corrected to:
> Info, Warning, Error, Critical.

#### Relationship: `edist:PoleInspectionInspectsPole`

Subclass of `bis:ElementRefersToElements`.
`edist:PoleInspection` → `edist:DistributionPole`.

---

## Gap 6: Grounding Configuration

**New gap — absent from original draft.**

### UPM source concepts

**UPM model:** `Grounding` in `domain/pole_model/models.py`.

Per-pole grounding rod configuration for IEEE 142 resistance calculation.
`rod_count + rod_length_ft + rod_diameter_in + soil_resistivity_ohm_m` are
required to compute resistance analytically; `measured_resistance_ohm` supersedes
the calculation when a fall-of-potential test has been performed.

### BIS classes

#### `edist:GroundingConfiguration` — grounding data aspect

Subclass of `bis:ElementMultiAspect` on `edist:DistributionPole`.

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `RodCount` | `Grounding.rod_count` | int | Number of ground rods |
| `RodLengthFt` | `Grounding.rod_length_ft` | double | Length per rod (ft) |
| `RodDiameterIn` | `Grounding.rod_diameter_in` | double | Diameter per rod (inches) |
| `RodSpacingFt` | `Grounding.rod_spacing_ft` | double | Spacing between rods in multi-rod arrays (ft) |
| `SoilResistivityOhmM` | `Grounding.soil_resistivity_ohm_m` | double | Soil resistivity (Ω·m) |
| `SoilClass` | `Grounding.soil_class` | string | Freeform soil classification |
| `MeasuredResistanceOhm` | `Grounding.measured_resistance_ohm` | double | Fall-of-potential test result (Ω); overrides analytical estimate |

---

## Gap 7: Environmental Design Context

**New gap — absent from original draft.**

### UPM source concepts

**UPM model:** `EnvironmentalDesignContext` in `domain/pole_model/models.py`.

Per-pole design environmental conditions consumed by IEEE 738 ampacity analysis,
IEEE C57.91 transformer thermal analysis, and conductor sag-tension change-of-state.
Sourced from the loading area definition for the pole's location, or pinned
per-pole when site-specific.

### BIS classes

#### `edist:EnvironmentalDesignContext` — design environment aspect

Subclass of `bis:ElementMultiAspect` on `edist:DistributionPole`.

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `AmbientTempDesignF` | `EnvironmentalDesignContext.ambient_temp_design_f` | double | Design ambient temperature (°F) for IEEE 738 |
| `WindDesignFps` | `EnvironmentalDesignContext.wind_design_fps` | double | Design wind speed (ft/s) for IEEE 738 |
| `SolarFluxWPerFt2` | `EnvironmentalDesignContext.solar_flux_w_per_ft2` | double | Solar irradiance (W/ft²) for IEEE 738 |
| `IceRadialIn` | `EnvironmentalDesignContext.ice_radial_in` | double | Radial ice accretion (inches) for sag-tension |
| `FireThreatZone` | `EnvironmentalDesignContext.fire_threat_zone` | enum | `edist:FireThreatZone` (None/Tier2/Tier3); UPM Literal `"none"/"tier_2"/"tier_3"` |

---

## Gap 8: Vegetation Clearance Context

**New gap — absent from original draft.**

### UPM source concepts

**UPM model:** `VegetationContext` in `domain/pole_model/models.py`.

Per-pole vegetation clearance state. Sourced from inspection, AMI, or LiDAR
scan; populated when the utility runs a tree-trim survey on the pole.

### BIS classes

#### `edist:VegetationContext` — vegetation clearance aspect

Subclass of `bis:ElementMultiAspect` on `edist:DistributionPole`.

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `CurrentClearanceIn` | `VegetationContext.current_clearance_in` | double | Current tree-to-conductor clearance (inches) |
| `VegetationInspectionDate` | `VegetationContext.last_inspection_date` | dateTime | Date of last tree-trim survey |
| `DominantConductorInsulationType` | `VegetationContext.dominant_conductor_insulation_type` | string | Freeform; e.g. "bare", "tree_wire" |

---

## Gap 9: Avian Protection Context

**New gap — absent from original draft.**

### UPM source concepts

**UPM model:** `AvianContext` in `domain/pole_model/models.py`.

Per-pole avian-zone membership and IEEE 1656 mitigation tracking. Captures zone
classification, wildlife/bushing covers installed, and retrofit completion state.

### BIS classes

#### `edist:AvianZone` — zone definition element

Subclass of `bis:DefinitionElement`. Lives in a `DefinitionModel`. Represents a
named avian protection zone (utility-designated or regulatory). Poles reference
zones via relationship, so zone membership is queryable without string parsing.

| BIS Property | Type | Description |
|---|---|---|
| `ZoneId` | string | Utility or regulatory zone identifier (e.g. "PGE_AVIAN_ZONE_5") |
| `ZoneName` | string | Human-readable name |
| `Authority` | string | Designating body (e.g. "PG&E", "CPUC") |

#### `edist:PoleIsInAvianZone` — zone membership relationship

Subclass of `bis:ElementRefersToElements`. Many-to-many: a pole belongs to
multiple zones; a zone contains many poles.

- **Source**: `edist:DistributionPole` (0..*)
- **Target**: `edist:AvianZone` (0..*)

**Connector mapping:** For each string in `AvianContext.in_avian_zones`, the
connector upserts an `edist:AvianZone` element by `ZoneId` in the definition
model, then inserts one `PoleIsInAvianZone` relationship per entry.

#### `edist:AvianProtectionContext` — avian mitigation aspect

Subclass of `bis:ElementMultiAspect` on `edist:DistributionPole`. Carries the
per-pole mitigation state; zone membership is on the relationship above.

| BIS Property | UPM Field | Type | Description |
|---|---|---|---|
| `WildlifeCoverPresent` | `AvianContext.wildlife_cover_present` | boolean | |
| `BushingCoverPresent` | `AvianContext.bushing_cover_present` | boolean | |
| `LastAvianInspectionDate` | `AvianContext.last_avian_inspection_date` | dateTime | |
| `AvianRetrofitComplete` | `AvianContext.avian_retrofit_complete` | boolean | IEEE 1656 retrofit fully installed |

---

## Gap 10: Service Network References

**New gap — absent from original draft.**

### UPM source concepts

**UPM model:** `ServiceNetworkRef` in `domain/pole_model/models.py`.

Forward reference from a pole to a Universal Service Model network sourced by a
transformer on this pole. Keeps the pole-side and services-side models loosely
coupled — the actual network lives in its own document, joined by `network_id`.

### BIS classes

#### Relationship: `edist:PoleServicesNetwork`

New relationship. `edist:DistributionPole` → target (TBD — depends on how the
Universal Service Model is modeled in BIS).

| UPM Field | Type | Description |
|---|---|---|
| `ServiceNetworkRef.network_id` | string | Key to the downstream service network |
| `ServiceNetworkRef.transformer_equipment_id` | string | Which transformer sources this network |
| `ServiceNetworkRef.service_count` | int | Number of services on the network |

> **TODO:** The Universal Service Model is not yet a BIS schema. Represent
> `ServiceNetworkRef` as a string property `ServiceNetworkId` on
> `edist:DistributionTransformer` as a placeholder, and upgrade to a first-class
> relationship when the services schema is available. Note `transformer_equipment_id`
> and `service_count` as custom attributes on the interim property.

---

## Supporting Enumerations

Author as `ECEnumeration` in the schema. Values are given in BIS (PascalCase)
format; the UPM source Literal value (where one exists) is shown for connector
mapping.

### Unchanged from original draft (values correct)

| Enumeration | Values |
|---|---|
| `edist:PoleMaterial` | Wood, Steel, Concrete, Composite, Fiberglass |
| `edist:PoleConditionRating` | Good, Fair, Poor, Critical |
| `edist:CrossarmMaterial` | Wood, Steel, Fiberglass |
| `edist:AnchorType` | ScrewAuger, Expanding, Concrete, Rock, StubPole, Deadman |
| `edist:InspectionMethod` | Visual, Sounding, Boring, ChemicalTest, Ultrasonic, PoleTreat |
| `edist:FindingType` | SurfaceRot, InteriorRot, Crack, Woodpecker, PhysicalDamage, LeaningExcessive, HardwareDamaged, AttachmentLoose, Other |
| `edist:ConductorSagConditionType` | Initial, Final, Loaded, FullIce, Extreme |
| `edist:GuyGrade` | EHS, HS, SiloGuy, SoftDrawCopper |

### Corrected or renamed enumerations

| Enumeration | Old values | Corrected values | Reason |
|---|---|---|---|
| `edist:InsulatorType` | PinType, PostType, SuspensionType, DeadEndType, StrainType | **Pin, Deadend, Clamp, Bracket, Unknown** | UPM freeform field; union across SPIDA (`_infer_insulator_type`), OCalc, and PLS-POLE adapters all converge on these values. SPIDA: Deadend/Clamp/Bracket/Pin/Unknown; PLS: Pin/Deadend. Connector maps adapter strings to this enum. |
| `edist:ConductorUsageGroup` | (was `ConductorType`: Primary, Secondary, Neutral, CommunicationSupport, Guy) | **Primary, Secondary, Neutral, PrimaryNeutral, Streetlight, Communication, CommunicationBundle, CommunicationService, SecondaryDrop, StaticWire, GroundWire** | Renamed from `ConductorType` to match UPM "usage group" concept. Values extended to match `_USAGE_GROUP_FALLBACK_VOLTAGE` dict in `clearance.py`. `Guy` removed (not a wire usage group). |
| `edist:InspectionVerdict` | (was `InspectionOverallRating`: Satisfactory, Marginal, Unsatisfactory, Condemned) | **Pass, Marginal, Fail** | UPM `Literal["pass", "marginal", "fail"]` on both `pole_test_result` and `verdict`. "Condemned" has no UPM value; maps to Fail. |
| `edist:FindingSeverity` | Minor, Moderate, Severe, Critical | **Info, Warning, Error, Critical** | UPM `Literal["info", "warning", "error", "critical"]` on `ClearanceFinding.severity`. Minor/Moderate/Severe do not exist in the UPM. |
| `edist:CrossarmSide` | (not in original draft) | **Single, Double, Mixed, Unknown** | New enum; derived from UPM `FramingBreakdown.crossarm_structure` Literal (`"single"/"double"/"mixed"/"unknown"`). |
| `edist:ClearanceDimension` | (not in original draft) | **Vertical, Horizontal, Radial, Unknown** | New enum; matches UPM `ClearanceRelationship.dimension` Literal (`"vertical"/"horizontal"/"radial"/"unknown"`). |
| `edist:ClearanceSeverity` | (was `FindingSeverity` used for clearance) | **Info, Warning, Error, Critical** | Same values as `FindingSeverity`; can share the enum or be separate for schema clarity. |
| ~~`edist:RecommendedAction`~~ | ~~None, Monitor, Reinforce, Replace, Emergency~~ | **Removed — superseded by freeform string** | UPM `InspectionSection.recommendation` is `Optional[str]` (e.g. "Re-inspect in 5 yrs", "Replace"). A fixed enum would drop real-world values. Model as a plain string property on `PoleSpatialElementAspect`. |

### New enumerations (not in original draft)

| Enumeration | Values | UPM Source |
|---|---|---|
| `edist:AnalysisCode` | **NESC, GO95, RUS1724E200, Custom** | Replaces conflated `AnalysisStandard`; from `LoadingCode = Literal["nesc", "go95"]` in grades.py |
| `edist:NescGrade` | **B, C, C_WITH_CROSSINGS, N** | True UPM Literal from `grades.py`: `NescGrade = Literal["B", "C", "C_WITH_CROSSINGS", "N"]` |
| `edist:GO95Grade` | **A, B, C, F** | True UPM Literal from `grades.py`: `GO95Grade = Literal["A", "B", "C", "F"]` |
| `edist:NescDistrict` | **Heavy, Medium, Light, WarmIslandUnder9000Ft, WarmIslandOver9000Ft** | True UPM Literal from `zones.py`; exact values: HEAVY/MEDIUM/LIGHT/WARM_ISLAND_UNDER_9000_FT/WARM_ISLAND_OVER_9000_FT |
| `edist:GO95Zone` | **Heavy, Light** | True UPM Literal from `zones.py`: GO95Zone = Literal["HEAVY", "LIGHT"] |
| `edist:ConstructionType` | **Install, Replacement** | UPM `InstallType = Literal["install", "replacement"]` in grades.py. **Note:** `load_case_builder.py` uses `"NEW"`/`"REPLACEMENT"` (different vocabulary, same concept). Connector must map both: `"install"` → Install, `"NEW"` → Install; `"replacement"` → Replacement, `"REPLACEMENT"` → Replacement. |
| `edist:TransformerCoolingClass` | **ONAN, ONAF, ODAF** | True UPM Literal from `TransformerNameplate.cooling_class` |
| `edist:TransformerPhaseConfig` | **SinglePhase, ThreePhase** | True UPM Literal from `TransformerNameplate.phase_config` (`"single_phase"/"three_phase"`) |
| `edist:EquipmentType` | **Transformer, StreetLight, CutoutArrestor, Riser, TerminationBracket, Capacitor, Regulator, Recloser, Switch, Arrester, Communication, Catv, Telco, Fiber, Equipment** | UPM freeform; union across SPIDA, OCalc, PLS adapters |
| `edist:FireThreatZone` | **None, Tier2, Tier3** | True UPM Literal from `EnvironmentalDesignContext.fire_threat_zone` (`"none"/"tier_2"/"tier_3"`) |

---

## Source Tool Format Notes

These notes document the source-tool data models the schema's property set and
enumeration values were derived from.

### SPIDAcalc (Bentley Systems)
- **Format:** JSON project files (`.spida` extension, JSON internally)
- **Structure:** A project contains locations; each location has a label,
  coordinates, and one or more designs (existing, proposed, remedy). Each design
  has a pole and a list of wires, equipment, and guys.
- **Key objects:** `pole` (species, class, height, owner), `wire` (clientItem
  wire code, attachmentHeight, tensionGroup), `equipment` (transformers,
  streetlights), `guy` (attachmentHeight, direction, leadDistance, clientItem)
- **Analysis results:** Stored per-design as `analysisResults` containing
  per-load-case summaries with `actualRatio`, `allowedRatio`, `unit`, `passes`
- **Insulator types inferred** by `_infer_insulator_type` from clientItem name:
  Deadend, Clamp, Bracket, Pin, Unknown (freeform — not a SPIDA enum)
- **Equipment types** from adapter: `TERMINATION_BRACKET`, `RISER`,
  `TRANSFORMER`, `STREET_LIGHT`, `CUTOUT_ARRESTOR`; pairing logic resolves
  RISER + TERMINATION_BRACKET as primary riser entry points
- **SpanGuy:** Modeled as paired structures sharing `external_id`; each pole
  carries one `SpanGuy` entry pointing at the partner's attachment height
- **Coordinate system:** WGS84 lat/lon on the location; relative offsets within
  the design
- **MCP access:** EPC Studio has a live SPIDAcalc MCP server
- **Ownership note:** SPIDAcalc is a Bentley Systems product.

### PLS-POLE / PLS-CADD (Bentley Systems)
- **Format:** `.pole` files (PLS-POLE standalone) or embedded in `.lco` line
  files (PLS-CADD). Text-based structured format.
- **Key objects:** `POLE_SECTION` (diameter top/bottom, length, material),
  `WIRE_POINT` (attachment coordinates, wire label), `GUY` (attachment height,
  lead, direction, guy size), `LOAD_CASE` (wind, ice, temperature per NESC/GO95)
- **Analysis results:** Utilization ratio per component (pole, guy, anchor)
  per load case. PLS uses component-level stress vs. SPIDAcalc's groundline
  moment — BIS schema must accommodate both (see `PoleLoadingResult` TODO).
- **Insulator types from adapter:** PinInsulator → `"Pin"`, StrainInsulator → `"Deadend"`
- **Equipment category map:** `{"transformer": "TRANSFORMER", "streetlight": "STREET_LIGHT"}`
- **Ownership note:** PLS-POLE/PLS-CADD is a Bentley Systems product.

### O-Calc Pro (Osmose Utilities Services)
- **Format:** Proprietary `.ocalc` files (SQLite database internally) and PPLX XML export
- **Key objects:** Pole properties map closely to ANSI O5.1 (species, class,
  height, circumferences). Wire attachments include height, tension class,
  wire size (English units throughout). Guys include lead, direction, grade.
- **Analysis results:** Per-load-case pass/fail and utilization ratio
- **Equipment types inferred** by `_infer_equipment_type`: TRANSFORMER,
  STREET_LIGHT, CUTOUT_ARRESTOR, RISER (from description text matching)
- **Span direction:** CoordinateA in radians (CCW from East); convert to compass
  via `(90 - deg) % 360`. All UPM direction_deg fields use compass convention.
- **Span tension types:** "Slack" or "Static" (Static → "full" in UPM)
- **Ownership note:** Osmose Utilities Services is an independent company.

### UPM (Universal Pole Model)
- **Format:** Python/Pydantic models, serializable to JSON
- **Role:** Canonical internal representation all three external formats translate
  into before analysis. Primary reference for the BIS schema property set.

---

## Connector Integration Notes

When building a UPM → iModel connector using `@itwin/connector-framework`:

- `InitializeJob`: Import `ElectricDistribution.ecschema.xml` into the briefcase
- `OpenSourceData`: Read UPM JSON project file
- `ImportDomainSchema`: Register the `edist` schema
- `UpdateExistingData`: Map UPM entities to BIS classes:
  - `PoleModel.identity` + `PoleModel.geometry` → `edist:DistributionPole`
  - `PoleModel.crossarms` → `edist:Crossarm` (nested insulators → `edist:Insulator` children)
  - `PoleModel.guys` → `edist:GuyWire`; `PoleModel.span_guys` → `edist:SpanGuy`
  - `PoleModel.anchors` → `edist:AnchorAssembly`
  - `PoleModel.equipment` where `equipment_type == "TRANSFORMER"` → `edist:DistributionTransformer`
  - `PoleModel.equipment` (all others) → `edist:PoleEquipment`
  - `Insulator.spans` → `edist:OverheadConductor` (flattened from nested structure)
  - Loading results (from source tool `analysisResults`) → `edist:PoleLoadingAnalysis` + `edist:PoleLoadingResult` aspects
  - `PoleModel.clearance` → `edist:ClearanceCheck` elements + `edist:ClearanceSummary` aspect
  - `PoleModel.inspection` → `edist:PoleInspection`
  - `PoleModel.grounding` → `edist:GroundingConfiguration` aspect
  - `PoleModel.environment` → `edist:EnvironmentalDesignContext` aspect
  - `PoleModel.vegetation` → `edist:VegetationContext` aspect
  - `PoleModel.avian` → `edist:AvianProtectionContext` aspect
  - `PoleModel.service_networks` → `ServiceNetworkId` on `edist:DistributionTransformer` (interim)
- **MeasuredValue conversion:** Extract `value_si` from each UPM `MeasuredValue`;
  convert to BIS property unit. Preserve `source_value`/`source_unit` as custom
  attributes for round-trip losslessness.
- **Provenance:** Store UPM `source_ref.source_key` in the connector's external
  source ID map so changesets are incremental (not full re-sync on every run).
- **Geometry:** Convert pole `latitude`/`longitude` to iModel coordinate system;
  generate catenary curves for `edist:OverheadConductor` from span length and sag data.

---

## References

- BIS Schemas repo: `github.com/iTwin/bis-schemas`
- Write a Connector guide: `itwinjs.org/learning/writeaconnector`
- DistributionSystems schema: `itwinjs.org/bis/domains/distributionsystems.ecschema`
- BIS Organization: `itwinjs.org/bis/guide/intro/bis-organization`
- BIS Schema Release Process: `github.com/iTwin/bis-schemas/blob/master/docs/schema-release-process.md`
- ANSI O5.1: American National Standard for Wood Poles
- NESC C2-2023: National Electrical Safety Code (Rule 242, Rule 250B, Rule 261H)
- GO-95 Rule 42, Rule 43, Rule 44: California PUC General Order 95
- IEEE 738: Standard for Calculating the Current-Temperature Relationship of Bare
  Overhead Conductors (ampacity)
- IEEE C57.91: Guide for Loading Mineral-Oil-Immersed Transformers (thermal model)
- IEEE 142: Grounding of Industrial and Commercial Power Systems
- IEEE 1656: Guide for Testing the Electrical Performance of Insulating Cover-Up
  Equipment (avian protection)
- RUS Bulletin 1724E-200: Design Manual for High Voltage Transmission Lines

---

## Changelog — UPM Audit (2026-06-19)

This section records what changed from the original draft after cross-referencing
against the UPM source in `domain/`.

### Property name corrections

| Class | Old property | New property | UPM field |
|---|---|---|---|
| `DistributionPoleType` | `PoleHeight` | `ManufacturedHeight` | `PoleGeometry.manufactured_height` |
| `DistributionPole` | `SettingDepth` | `SetDepth` | `PoleGeometry.set_depth` |
| `DistributionPole` | `TipCircumference` | `PoleTipCircumference` | `PoleGeometry.pole_top_circumference` |
| `DistributionPoleType` | `NominalTipDiameter` | `NominalTipCircumference` | UPM stores circumference not diameter |
| `DistributionPoleType` | `NominalGroundlineDiameter` | `NominalGroundlineCircumference` | UPM stores circumference not diameter |
| `PoleAttachment` | `MountHeight` | `AttachmentHeight` | matches UPM `attachment_height` field |
| `DistributionTransformer` | `Phase` | `PhaseConfig` | `TransformerNameplate.phase_config` |
| `DistributionTransformer` | `KVARating` | `RatedKva` | `TransformerNameplate.rated_kva` |
| `DistributionTransformer` | `PrimaryVoltage` | `PrimaryVoltageKv` | `TransformerNameplate.primary_voltage_kv` |
| `DistributionTransformer` | `SecondaryVoltage` | `SecondaryVoltageV` | `TransformerNameplate.secondary_voltage_v` |
| `PoleInspection` | `OverallRating` | `Verdict` | `InspectionSection.verdict` |
| `PoleInspection` | `InspectionDate` (via `dateTime`) | `InspectionDate` | `InspectionSection.last_inspection_date` |

### Missing fields added

| Class | New property | UPM source |
|---|---|---|
| `DistributionPole` | `Elevation` | `PoleGeometry.elevation_m` |
| `DistributionPole` | `HeadingDegrees` | `PoleGeometry.heading_deg` |
| `DistributionPole` | `GpsAccuracyMeters` | `PoleGeometry.gps_accuracy_m` |
| `DistributionPole` | `StructureName` | `PoleIdentity.structure_name` |
| `Insulator` | `VerticalOffset` | `Insulator.vertical_offset` |
| `Insulator` | `HorizontalOffset` | `Insulator.horizontal_offset` |
| `Insulator` | `CrossarmId` | `Insulator.crossarm_id` |
| `Crossarm` | `ArmSide` | `Crossarm.side` / `FramingBreakdown.crossarm_structure` |
| `OverheadConductor` | `WireId`, `RotationDegrees`, `EndpointType`, `TensionGroup` | `Span` fields |
| `DistributionTransformer` | `CoolingClass` | `TransformerNameplate.cooling_class` |
| `DistributionTransformer` | `ConnectionType` | `TransformerNameplate.connection_type` |
| `DistributionTransformer` | `LossRatioR` | `TransformerNameplate.loss_ratio_R` |
| `DistributionTransformer` | `ActualLoadKva` | `TransformerNameplate.actual_load_kva` |
| `DistributionTransformer` | `RatedTopOilRiseC` | `TransformerNameplate.rated_top_oil_rise_c` |
| `DistributionTransformer` | `RatedHottestSpotRiseC` | `TransformerNameplate.rated_hottest_spot_rise_c` |
| `DistributionTransformer` | `BottomHeight` | `Equipment.bottom_height` |
| `ClearanceCheck` | `TableId`, `ClearanceTypeId`, `Dimension`, `SameSupport`, `SubjectAttachmentId`, `ObjectAttachmentId`, `SubjectVoltageV`, `ObjectVoltageV`, `ClearanceDelta` | `ClearanceCheck` + `ClearanceRelationship` fields |
| `PoleInspection` | `InspectionProgram`, `SoundTestResult`, `BoreholeTestResult`, `GroundlineDecayPct`, `ResidualStrengthPct`, `ShellThicknessIn`, `TreatedBool`, `TreatmentType`, `LastTreatmentDate`, `ConditionFactor`, `OrigCircumferenceIn`, `CurrentCircumferenceIn`, `EffectiveCircumferenceIn`, `GlShellAvgIn`, `WoodStrengthPct` | `InspectionSection` + `InspectionRecord` (pge_ptt.py) |
| `LoadCaseDefinition` | `NescGrade`, `GO95Grade`, `NescDistrict`, `GO95Zone`, `ConstructionType`, `NescRevision`, `GO95Revision` | grades.py + zones.py Literals |

### New classes added

| Class | Reason |
|---|---|
| `edist:SpanGuy` | UPM has `SpanGuy` (pole-to-pole guy); absent from original draft |
| `edist:PoleEquipment` | General equipment class; original draft only had `DistributionTransformer` |
| `edist:ClearanceSummary` | UPM `ClearanceSummary` block; pole-level rollup |

### New gaps added

| Gap | Description |
|---|---|
| Gap 6 | Grounding configuration (IEEE 142) |
| Gap 7 | Environmental design context (IEEE 738, C57.91) |
| Gap 8 | Vegetation clearance context |
| Gap 9 | Avian protection context (IEEE 1656) |
| Gap 10 | Service network references |

### Enum corrections

| Enum | Change |
|---|---|
| `AnalysisStandard` → split | `AnalysisCode` + `NescGrade` + `GO95Grade` (standard and grade are orthogonal axes) |
| `InsulatorType` | PinType/PostType/SuspensionType/DeadEndType/StrainType → **Pin/Deadend/Clamp/Bracket/Unknown** (union across all adapters) |
| `ConductorType` → `ConductorUsageGroup` | Extended to full UPM usage group set; Guy removed |
| `InspectionOverallRating` → `InspectionVerdict` | Satisfactory/Marginal/Unsatisfactory/Condemned → **Pass/Marginal/Fail** (matches UPM Literal) |
| `FindingSeverity` | Minor/Moderate/Severe/Critical → **Info/Warning/Error/Critical** (matches UPM Literal) |
| New: `NescDistrict` | HEAVY/MEDIUM/LIGHT/WARM_ISLAND_UNDER_9000_FT/WARM_ISLAND_OVER_9000_FT (from zones.py) |
| New: `GO95Zone` | HEAVY/LIGHT (from zones.py) |
| New: `ConstructionType` | Install/Replacement (from grades.py `InstallType`). Connector maps BOTH `"install"`/`"replacement"` (grades.py) AND `"NEW"`/`"REPLACEMENT"` (load_case_builder.py) to this enum. |
| Removed: ~~`RecommendedAction`~~ | Original: None/Monitor/Reinforce/Replace/Emergency. **Removed** — UPM `InspectionSection.recommendation` is `Optional[str]` (freeform). Replaced by a plain string property; enum values would truncate real utility text. |
| New: `TransformerCoolingClass` | ONAN/ONAF/ODAF (from TransformerNameplate Literal) |
| New: `TransformerPhaseConfig` | SinglePhase/ThreePhase |
| New: `CrossarmSide` | Single/Double/Mixed/Unknown (from FramingBreakdown Literal) |
| New: `ClearanceDimension` | Vertical/Horizontal/Radial/Unknown (from ClearanceRelationship Literal) |
| New: `EquipmentType` | Union of equipment_type strings across SPIDA/OCalc/PLS adapters |
| New: `FireThreatZone` | None/Tier2/Tier3 (from EnvironmentalDesignContext Literal) |

### TODO callouts added

| Location | TODO |
|---|---|
| Gap 1 | LeanAngle/LeanDirection — not in UPM; field-survey-only |
| Gap 1 | `PoleIdentity.source_ref` — no BIS property; handled by connector external source ID map |
| Gap 2 | Tension limits (Rule 261H) — computed, not stored; document in rationale.md |
| Gap 2 | PLS-POLE multi-component utilization — may need additional aspects |
| Gap 3 | `AnchorRating` removed — no UPM source; `SoilClass` moved to grounding |
| Gap 3 | `GuyWire` detailed properties from `metadata` — confirm adapter extraction |
| Gap 9 | ~~`AvianContext.in_avian_zones: List[str]`~~ — **resolved**: `edist:AvianZone` definition element + `edist:PoleIsInAvianZone` relationship (option b). Connector upserts zone by ZoneId, inserts one relationship per entry. |
| Gap 10 | `ServiceNetworkRef` — placeholder `ServiceNetworkId` string until services schema exists |
