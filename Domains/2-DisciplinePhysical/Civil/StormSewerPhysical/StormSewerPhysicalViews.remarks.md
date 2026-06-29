---
noEditThisPage: true
remarksTarget: StormSewerPhysicalViews.ecschema.md
---

# StormSewerPhysicalViews

This schema contains view-classes that extend the StormSewerPhysical schema with concepts that can be derived from it, in light of  Stormwater and Sewage collection systems.

## Entity Classes

### PipeView

The `PipeView` class is typically joined with the `pipphys:Pipe` class in ECSQL queries in order to retrieve both persisted and derived properties about Pipe instances.

## Sample ECSQL queries

- Query Length and Slope for a particular `Pipe`.

```sql
SELECT
    pv.Length,
    pv.Slope
FROM
    stmswrphysViews.PipeView pv INNER JOIN pipphys.Pipe p ON p.ECInstanceId = pv.ECInstanceId
WHERE
    p.ECInstanceId = :pipeId
```

- Query InvertElevation and CrownElevation for all PipingPorts on a particular `Pipe`

```sql
SELECT
    ppv.InvertElevation,
    ppv.CrownElevation
FROM
    stmswrphysViews.PipingPortView ppv INNER JOIN pipphys.Pipe p ON p.ECInstanceId = ppv.Parent.Id
WHERE
    p.ECInstanceId = :pipeId
```
