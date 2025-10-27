---
noEditThisPage: true
remarksTarget: DefaultToolsUnits.ecschema.md
---

# DefaultToolsUnits

The `DefaultToolsUnits` schema provides a standardized set of unit definitions for default tools and components used across multiple iTwin applications. This schema is designed to support domain-agnostic functionality such as generic drawing tools, presentation layers, property panels, and cross-application utilities that require consistent unit measurements.

## Purpose

This schema serves as a foundation for:

- **Default Tool Configurations**: Provides unit definitions for tools that operate across multiple domains
- **Cross-Application Consistency**: Ensures consistent unit handling in shared components and libraries
- **Generic Presentation**: Supports visualization and display components that are not domain-specific
- **Platform Services**: Enables iTwin platform services to work with standardized units

## Usage Guidelines

### When to Use DefaultToolsUnits

Use this schema when:

- Developing tools or components that need to work across multiple domains
- Building presentation or visualization features not tied to a specific discipline
- Creating platform utilities that require basic measurement types
- Implementing generic property editors or inspectors

### When NOT to Use DefaultToolsUnits

Do not use this schema when:

- Working within a specific domain (e.g., Civil, Structural, MEP) - use domain-specific unit schemas instead (e.g., `CivilUnits`, `AecUnits`)
- Domain-specific units or specialized measurements are required
- More precise or specialized KindOfQuantity definitions are needed for your discipline

## Relationship to Other Unit Schemas

`DefaultToolsUnits` complements but does not replace domain-specific unit schemas:

- **AecUnits**: For Architecture, Engineering, and Construction domain
- **CivilUnits**: For Civil engineering applications (roads, drainage, surveying)
- **RoadRailUnits** (deprecated): Legacy civil infrastructure units

Applications should reference the most appropriate unit schema for their specific needs. Multi-domain applications may reference multiple unit schemas as needed.

## KindOfQuantity

### LENGTH

General linear distance measurements for basic dimensional calculations. Uses meter (M) as the persistence unit with presentation formats supporting both metric (M, MM) and imperial (FT) units with high precision (4 decimal places) suitable for detailed measurements.

### LENGTH_COORDINATE

Specialized length measurements for coordinate systems and spatial positioning, with higher precision suitable for geospatial applications. Includes kilometer (KM) presentation format for large-scale coordinates and uses a relative error of 0.0001 for coordinate accuracy.

### AREA

Surface area measurements for general 2D calculations, supporting both square meters and square feet presentation units. Designed for basic area computations across different measurement systems.

### VOLUME

Volumetric measurements for 3D space calculations, supporting both cubic meters and cubic feet presentation units. Used for general volume computations in various applications.

### ANGLE

Angular measurements for rotations and orientations, using radians as the persistence unit with presentation options for degrees (decimal) and degrees-minutes-seconds (DMS) format. Supports both engineering and surveying angle display conventions.

### TIME

Time measurements for durations and intervals, using seconds as the persistence unit with presentation options for seconds, minutes, and hours. Suitable for timing operations and duration tracking.

### PERCENTAGE

Percentage values for proportional measurements and statistical calculations, supporting both percent (%) and decimal percent formats. Uses decimal percent as the persistence unit for consistency across calculations.
