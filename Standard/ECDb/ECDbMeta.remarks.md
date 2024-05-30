---
noEditThisPage: true
remarksTarget: ECDbMeta.ecschema.md
---

# ECDbMeta

## Entity Classes

### CustomAttribute

Special class which returns a collection of all custom attributes however, unlike the specialized types e.g. [ClassCustomAttribute](#classcustomattribute) this is the raw information not separated by container type and the `Instance` property holds xml instead of json, which cannot be natively processed using SQLite functions. Use this for lower level queries against custom attributes where the contents of the attribute and the item it is applied to are not needed.

### ClassCustomAttribute

Can be used to obtain custom attributes which are applied to a class.
Example: Obtaining values from inside a custom attribute using json_extract.

```xml
<!-- Piece inside the BisCore schema on the element class -->
            <ClassMap xmlns="ECDbMap.2.0.2">
                <MapStrategy>TablePerHierarchy</MapStrategy>
            </ClassMap>
```

```sql
SELECT ec_classname(ca.Class.Id) [Class], json_extract(ca.Instance, '$.ClassMap.MapStrategy') [MapStrategy]
   FROM meta.ClassCustomAttribute ca
   WHERE ca.CustomAttributeClass.Id IS (ecdbmap.ClassMap) AND ca.Class.Id IS (ONLY bis.Element) LIMIT 5;
```

Result

```
Class               |MapStrategy
-----------------------------------------
BisCore:Element     |TablePerHierarchy
```

### SchemaCustomAttribute
Similar to [ClassCustomAttribute](#classcustomattribute) but returns custom attributes applied to a schema.

### PropertyCustomAttribute

Similar to [ClassCustomAttribute](#classcustomattribute) but returns custom attributes applied to a property.