---
noEditThisPage: true
remarksTarget: AecValueStructs.ecschema.md
---

# AecValueStructs

This schema contains structs that define a single logical value in terms of all its members together.

## Entity Classes

### BoundedPressureValue

A struct that can be used to define properties with a bounded pressure value, that is, which have a maximum of two numeric values assigned, the first value specifying the upper bound and the second value specifying the lower bound. A set point pressure value can also be provided in addition to the upper and lower bound values in order to capture a typical pressure value for the property.

### BoundedTemperatureValue

A struct that can be used to define properties with a bounded temperature value, that is, which have a maximum of two numeric values assigned, the first value specifying the upper bound and the second value specifying the lower bound. A set point temperature value can also be provided in addition to the upper and lower bound values in order to capture a typical temperature value for the property.