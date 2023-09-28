---
noEditThisPage: true
remarksTarget: ECDbMap.ecschema.md
---

# ECDbMap

## ImportRequiresVersion

The `ECDbRuntimeVersion` value specifies which ECDb version is required to import this schema. Older versions will refuse to import.

Example usage:
```xml
<?xml version="1.0" encoding="utf-8" ?>
<ECSchema schemaName="Schema1" alias="s1" version="1.0.1" xmlns="http://www.bentley.com/schemas/Bentley.ECXML.3.2">
    <ECSchemaReference name="ECDbMap" version="02.00.02" alias="ecdbmap"/>
    <ECCustomAttributes>
        <ImportRequiresVersion xmlns="ECDbMap.02.00.02">
            <ECDbRuntimeVersion>4.0.0.5</ECDbRuntimeVersion>
        </ImportRequiresVersion>
    </ECCustomAttributes>
    <ECEntityClass typeName="Foo" >
        <ECProperty propertyName="Length" typeName="double" />
    </ECEntityClass>
</ECSchema>
```

### UseRequiresVersion

Can be applied to a class which makes queries which use that class require a minimum ECDb or ECSql version.
When applied to a custom attribute class, that custom attribute carries the information along to all classes to which it is being applied. (Nesting is also possible).

Applying this to anything other than a relationship, entity or custom attribute class has no effect.

`ECSqlVersion` specifies the minimum ECSql version which is maintained independend of the ECDb profile version and allows a second mechanism for tracking changes (the sql version is usually incremented more frequently than profile version)

Example usage:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ECSchema schemaName="Schema1" alias="s1" version="1.0.1" xmlns="http://www.bentley.com/schemas/Bentley.ECXML.3.2">
    <ECSchemaReference name="ECDbMap" version="02.00.02" alias="ecdbmap"/>
    <ECCustomAttributeClass typeName="Bar" modifier="Sealed" appliesTo="EntityClass">
        <ECCustomAttributes>
            <UseRequiresVersion xmlns="ECDbMap.02.00.02">
                <ECDbRuntimeVersion>4.0.0.4</ECDbRuntimeVersion>
            </UseRequiresVersion>
        </ECCustomAttributes>
    </ECCustomAttributeClass>
    <ECEntityClass typeName="Foo" >
        <ECCustomAttributes>
            <Bar></Bar>
        </ECCustomAttributes>
        <ECProperty propertyName="Length" typeName="double" />
    </ECEntityClass>
</ECSchema>
```
