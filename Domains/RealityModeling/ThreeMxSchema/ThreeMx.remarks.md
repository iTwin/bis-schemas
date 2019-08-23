---
noEditThisPage: true
remarksTarget: ThreeMx.ecschema.md
---

# ThreeMx

Contains classes to support referencing scalable mesh tiles

## Entity Classes

### ThreeMxModel

ThreeMxModel is used only by the DgnV8 Bridge to handle 3mx attachments. Consider this class 'Sealed.' An instance of ThreeMxModel will sub-model a RepositoryLink in the 'BisCore.RealityDataSources' LinkModel.  Its JsonProperties contains information relevant to the 3mx data. This is not a pattern that is recommended to be followed by domain authors.
