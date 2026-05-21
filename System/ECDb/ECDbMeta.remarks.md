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

## Sample ECSQL queries

- Query for all EC classes in a particular schema identified by its name, that derive from bis:PhysicalElement.

```sql
SELECT
    subClassDef.Name [Class Name]
FROM
    meta.ECSchemaDef bisSchemaDef 
    INNER JOIN meta.ECClassDef bisClassDef ON bisSchemaDef.ECInstanceId = bisClassDef.Schema.Id
    INNER JOIN meta.ClassHasAllBaseClasses baseClasses ON baseClasses.TargetECInstanceId = bisClassDef.ECInstanceId
    INNER JOIN meta.ECClassDef subClassDef ON subClassDef.ECInstanceId = baseClasses.SourceECInstanceId
    INNER JOIN meta.ECSchemaDef requestedSchemaDef ON requestedSchemaDef.ECInstanceId = subClassDef.Schema.Id
WHERE
    bisSchemaDef.Name = 'BisCore' AND bisClassDef.Name = 'PhysicalElement' AND
    requestedSchemaDef.Name = :schemaName
```

- Query for all relationship classes that directly target a particular class, identified by its schema name and class name.

```sql
SELECT
  srel.Name [Relationship Schema Name],
  rel.Name [Relationship Class Name]
FROM
  meta.ECClassDef c
  INNER JOIN meta.ECSchemaDef s ON c.Schema.Id = s.ECInstanceId
  INNER JOIN meta.RelationshipConstraintHasClasses rchc ON rchc.TargetECInstanceId = c.ECInstanceId
  INNER JOIN meta.ECRelationshipConstraintDef constrDef ON constrDef.ECInstanceId = rchc.SourceECInstanceId
  INNER JOIN meta.ECClassDef rel ON constrDef.RelationshipClass.Id = rel.ECInstanceId
  INNER JOIN meta.ECSchemaDef srel ON srel.ECInstanceId = rel.Schema.Id
WHERE
  s.Name = :schemaName AND c.Name = :className
```

- Query for the names of all EC schemas marked as "dynamic" in the current repository.

```sql
SELECT
    s.Name [Schema Name]
FROM
    meta.SchemaCustomAttribute sca 
    INNER JOIN meta.ECSchemaDef s ON s.ECInstanceId = sca.Schema.Id
    INNER JOIN meta.ECClassDef cac ON cac.ECInstanceId = sca.CustomAttributeClass.Id
    INNER JOIN meta.ECSchemaDef cas ON cas.ECInstanceId = cac.Schema.Id
WHERE
    cas.Name = 'CoreCustomAttributes' AND cac.Name = 'DynamicSchema'
```

- Query for the _ProductionStatus_ of all BIS schemas in the current repository.

```sql
SELECT
    s.Name [Schem Name],
    json_extract(Instance, '$.ProductionStatus.SupportedUse') [Production Status]

FROM
    meta.SchemaCustomAttribute sca INNER JOIN meta.ECSchemaDef s ON s.ECInstanceId = sca.Schema.Id
    INNER JOIN meta.ECClassDef cac ON cac.ECInstanceId = sca.CustomAttributeClass.Id
    INNER JOIN meta.ECSchemaDef cas ON cas.ECInstanceId = cac.Schema.Id
WHERE
    cas.Name = 'CoreCustomAttributes' AND cac.Name = 'ProductionStatus'
```