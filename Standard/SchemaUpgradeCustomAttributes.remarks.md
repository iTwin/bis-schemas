---
noEditThisPage: true
remarksTarget: SchemaUpgradeCustomAttributes.ecschema.md
---

# SchemaUpgradeCustomAttributes

## AllowUnitChange

Allows a persistence unit to be changed during a schema upgrade if applied to the property whose unit is being changed.  The persisted values for the modified property are not changed during the schema upgrade.

|Change|Is Allowed|
|-|-|
|KindOfQuantity added to a property that previously had none|Allowed without `AllowUnitChange` custom attribute|
|Changing the KindOfQuantity applied to a property that does NOT change persistence unit|Allowed without `AllowUnitChange` custom attribute|
|Changing the KindOfQuantity applied to a property that changes the persistence unit|Requires `AllowUnitChange` custom attribute.  Use Option # 1|
|Removing a KindOfQuantity from a property that previously had one|Requires `AllowUnitChange` custom attribute.  Use Option # 2|

**The `AllowUnitChange` Custom attribute will be ignored if it is malformed, it is malformed if:**

1. The From or To properties do not match the fully qualified name of the persistence unit of the old (from) or new (to) KindOfQuantity.
1. The From or To properties are not set, they may be set to null or empty if appropriate.  

Usage:

**Option 1:** To change the KindOfQuantity of a ECProperty to one having a different persistence unit, add custom attribute to ECProperty as follow:

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

The From value (in this case `u:CM`) is the persistence unit of the old KindOfQuantity and the To value (in this case `u:M`) is the persistence unit of the new KindOfQuantity.

**Option 2:** To remove kind of quantity from a property, add custom attribute to ECProperty as follows:

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

The From value (in this case `u:CM`) must match the persistence unit of the old KindOfQuantity and the To value must be empty. Omitting the To tag will be considered malformed and the Custom Attribute will be ignored.
