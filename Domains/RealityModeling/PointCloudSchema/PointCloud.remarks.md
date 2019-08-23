---
noEditThisPage: true
remarksTarget: PointCloud.ecschema.md
---

# PointCloud

Contains classes to support referencing external point cloud data

## Entity Classes

### PointCloudModel

PointCloudModel is used only by the DgnV8 Bridge to handle point cloud attachments. Consider this class 'Sealed.' An instance of PointCloudModel will sub-model a RepositoryLink in the 'BisCore.RealityDataSources' LinkModel.  Its JsonProperties contains information relevant to the point cloud. This is not a pattern that is recommended to be followed by domain authors.
