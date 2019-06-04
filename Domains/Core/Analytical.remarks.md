---
noEditThisPage: true
remarksTarget: Analytical.ecschema.md
---

# Analytical

Contains the core classes which define the base classes used by specialized BIS Analytical Domain schemas, such as Hydraulic analysis, Structural analysis, Thermal analysis, etc. This schema is not meant to cover Analytical Results or Scenario Analysis, which will be addressed separately in the future.

Each specialized BIS Analytical Domain is expected to introduce subclasses for anlyt:AnalyticalPartition, anlyt:AnalyticalModel, anlyt:AnalyticalElement and, if needed, anlyt:AnalyticalType.

### AnalyticalElement

anlyt:AnalyticalElement is expected to be subclassed by specialized BIS Analytical Domain schemas.

### AnalyticalModel

anlyt:AnalyticalModel is expected to be subclassed by specialized BIS Analytical Domain schemas.

### AnalyticalPartition

anlyt:AnalyticalPartition is expected to be subclassed by specialized BIS Analytical Domain schemas.

### AnalyticalType

anlyt:AnalyticalType can be optionally subclassed by specialized BIS Analytical Domain schemas. It is not meant to replace cases better covered by a bis:PhysicalType, but rather augmenting it with data needed for a specialized analysis. E.g. an analytical pump should refer to a physical pump type, augmenting it with data needed for a specialized analysis. In the case of a Hydraulic Analysis, for instance, such data could entail classes covering Operating Pump Curves.

A catalog of Storm Events to be used in a Hydrological analysis is an example where introducing a subclass of anlyt:AnalyticalType is more appropriate.

### AnalyticalElementIsOfType

It is meant to be used to relate anlyt:AnalyticalType instances that are not better represented by a bis:PhysicalType instance. E.g. an analytical Storm instance used in a Hydrological Analysis is of type N-years Storm Event.

### AnalyticalSimulatesSpatialElement

E.g. An analytical pump station in a Hydraulic analysis can be related with all the physical pumps it is simulating.