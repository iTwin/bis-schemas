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
