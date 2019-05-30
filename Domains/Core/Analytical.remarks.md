---
noEditThisPage: true
remarksTarget: Analytical.ecschema.md
---

# Analytical

Contains the core classes which define the base classes used by specialized BIS Analytical Domain schemas. This schema is not meant to cover Analytical Results or Scenario Analysis, which will be addressed separately in the future.

A specialized BIS Analytical Domain is expected to introduce subclasses for anlyt:AnalyticalPartition, anlyt:AnalyticalModel, anlyt:AnalyticalElement and, if needed, anlyt:AnalyticalType.

# AnalyticalElement

anlyt:AnalyticalElement is expected to be subclassed by specialized BIS Analytical Domain schemas.

# AnalyticalModel

anlyt:AnalyticalModel is expected to be subclassed by specialized BIS Analytical Domain schemas.

# AnalyticalPartition

anlyt:AnalyticalPartition is expected to be subclassed by specialized BIS Analytical Domain schemas.

# AnalyticalType

anlyt:AnalyticalType can be optionally subclassed by specialized BIS Analytical Domain schemas. It is not meant to replace cases better covered by a bis:PhysicalType. E.g. an analytical pump should refer to a physical pump type, augmenting it with data needed for a specialized analysis. In the case of a Hydraulic Analysis, for instance, such data could entail classes covering Pump Curves.

A catalog of Storm Events to be used in a Hydrological analysis is an example where introducing a subclass of anlyt:AnalyticalType is more appropriate.
