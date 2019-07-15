---
noEditThisPage: true
remarksTarget: CoreCustomAttributes.ecschema.md
---

# CoreCustomAttributes

## ProductionStatusValue

The `ProductionStatusValue` enumerations are use in the `ProductionStatus` `CustomAttribute` to declare the schema author's intended and supported workflows for the schema.

### Production

`Production` declares that this schema is suitable for use in production workflows. Data created using this schema will be supported long-term (possibly through transformation).

### FieldTesting

`FieldTesting` declares that this schema is suitable for field testing of production workflows. Data created using this schema may not be supported long-term and may not be upgradable.

### NotForProduction

`NotForProduction` declares that this schema is under development and should never be used for production workflows or by end users at all. Data created with this schema is not supported and may not be upgradable.

### Deprecated

`Deprecated` declares that this schema is no longer recommended for production workflows. Better alternatives exist and should be used instead. `Deprecated` schemas must have been in `Production` at some previous point in time. Note that the `Deprecated` `CustomAttribute` should also be used, and can be used to provide a detailed message.

## ProductionStatus

The `ProductionStatus` `CustomAttribute` is used by the schema author to declare the suitability of a schema for use in production and other workflows. When a schema is tagged with `ProductionStatus`, the iModel technology stack (or other technology stacks in other circumstances) can proactively prevent schemas from being used in unsupported workflows. The two most obvious usages of this `CustomAttribute` are:

- Preventing development (`NotForProduction`) schemas from being released to customers.
- Preventing `FieldTesting` schemas from being used in customer's production workflows.

All schemas should be tagged with the `ProductionStatus` `CustomAttribute` to enable this error checking.

### SupportedUse

The SupportedUse property is used to specify the appropriate `ProductionStatusValue` for the schema. Note that selection of the `Production` for a schema implies a commitment to provide a smooth upgrade for data as the schema changes over time.

### Checksum

The Checksum property is set to ensure the schema is not modified after the `ProductionStatus` `CustomAttribute` is applied to it. This property does not need to be set in `NotForProduction` schemas.
