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

Example:

1. To change the KOQ of a ECProperty to a KOQ having a different persistence unit, add custom attribute to ECProperty as follow:

```xml
<ECProperty propertyName='propName' typeName='double' kindOfQuantity='newKoqName'>
    <ECCustomAttributes>
        <AllowUnitChange xmlns="SchemaUpgradeCustomAttributes.01.00.00">
            <From>u:CM</From>
            <To>u:M</To>
        </AllowUnitChange>
    </ECCustomAttributes>
</ECProperty>
```

Here u:CM is the persistence unit of the kind of quantity attached to the property and u:M is the persistence unit of the kind of quantity being attached to the property.

> NOTE: KOQ will not be changed if 'From' or 'To' tags are missing or empty in the AllowUnitChange custom attribute.

2. To remove kind of quantity from a property, add custom attribute to ECProperty as follow:

```xml
<ECProperty propertyName='propName' typeName='double'>
    <ECCustomAttributes>
        <AllowUnitChange xmlns="SchemaUpgradeCustomAttributes.01.00.00">
            <From>u:CM</From>
            <To></To>
        </AllowUnitChange>
    </ECCustomAttributes>
</ECProperty>
```

> NOTE: KOQ will not be removed from ECProperty if 'From' or 'To' tags are missing. Make sure that the value of the 'To' tag is empty.
