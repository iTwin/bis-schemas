---
noEditThisPage: true
remarksTarget: ECDbMap.ecschema.md
---

# ECDbMap

## CustomAttribute Classes

### ImportRequiresVersion

The `ECDbRuntimeVersion` value specifies which ECDb version is required to import this schema.
This gets compared to the highest ECDb profile version known to the current ECDb runtime, which may be higher than the currently open file profile version.
Older versions of ECDb will refuse to import schemas that have this CA (import will be rejected).
If the schema is already in a file, older versions of ECDb are good to use it, if usage of things should be restricted, apply `UseRequiresVersion` instead.

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

ECSql queries which violate the restrictions set by this CA will fail to prepare and write a message to the ECDb issue reporter.

The use of this CA does not limit which ECDb versions can import the schemas. To restrict import apply the `ImportRequiresVersion` CA to the schema.

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

Example for directly applying this to an entity class, restricting its ECSql version:

```xml
<ECEntityClass typeName="Foo" >
    <ECCustomAttributes>
        <UseRequiresVersion xmlns="ECDbMap.02.00.02">
            <ECSqlVersion>1.0.0.0</ECSqlVersion>
        </UseRequiresVersion>
    </ECCustomAttributes>
    <ECProperty propertyName="Length" typeName="double" />
</ECEntityClass>

<ECEntityClass typeName="Bar">
    <BaseClass>Foo</BaseClass>
</ECEntityClass>
```

Class `Bar` in the example above will also be affected by the restriction since it derives from `Foo`.
