---
noEditThisPage: true
remarksTarget: Raster.ecschema.md
---

# Raster

Contains classes to support referencing external raster data

## Entity Classes

### RasterModel

RasterModel and its specializations are used only by the DgnV8 Bridge to handle raster attachments. Consider this class 'Sealed', i.e. create no new specializations of it.

### WmsModel

WmsModel is used only by the DgnV8 Bridge to handle WMS raster attachments. Consider this class 'Sealed'. An instance of WmsModel will sub-model a RepositoryLink in the 'BisCore.RealityDataSources' LinkModel.  Its JsonProperties contains information relevant to the WMS attachment. This is not a pattern that is recommended to be followed by domain authors.

### RasterFileModel

RasterFileModel is used only by the DgnV8 Bridge to handle RasterFile raster attachments. Consider this class 'Sealed'. An instance of RasterFileModel will sub-model a RepositoryLink in the 'BisCore.RealityDataSources' LinkModel.  Its JsonProperties contains information relevant to the RasterFile attachment. This is not a pattern that is recommended to be followed by domain authors.
