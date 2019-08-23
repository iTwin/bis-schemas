---
noEditThisPage: true
remarksTarget: ScalableMesh.ecschema.md
---

# ScalableMesh

Contains classes to support referencing scalable mesh tiles

## Entity Classes

### ScalableMeshModel

ScalableMeshModel is used only by DgnV8 Bridge to handle scalable mesh attachments. Consider this class 'Sealed.' An instance of ScalableMeshModel will sub-model a RepositoryLink in the 'BisCore.RealityDataSources' LinkModel.  Its JsonProperties contains information relevant to the scalable mesh. This is not a pattern that is recommended to be followed by domain authors.
