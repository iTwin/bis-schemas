---
noEditThisPage: true
remarksTarget: BisCoreViews.ecschema.md
---

# BisCoreViews

## Entity Classes

### PhysicalElementMaterialView

The `PhysicalElementMaterialView` class is typically joined with the `bis:PhysicalElement` class, or one of its subclasses, in ECSQL queries in order to retrieve both persisted and derived properties about such instances.

## Sample ECSQL queries

- Count of `PhysicalElement`s per `PhysicalMaterial`.

```sql
SELECT 
    pm.CodeValue,
    COUNT(*)
FROM 
    bisViews.PhysicalElementMaterialView v INNER JOIN 
    bis.PhysicalMaterial pm ON v.PhysicalMaterial.Id = pm.ECInstanceId
GROUP BY
    pm.ECInstanceId
```