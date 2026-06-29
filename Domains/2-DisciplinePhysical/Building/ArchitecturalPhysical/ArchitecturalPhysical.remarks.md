---
noEditThisPage: true
remarksTarget: ArchitecturalPhysical.ecschema.md
---

# ArchitecturalPhysical

This schema contains the concrete classes that are used to model the physical elements in a building in the architectural discipline.

The schema also contains `PhysicalTypes` of all classes. However it needs to be noted that not all subclasses of `bis:PhysicalElement` should have a [PhysicalType](./biscore.ecschema.md#PhysicalType). Please read the [PhysicalType documentation](./biscore.ecschema.md#PhysicalType) for more.

## Sample ECSQL queries

- Query for the _Total Net Volume_ and _Total Net Side Area_ of all `Wall`s, grouped by `PhysicalMaterial`.

```sql
SELECT
    pm.CodeValue,
    SUM(wmat.NetVolume) [TotalNetVolume],
    SUM(wmat.NetSideArea) [TotalNetSideArea]
FROM
    (SELECT
        w.NetVolume,
        w.NetSideArea,
        coalesce(w.PhysicalMaterial.Id, wt.PhysicalMaterial.Id) [PhysicalMaterialId]
    FROM
        archphys.Wall w LEFT JOIN archPhys.WallType wt ON w.TypeDefinition.Id = wt.ECInstanceId) wmat
    INNER JOIN bis.PhysicalMaterial pm ON wmat.PhysicalMaterialId = pm.ECInstanceId
GROUP BY
    pm.ECInstanceId
```