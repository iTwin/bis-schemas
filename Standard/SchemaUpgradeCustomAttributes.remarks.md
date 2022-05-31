---
noEditThisPage: true
remarksTarget: SchemaUpgradeCustomAttributes.ecschema.md
---

# SchemaUpgradeCustomAttributes

## AllowUnitChange

**typeName:** CustomAttributeClass

Applied to a property to indicate that existing KOQ can be changed to a KOQ having a different persistence unit.

**displayLabel:** AllowUnitChange

**modifier:** Sealed

**Applies to:** PrimitiveProperty

#### Properties

|    Name    |  Description  |    Label    |  Category  |    Read Only     |    Priority    |
|:-----------|:--------------|:------------|:-----------|:-----------------|:---------------|
|From|Name of the old persistence unit of the existing KOQ|||false|0|
|To|Name of the new persistence unit of the KOQ attached to the property|||false|0|
