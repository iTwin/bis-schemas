-- Outputs most critical frame (max design ratio) from a STAAD result
SELECT
    b.ECInstanceId [BeamId],
    r.CriticalLoadCaseId,
    MAX(r.DesignRatio)
FROM
    staadapp.Beam b 
    INNER JOIN [resultdb-01].staad.FrameDesignResultRecord r
        ON b.ECInstanceId = r.ElementId

-- Outputs loadCases and timeSteps where absolute displacement of
-- a particular element is greater than X
SELECT
    r.LoadCaseId,
    ts.TimeFromStart [TimeStep]
FROM
    staadapp.Element e
    INNER JOIN [resultdb-01].structres3d.NodalTimeVariantResultRecord r
        ON e.ECInstanceId = r.ElementId
    INNER JOIN [resultdb-01].simrescore.TimeStep ts
        ON r.TimeStep.Id = ts.ECInstanceId
WHERE
    e.ECInstanceId = ? AND
    sqrt(pow(r.Translational.Axial, 2) + pow(r.Translational.AlongS, 2) + pow(r.Translational.AlongT, 2)) > ?


-- Outputs elements, loadCase and timeStep experimenting a vertical force greater than X
SELECT
    e.ECInstanceId,
    r.LoadCaseId,
    ts.TimeFromStart [TimeStep]
FROM
    staadapp.Element e
    INNER JOIN [resultdb-01].structres3d.NodalReactionTimeVariantResultRecord r
        ON e.ECInstanceId = r.ElementId
    INNER JOIN [resultdb-01].simrescore.TimeStep ts
        ON r.TimeStep.Id = ts.ECInstanceId
WHERE
    r.ReactionForce.ShearS > ?
