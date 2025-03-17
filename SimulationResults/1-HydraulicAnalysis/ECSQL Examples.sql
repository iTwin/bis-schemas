-- Outputs time-steps in which any Manhole is Overflowing
SELECT 
    m.ECInstanceId, ts.ECInstanceId
FROM
    swrhyd.Manhole m
    INNER JOIN [resultdb-01].stmswrres.BasicOverflowingTimeVariantResultRecord r 
        ON m.ECInstanceId = r.ElementId
    INNER JOIN [resultdb-01].simrescore.TimeStep ts 
        ON ts.ECInstanceId = r.TimeStep.Id
WHERE
    r.IsOverflowing = True
ORDER BY
    ts.TimeFromStart ASC


-- Outputs any analytical elements, Conduits or nodal structures, with 
-- a TotalInfiltration larger than x
SELECT
    a.ECInstanceId, a.ECClassId
FROM
    anlt.AnalyticalElement a
    INNER JOIN [resultdb-02].gvfconvex.ISystemFlowResultRecord r
        ON a.ECInstanceId = r.ElementId
WHERE
    r.SystemTotalInfiltration > ?


-- Outputs several result attributes of various kinds for one Conduit
SELECT 
    c.ECInstanceId, 
    fr.Flow, fr.TimeStep.Id,                -- TimeVariant result
    sfr.SystemInfiltration,                 -- Time-Invariant result
    str.MaxHGL, str.TimeStepToMaxHGL.Id     -- Time-Invariant result with Time-reference
FROM
    swrhyd.Conduit c
    INNER JOIN [resultdb-01].stmswrres.BasicFlowResultRecord fr
        ON c.ECInstanceId = fr.ElementId
    INNER JOIN [resultdb-01].gvfconvex.ConduitSystemFlowResultRecord sfr
        ON c.ECInstanceId = sfr.ElementId
    INNER JOIN [resultdb-01].gvfconvex.StandardStatsResultRecord str
        ON c.ECInstanceId = str.ElementId
    INNER JOIN simrescore.TimeStep ts 
        ON ts.ECInstanceId = fr.TimeStep.Id
WHERE
    c.ECInstanceId = ?
ORDER BY
    ts.TimeFromStart ASC