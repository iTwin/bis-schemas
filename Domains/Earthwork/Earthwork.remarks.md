---
remarksTarget: Earthwork.ecschema.md
---

# Earthwork

Contains the classes modeling earthwork activities in BIS. Earthwork involves the work of excavating or building embankments, moving and/or processing of massive quantities of soil or unformed rock. It is done to reconfigure the topography of a site to achieve the design levels.

![Earthwork](./media/Earthwork-classes.png)

## Entity Classes

### FillType

Instances of `FillType` provide an additional classification that can be applied to `Fill`s. Examples include Embankment, Slope Fill or Back Fill. An instance of `FillType` can optionally specify a single *Physical Material* via its `PhysicalMaterial` property.

Equivalent to [IfcEarthworksFillTypeEnum](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcEarthworksFillTypeEnum.htm).

### Fill

Examples of `Fill` include subgrade or a parts of a structure above it (such as “soft” courses in pavement or ballast). Usually formed by spreading and compacting construction materials such as sand and gravel.

`Fill`s shall have their *Volume* stored in their `GeometryStream` as a *Polyface*. Further classification of `Fill` instances can be achieved via instances of `FillType`. A `Fill` instance can override the *Physical Material* specified by its corresponding `FillType` via its `PhysicalMaterial` property.

`Fill`s must be contained in `PhysicalModel`s. Instances of `Fill`, by default, shall use the Domain-ranked `ew:Volume` category.

Equivalent to [IfcEarthworksFill](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcEarthworksFill.htm).

### CutType

Instances of `CutType` provide an additional classification that can be applied to `Cut`s. Examples include Excavation, Trench or Dredging. An instance of `CutType` can optionally specify a single *Physical Material* to be removed via its `PhysicalMaterial` property.

Equivalent to [IfcEarthworksCutTypeEnum](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcEarthworksCutTypeEnum.htm).

### Cut

The material excavated, modeled by `Cut`s, can later be used as fill or discarded as waste. The Earthwork schema does not aim to model such processes, however. A `Cut` instance can override the *Physical Material* to be removed specified by its corresponding `CutType` via its `PhysicalMaterial` property.

`Cut`s shall have their *Volume* stored in their `GeometryStream` as a *Polyface*.

`Cut`s must be contained in `PhysicalModel`s. Instances of `Cut`, by default, shall use the Domain-ranked `ew:Volume` category.

Equivalent to [IfcEarthworksCut](http://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcEarthworksCut.htm) with the main difference that IFC's equivalent does not model the material excavated, only the resulting void from modification of existing terrain.

### SurfaceGradeType

Instances of `SurfaceGradeType` provide an additional classification that can be applied to `SurfaceGrade`s. An instance of `SurfaceGradeType` can optionally specify a single *Physical Material* via its `PhysicalMaterial` property.

### SurfaceGrade

`SurfaceGrade`s shall have their *Surface* stored in their `GeometryStream` as a *Polyface*. A `SurfaceGrade` instance can override the *Physical Material* specified by its corresponding `SurfaceGradeType` via its `PhysicalMaterial` property.

`SurfaceGrade`s must be contained in `PhysicalModel`s. Instances of `SurfaceGrade`, by default, shall use the Domain-ranked `ew:Grading` category.