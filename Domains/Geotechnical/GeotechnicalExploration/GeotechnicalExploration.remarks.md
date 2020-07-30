---
remarksTarget: GeotechnicalExploration.ecschema.md
---

# GeotechnicalExploration

**alias:** GeoExp

The `GeotechnicalExploration` schema defines classes that represent geotechnical field explorations, the data collected in those explorations, and related laboratory results.

Most `GeotechnicalExploration` Elements are spatial in nature and tend to be placed in `PhysicalModel`s. The configuration information associated with an exploration is placed in `DefinitionModel`s. Typically, the relevant `PhysicalModel` and `DefinitionModel` will fall under the same `Subject`, but that is not required. A simplified representation of this information organization is:

- `Subject`
  - `PhysicalPartition` (and its `PhysicalModel`)
    - `GeotechnicalInvestigation`
      - ...
      - ...
  - `DefinitionPartition` (and its `DefinitionModel`)
    - `GeotechnicalInvestigationConfiguration` (and its `DefinitionModel`)
      - ...
      - ...

Many of the concepts in the GeotechnicalExploration schema correspond directly to concepts in the AGS Electronic Transfer of Geotechnical and Geoenvironmental Data standard (AGS4, at the time of this writing). The correspondence is noted in class and property descriptions.

The data defined using the `GeotechnicalExploration` schema tends to be used downstream in the the `GeotechnicalInterpretation` schema; the relationships between the two schemas are defined in the `GeotechnicalInterpretation` schema.

## Entity Classes

### GeotechnicalInvestigationElement

`GeotechnicalInvestigationElement` exists to unify and organize the primary data tree under a `GeotechnicalInvestigation`.

Detailed geotechnical data - such as laboratory result or `ExploratoryLocation` details - that is only valid in a particular context may not be `GeotechnicalInvestigationElement`s (other parent classes may be used).

### GeotechnicalInvestigationBreakdown

`GeotechnicalInvestigationBreakdown` exists to breakdown a `GeotechnicalInvestigation` into a hierarchy. The `GeotechnicalInvestigationBreakdown` can be used directly as a "folder". The only expected subclass is `GeotechnicalInvestigation`, which is effectively the top-level folder.

### GeotechnicalInvestigation

A `GeotechnicalInvestigation` represents an entire consistent and coherent geotechnical field and laboratory investigation.

A `GeotechnicalInvestigation` is the head of a tree formed by parent and child `Element`s. That tree contains all the exploration and laboratory data that is is part of the investigation, and has a structure generally similar to this:

- `GeotechnicalInvestigation`
  - `GeotechnicalInvestigationBreakdown`
    - `ExploratoryLocation`
    - `ExploratoryLocation`
  - `GeotechnicalInvestigationBreakdown`
    - `GeotechnicalInvestigationBreakdown`
      - `ExploratoryLocation`
      - `ExploratoryLocation`
    - `GeotechnicalInvestigationBreakdown`
      - `ExploratoryLocation`
      - `ExploratoryLocation`
    - `ExploratoryLocation`

Each `ExploratoryLocation` will have many child `Element`s that are not shown in the tree above.

Every `GeotechnicalInvestigation` has a reference to an `InvestigationConfiguration` that provides the settings and parameters used for the investigation.

The `EastingOffset`, `NorthingOffset` and `ElevationOffset` properties define the distances from the repository (iModel) origin to the `GeotechnicalInvestigation` reference origin. These are only non-zero when the `GeotechnicalInvestigation` information is derived from or synchronized with a repository with a different native origin. See `ExploratoryLocation` for how these properties are applied to calculate locations.

### GeotechnicalInvestigationConfiguration

A `GeotechnicalInvestigationConfiguration` is a collection of settings that are used to define `Element`s in a `GeotechnicalInvestigation`. All of the settings are stored in the submodel of the `GeotechnicalInvestigationConfiguration`. Most settings correspond to "picklist" items.

For most picklist items, the list is determined by the `Element`s of a particular class that are contained in the `GeotechnicalInvestigationConfiguration` submodel. For example, the available geology codes for a `FieldGeologicalDescription` are found by searching for all of the `GeologyCode` `Element`s in the `GeotechnicalInvestigationConfiguration` submodel.

For consistency between the `GeotechnicalInvestigation` and its `GeotechnicalInvestigationConfiguration`, all `Element`s that are in a `GeotechnicalInvestigation` parent-child tree must only refer to `DefinitionElement`s in the owning `GeotechnicalInvestigation`'s `GeotechnicalInvestigationConfiguration` submodel.

### ExploratoryLocation

An `ExploratoryLocation` represents both the exploration itself (usually a borehole) and the location of the exploration. `Element`s that record information related to an `ExploratoryLocation` are almost always child `Element`s of the `ExploratoryLocation`.

While `ExploratoryLocation` is not a sealed class, subclasses of it are not expected. The `Method` relationship (to an `ExploratoryLocationMethod`) is used to determine the method (or methods) used at the `ExploratoryLocation`.

#### Expected Child Elements

`ExploratoryLocation`s (after the exploration is finished) will generally contain the following child `Elements`:

- At least one `Inclination` (otherwise the orientation of the exploration is not known)
- At least one `FieldGeologicalDescription` (an exception might be if the exploration was only concerned with `WaterStrike`s)

If the `Origin` of the `ExploratoryLocation` changes, the `Origin`s of most of its children will need to be updated.

#### Geometry and Location

The `Latitude`/`Longitude` and `Easting`/`Northing` properties are effectively duplicate data which must be kept consistent.

***Need future discussion on if we can remove `Easting`, `Northing` ***

The `Easting`, `Northing` and `GroundLevel` properties are defined relative to the owning `GeotechnicalInvestigation`. The table shows the calculation of the coordinate values for an `ExploratoryLocation`:

| iModel Coordinate | Calculation                                                  |
|-------------------|--------------------------------------------------------------|
| x                 | `Easting`      + `GeotechnicalInvestigation.EastingOffset`   |
| y                 | `Northing`     + `GeotechnicalInvestigation.NorthingOffset`  |
| z                 | `GroundLevel`  + `GeotechnicalInvestigation.ElevationOffset` |

The `Origin` of the `ExploratoryLocation` should be set at the x, y, z value in the above table.

The `GeometryStream` of the `ExploratoryLocation` should contain:

| Condition | GeometryStream contents                                                      |
|-----------|------------------------------------------------------------------------------|
| Planned   | A 3D point for the planned location.                                         |
| Completed | A 3D line segment or polyline showing the path of the `ExploratoryLocation`. |

#### AGS Mappings

AGS mappings for the properties (including navigation properties) are:

| Property         | AGS Field | Remarks                                        |
|------------------|-----------|------------------------------------------------|
| `Easting`        | LOCA_NATE |                                                |
| `Northing`       | LOCA_NATN |                                                |
| `GroundLevel`    | LOCA_GL   |                                                |
| `Latitude`       | LOCA_LAT  |                                                |
| `Longitude`      | LOCA_LON  |                                                |
| `FinalDepth`     | LOCA_FDEP |                                                |
| `StartDate`      | LOCA_STAR |                                                |
| `EndDate`        | LOCA_ENDD |                                                |
| `Remarks`        | LOCA_REM  |                                                |
| `Method`         | LOCA_TYPE | Reference to `ExploratoryLocationMethod`       |
| `Status`         | LOCA_STAT | Reference to `ExploratoryLocationStatus`       |

### ExploratoryLocationMethod

`ExploratoryLocationMethod` instances are always contained in a submodel of a `GeotechnicalInvestigationConfiguration`.

`ExploratoryLocationMethod`s are used to define the method (or methods) used for an `ExploratoryLocation`.  `ExploratoryLocationMethod`s are commonly referenced by more than one `ExploratoryLocation`. The inherited `UserLabel` property contains the user-specified name that corresponds to an AGS LOCA_TYPE value.

See `GeotechnicalExplorationConfiguration` for more information on the constraints of the applicability of `ExploratoryLocationMethod`s.

### ExploratoryLocationStatus

`ExploratoryLocationStatus` instances are always contained in a submodel of a `GeotechnicalInvestigationConfiguration`.

`ExploratoryLocationStatus`es are used to define the status of an `ExploratoryLocation`. `ExploratoryLocationStatus`es are commonly referenced by more than one `ExploratoryLocation`.  The inherited `UserLabel` property contains the user-specified name that corresponds to an AGS LOCA_STAT value.

See `GeotechnicalExplorationConfiguration` for more information on the constraints of the applicability of `ExploratoryLocationStatus`s.

### DepthRangeInformation

`DepthRangeInformation` instances are always child `Element`s of an `ExploratoryLocation`.

`DepthTop` generally corresponds to an AGS field with the suffix "_TOP". `DepthBase` generally corresponds to an AGS field with the suffix "_BASE". Depths are measured along the hole path, so they do not correspond to true depths if the hole is not vertical.

`DepthRangeInformation` exists for these reasons:

- To define a common base class for `ExploratoryLocation` children that have a `DepthTop` and `DepthBase`.
- To provide an endpoint for `ExploratoryLocationOwnsDepthRangeInformation` relationship that clarifies that `DepthRangeInformation`s are always child `Element`s of `ExploratoryLocation`s.

The `Origin` of a `DepthRangeInformation` should always be the same as the `Origin` of its owning `ExploratoryLocation`.

The `GeometryStream` of a `DepthRangeInformation` should contain either a 3D line segment or a 3D polyline. The geometry can be calculated from:

- The `Inclination` children of the `ExploratoryLocation`,
- The `DepthTop` and `DepthBase` properties.

If any of the above items changes, the `GeometryStream` will need to be recalculated.

### DepthInformation

`DepthInformation` instances are always child `Element`s of an `ExploratoryLocation`.

`Depth` generally corresponds to an AGS field with the suffix "_DPTH" (such as "WSTG_DPTH").  Depths are measured along the hole path, so they do not correspond to true depths if the hole is not vertical.

`DepthInformation` exists for these reasons:

- To define a common base class for `ExploratoryLocation` children that have a `Depth`.
- To provide an endpoint for `ExploratoryLocationOwnsDepthInformation` relationship that clarifies that `DepthInformation`s are always child `Element`s of `ExploratoryLocations`s.

The `Origin` of a `DepthInformation` should always be the same as the `Origin` of its containing `ExploratoryLocation`.

The `GeometryStream` of a `DepthInformation` should contain a 3D point. The point can be calculated from:

- The `Inclination` children of the `ExploratoryLocation`,
- The `Depth` property.

If any of the above items changes, the `GeometryStream` will need to be recalculated.

### Inclination

`Inclination` instances are always child `Element`s of an `ExploratoryLocation`.

Inclination Elements define the path of the ExploratoryLocation (typically a borehole) and hence are essential to locate in 3D space all of the depth-related information of an `ExploratoryLocation`.

AGS mappings for the properties (including navigation properties) are:

| Property      | AGS Field | Remarks                            |
|---------------|-----------|------------------------------------|
| `Parent`      | LOCA_ID   | Defined in `Element`               |
| `DepthTop`    | HORN_TOP  | Defined in `DepthRangeInformation` |
| `DepthBase`   | HORN_BASE | Defined in `DepthRangeInformation` |
| `Orientation` | HORN_ORNT |                                    |
| `Inclination` | HORN_INCL |                                    |
| `Remarks`     | HORN_REM  |                                    |

### FieldGeologicalDescription

`FieldGeologicalDescription` instances are always child `Element`s of an `ExploratoryLocation`.

AGS mappings for the properties (including navigation properties) are:

| Property               | AGS Field  | Remarks                                            |
|------------------------|------------|----------------------------------------------------|
| `Parent`               | LOCA_ID    | Defined in `Element`                               |
| `DepthTop`             | GEOL_TOP   | Defined in `DepthRangeInformation`                 |
| `DepthBase`            | GEOL_BASE  | Defined in `DepthRangeInformation`                 |
| `Description`          | GEOL_DESC  |                                                    |
| `Remarks`              | GEOL_REM   |                                                    |
| `LegendCode`           | GEOL_LEG   |                                                    |
| `UscsCode`             | (none)     | "Uscs" refers to United Soil Classification System (TEMPORARILY NOT USED) |
| `GeologyCode`          | GEOL_GEOL  |                                                    |
| `AlternateGeologyCode` | GEOL_GEO2 |                                                    |

### LegendCode

`LegendCode` instances are always contained in a submodel of a `GeotechnicalInvestigationConfiguration`.

`LegendCode`s are used as *picklist* values for `FieldGeologicDescription`s. The inherited `UserLabel` property contains the user-specified name that corresponds to an AGS GEOL_LEG value.

See `GeotechnicalExplorationConfiguration` for more information on the constraints of the applicability of `LegendCode`s.

<!--
### UscsCode

XXXXXXXXXX TO DO XXXXXXXXXXXX
-->

### GeologyCode

`GeologyCode` instances are always contained in a submodel of a `GeotechnicalInvestigationConfiguration`.

`GeologyCode`s are used as *picklist* values for `FieldGeologicDescription`s. The inherited `UserLabel` property is contains the user-specified name that corresponds to an AGS GEOL_GEOL value.

See `GeotechnicalExplorationConfiguration` for more information on the constraints of the applicability of `GeologyCode`s.

### AlternateGeologyCode

`AlternateGeologyCode` instances are always contained in a submodel of a `GeotechnicalInvestigationConfiguration`.

`AlternateGeologyCode`s are used as *picklist* values for `FieldGeologicDescription`s. The inherited `UserLabel` property contains the user-specified name that corresponds to an AGS GEOL_GEO2 value.

See `GeotechnicalExplorationConfiguration` for more information on the constraints of the applicability of `AlternateGeologyCode`s.

### MethodByDepth

`MethodByDepth` instances are always child `Element`s of an `ExploratoryLocation`.

AGS mappings for the properties (including navigation properties) are:

| Property               | AGS Field  | Remarks                                            |
|------------------------|------------|----------------------------------------------------|
| `Parent`               | LOCA_ID    | Defined in `Element`                               |
| `DepthTop`             | HDPH_TOP   | Defined in `DepthRangeInformation`                 |
| `DepthBase`            | HDPH_BASE  | Defined in `DepthRangeInformation`                 |
| `StartDate`            | HDPH_STAR  |                                                    |
| `EndDate`              | HDPH_ENDD  |                                                    |
| `Method`               | HDPH_TYPE  |                                                    |

### Method

`Method` instances are always contained in a submodel of a `GeotechnicalInvestigationConfiguration`.

`Method`s are used as *picklist* values for `MethodByDepth`s. The inherited `UserLabel` property contains the user-specified name that corresponds to an AGS HDPH_TYPE value.

See `GeotechnicalExplorationConfiguration` for more information on the constraints of the applicability of `Method`s.

### WaterStrike

`WaterStrike` instances are always child `Element`s of an `ExploratoryLocation`.

AGS mappings for the properties (including navigation properties) are:

| Property               | AGS Field  | Remarks                                            |
|------------------------|------------|----------------------------------------------------|
| `Parent`               | LOCA_ID    | Defined in `Element`                               |
| `Depth`                | WSTG_DPTH  | Defined in `DepthInformation`                      |
| `Remarks`              | WSTG_REM   |                                                    |
| `Date`                 | WSTG_DTIM  |                                                    |

### WaterStrikeObservationTime

`WaterStrikeObservationTime` instances are always contained in a submodel of a `GeotechnicalInvestigationConfiguration`.

`WaterStrikeObservationTime`s are used as *picklist* values for `WaterStrike`s.  The inherited `UserLabel` property contains the user-specified name. Examples of typical names are "After Drilling", "At time of Drilling" and "End of Drilling".

See `GeotechnicalExplorationConfiguration` for more information on the constraints of the applicability of `WaterStrikeObservationTime`s.

## Relationship Classes
