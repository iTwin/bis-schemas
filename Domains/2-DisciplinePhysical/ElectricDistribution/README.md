# ElectricDistribution

A [BIS](https://www.itwinjs.org/bis/guide/) domain schema for overhead electric
distribution infrastructure — poles, attachments, conductors, transformers,
structural loading analysis, field inspection, and clearance checking.

**Layer:** 2-DisciplinePhysical
**Schema name:** `ElectricDistribution` · alias `edist` · version `01.00.00`

The physical classes extend the shared **`PowerSystemResourcesPhysical`** (`psrp`)
base, so electric distribution is a sub-domain of the common power-system schema
alongside substation rather than a parallel one.

---

## Contents

### Physical Elements

| Class | Base | Notes |
|---|---|---|
| `DistributionPole` | `psrp:Structure` + `dsys:IDistributionElement` | Primary structural host |
| `PoleAttachment` | `psrp:AuxiliaryEquipment` (abstract) | Base for all pole-mounted hardware |
| `Crossarm` | `PoleAttachment` | Horizontal timber or steel arm |
| `Insulator` | `PoleAttachment` | Pin, disc, or deadend insulator |
| `SpanGuy` | `PoleAttachment` | Guy attachment point on the pole |
| `GuyWire` | `PoleAttachment` | Tensioned cable from pole to anchor |
| `AnchorAssembly` | `psrp:Foundation` | Ground anchor terminating a guy wire |
| `OverheadConductor` | `psrp:Equipment` (inherits `dsys:IDistributionFlowElement`) | Primary, neutral, or secondary wire |
| `DistributionTransformer` | `PoleAttachment` (inherits `dsys:IDistributionFlowElement`) | Single- or three-phase transformer |
| `PoleEquipment` | `PoleAttachment` | Capacitors, regulators, switches, arresters |

### Type Catalog

| Class | Base |
|---|---|
| `DistributionPoleType` | `bis:PhysicalType` |

### Analytical Elements

| Class | Base |
|---|---|
| `PoleLoadingAnalysis` | `anlyt:AnalyticalElement` |
| `ClearanceCheck` | `anlyt:AnalyticalElement` |

### Information Records

| Class | Base |
|---|---|
| `PoleInspection` | `bis:InformationRecordElement` |
| `ClearanceViolation` | `bis:InformationRecordElement` |

### Aspects

| Class | Kind | Host |
|---|---|---|
| `GroundingConfiguration` | UniqueAspect | `DistributionPole` |
| `EnvironmentalDesignContext` | UniqueAspect | `DistributionPole` |
| `VegetationContext` | UniqueAspect | `DistributionPole` |
| `AvianProtectionContext` | UniqueAspect | `DistributionPole` |
| `ClearanceSummary` | UniqueAspect | `DistributionPole` |
| `PoleLoadingResult` | MultiAspect | `PoleLoadingAnalysis` |
| `InspectionFinding` | MultiAspect | `PoleInspection` |
| `ConductorSagCondition` | MultiAspect | `OverheadConductor` |

### Definition Elements

`AvianZone`, `LoadCaseDefinition`, `ClearanceRequirement`

### Enumerations (25)

`PoleMaterial`, `PoleConditionRating`, `CrossarmMaterial`, `CrossarmSide`, `AnchorType`, `InsulatorType`, `ConductorUsageGroup`, `ConductorSagConditionType`, `GuyGrade`, `InspectionMethod`, `InspectionVerdict`, `FindingType`, `FindingSeverity`, `ClearanceDimension`, `ClearanceSeverity`, `AnalysisCode`, `NescGrade`, `GO95Grade`, `NescDistrict`, `GO95Zone`, `ConstructionType`, `TransformerCoolingClass`, `TransformerPhaseConfig`, `EquipmentType`, `FireThreatZone`

### Custom KindOfQuantity

| Name | Persistence unit | Notes |
|---|---|---|
| `EDIST_RESISTANCE` | `u:OHM` | Grounding resistance |
| `EDIST_RESISTIVITY` | `u:OHM_M` | Soil resistivity |

All other quantities use `AECU:` KindOfQuantities from AecUnits.

---

## Schema References

| Schema | Version | Alias |
|---|---|---|
| BisCore | 01.00.25 | `bis` |
| Analytical | 01.00.02 | `anlyt` |
| DistributionSystems | 01.00.02 | `dsys` |
| PowerSystemResourcesPhysical | 01.00.02 | `psrp` |
| AecUnits | 01.00.03 | `AECU` |
| Units | 01.00.06 | `u` |
| Formats | 01.00.00 | `f` |
| CoreCustomAttributes | 01.00.04 | `CoreCA` |
| BisCustomAttributes | 01.00.00 | `bisCA` |

Versions are aligned to the requirements of `PowerSystemResourcesPhysical 01.00.02`.
Units 01.00.06 is the minimum released version containing `u:OHM_M` (electrical resistivity).

---

## Validating

From the repository root:

```bash
npm run validateSchemas -- --name ElectricDistribution --wip
```

Expected output: `Schema Validation Succeeded. No rule violations found.`

---

## Design

See [design.md](./design.md) for full property tables, the overhead-distribution
field mapping, enumeration value rationale, relationship descriptions, and the
open design decisions / alternatives considered.

The schema's property set and enumeration values were derived from the data
models of the three dominant overhead distribution analysis tools — SPIDAcalc
(SPIDA/JSON), PLS-POLE / PLS-CADD, and O-Calc Pro (PPLX/XML) — and cover NESC and
GO-95 jurisdictions.

---

Proposed by Julius Guay IV, Bentley Systems.
