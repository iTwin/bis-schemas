---
noEditThisPage: true
remarksTarget: Grids.ecschema.md
---

# Grids

BIS supports both simple Grids (which are sets of curves defined in a particular plane) and GridSystems (which contain sets of surfaces organized into axes which can be used to instruct iTwin.js to generate simple Grids). 

A Grid is equivalent to an IfcGrid. IFC has no equivalent of a GridSystem.

Classes in this schema are used to build structural,spaceplanning and other `GridSystem`s and `Grid`s. A `GridSystem` is a collection of GridSurfaces. Every `GridSurface` has a `GridAxis`, which is currently primarily used for grouping surfaces into subgroups. intersection of GridSurfaces may create a `GridCurve`.

<u>Schema:</u>

```xml
<ECSchema schemaName="Grids" alias="grids" version="02.00.00" xmlns="http://www.bentley.com/schemas/Bentley.ECXML.3.2" description="defines elements used as an aid in locating structural and design and/or other elements">
    <ECSchemaReference name="BisCore" version="01.00.14" alias="bis" />
    <ECSchemaReference name="AecUnits" version="01.00.01" alias="AECU" />
```

![Grids](./media/grids.png)
![Grids](./media/gridsystem_instance.png)

## Classes

### GridCurve

An object representing a grid curve. `GridCurve` is similar to `IfcGridAxis` in that it represents a curve geometry on a (usually planar) surface. it is also similar to Grid Curves as known in `OpenBuildings Designer`. `GridCurve`s can be found in submodels of `Grid` elements.

<u>Naming:</u>

1.  Matches with Grid Curve in `OpenBuildings Designer`

<u>Geometry Use:</u>

1.  Open `CurveVector` with a single curve
2.  Local Coordinates : origin at the start of the curve, aligned to creating `GridSurface` when available.

<u>Schema:</u>

```xml
    <ECEntityClass typeName="GridCurve" modifier="Abstract" description="an element representing a GridCurve - typically intersection of 2 grid surfaces">
        <BaseClass>bis:SpatialLocationElement</BaseClass>
    </ECEntityClass>
```

### GridLine

An object representing a grid line. `GridLine` can be created by 2 intersecting instances of `GridPlanarSurface`.

<u>Naming:</u>

1.  Matches with Grid Line in `OpenBuildings Designer`

<u>Geometry Use:</u>

1.  Open `CurveVector` with a single line
2.  Inherits from baseclass. Local Coordinates : origin at the start of the curve, aligned to creating `GridSurface`.

<u>Schema:</u>

```xml
    <ECEntityClass typeName="GridLine" description="a GridCurve that is a result of 2 planar surfaces">
        <BaseClass>GridCurve</BaseClass>
    </ECEntityClass>
```

### GridArc

An object representing a grid arc. `GridArc` can be created by intersecting instances of `GridPlanarSurface` and `GridArcSurface` together.

<u>Naming:</u>

1.  Matches with Grid Arc in `OpenBuildings Designer`

<u>Geometry Use:</u>

1.  Open `CurveVector` with a single arc
2.  Inherits from baseclass. Local Coordinates : origin at the start of the curve, aligned to creating `GridSurface`.

<u>Schema:</u>

```xml
    <ECEntityClass typeName="GridArc" description="a GridCurve that is a result of a planar and arc surface">
        <BaseClass>GridCurve</BaseClass>
    </ECEntityClass>
```

### GridSpline

An object representing a grid spline. `GridSpline` can be created by intersecting instances of `GridPlanarSurface` and `GridSplineSurface` together.

<u>Naming:</u>

1.  Matches with Grid Spline in `OpenBuildings Designer`

<u>Geometry Use:</u>

1.  Open `CurveVector` with a single spline
2.  Inherits from baseclass. Local Coordinates : origin at the start of the curve, aligned to creating `GridSurface`.

<u>Schema:</u>

```xml
    <ECEntityClass typeName="GridSpline" description="a GridCurve that is a result of a planar and a spline surface">
        <BaseClass>GridCurve</BaseClass>
    </ECEntityClass>
```

### GeneralGridCurve

GridCurve representing other geometry (typically 3d splines). `GeneralGridCurve` can be created by intersecting other pairs of `GridSurface` instances.

<u>Naming:</u>

1.  Matches with Grid Curve in `OpenBuildings Designer`

<u>Geometry Use:</u>

1.  Open `CurveVector` with a single curve
2.  Inherits from baseclass. Local Coordinates : origin at the start of the curve, aligned to creating `GridSurface`.

<u>Schema:</u>

```xml
    <ECEntityClass typeName="GeneralGridCurve" description="a GridCurve that is a result of 2 non-planar surfaces">
        <BaseClass>GridCurve</BaseClass>
    </ECEntityClass>
```

### GridSystem

A collection of `GridSurface` instances, which can be used to instruct iTwin.js to generate simple Grids

Grids known in other products like BuildingSMART IfcGrid or Grid/GridSystem in `OpenBuildings Designer`, do not contain surfaces, instead they contain curves. However, those curves are later referenced over different elevations, which makes those elements conceptually surfaces intersecting those elevations. in BIS - `GridSystem` is a collection of surfaces rather than curves. curves are a result of surfaces intersecting, known as `GridCurve`. While this approach ensures compatibility with legacy grids it also is more flexible. i.e. by manipulating the .EndElevation properties of individual instances of `IPlanGridSurface` in a `PlanGrid` intersecting `ElevationGrid`, individual `GridCurve` instances could be made not to appear on higher elevations. number of axes is also unlimited in `SketchGrid`, `ElevationGrid` and `FreeGrid`.

<u>Naming:</u>

1.  Equivalent with GridSystem in `OpenBuildings Designer`

<u>Geometry Use:</u>

1.  No geometry
2.  Local Coordinates : defines the origin for surfaces

<u>Schema:</u>

```xml
    <ECEntityClass typeName="GridSystem" modifier="Abstract" description="A GridSystem is a collection of gridsurface elements.">
        <BaseClass>bis:SpatialLocationElement</BaseClass>
        <BaseClass>bis:ISubModeledElement</BaseClass>
    </ECEntityClass>
```

### ElevationGridSystem

A collection of ElevationGridSurfaces. has one or more `GeneralGridAxis`. typically used to slice a building. every surface is positioned across the Z axis of ElevationGridSystem Placement.

<u>Naming:</u>

1.  ElevationGridSystem because GridSurfaces are positioned based on their .Elevation and grid .Placement properties

<u>Geometry Use:</u>

1. No geometry
1. Local Coordinates : defines the origin and direction for surfaces

<u>Properties:</u>

1. DefaultElevationIncrement - suggested elevation increment with which a new surface would be inserted (highest elevation surface + .DefaultElevationIncrement)
1. DefaultSurface2d - a suggested surface for new ElevationGridSurface, could be null

<u>Schema:</u>

```xml
    <ECEntityClass typeName="ElevationGridSystem" description="An ElevationGridSystem contains planar surfaces that are parallel to the local XY plane">
        <BaseClass>GridSystem</BaseClass>
        <ECProperty propertyName="DefaultElevationIncrement" displayLabel="DefaultElevationIncrement" typeName="double" kindOfQuantity="AECU:LENGTH" description="Default elevation increment for newly added GridSurfaces" />
        <ECProperty propertyName="DefaultSurface2d" displayLabel="DefaultSurface2d" typeName="Bentley.Geometry.Common.IGeometry" description="Default surface geometry for newly added GridSurfaces"/>
    </ECEntityClass>
```

### FreeGridSystem

A collection of unconstrained surfaces (`FreeGridSurface`).

<u>Naming:</u>

1.  FreeGridSystem because it is not constrained and can contain surfaces of any geometry and orientation

<u>Geometry Use:</u>

1.  No geometry
2.  Local Coordinates : defines the origin and direction for surfaces

<u>Schema:</u>

```xml
    <ECEntityClass typeName="FreeGridSystem" description="An FreeGrid contains surfaces that do not need to follow any rules">
        <BaseClass>GridSystem</BaseClass>
    </ECEntityClass>
```

### PlanGridSystem

A collection of `IPlanGridSurface` elements that are single curve extrusions, sharing the extrusion direction. extrusion direction is equal to grid Z orientation.

<u>Naming:</u>

1. PlanGridSystem because all surfaces could be viewed as curves from a plan view

<u>Geometry Use:</u>  

1. No geometry
1. Local Coordinates : defines the origin and direction for surfaces

<u>Properties:</u>

1. DefaultStartElevation - suggested start elevation for new inserted surfaces
1. DefaultEndElevation - suggested end elevation for new inserted surfaces

<u>Schema:</u>

```xml
    <ECEntityClass typeName="PlanGridSystem" modifier="Abstract" description="a GridSystem whose surfaces are curves parallel to the local x-y plane extruded along the local z-axis">
        <BaseClass>GridSystem</BaseClass>
        <ECProperty propertyName="DefaultStartElevation" displayLabel="DefaultStartElevation" typeName="double" kindOfQuantity="AECU:LENGTH" description="Default start elevation the surfaces in this GridSystem start from" />
        <ECProperty propertyName="DefaultEndElevation" displayLabel="DefaultEndElevation" typeName="double" kindOfQuantity="AECU:LENGTH" description="Default end elevation the surfaces in this GridSystem end at" />
    </ECEntityClass>
```

### SketchGridSystem

A collection of surfaces that are **unconstrained** single curve extrusions, sharing the extrusion direction. extrusion direction is driven by grid Z orientation.

<u>Naming:</u>

1.  SketchGridSystem because all surfaces could be "sketched" from the plan view.
2.  Matches with Sketch Grid in `OpenBuildings Designer`

<u>Geometry Use:</u>

1.  No geometry
2.  Local Coordinates : defines the origin and direction for surfaces

<u>Schema:</u>

```xml
    <ECEntityClass typeName="SketchGridSystem" description="A SketchGridSystem contains surfaces whose positions are not constrained (other than being swept to the grid normal)">
        <BaseClass>PlanGridSystem</BaseClass>
    </ECEntityClass>
```

### OrthogonalGridSystem

A collection of `PlanCartesianGridSurface`s. has 2 axes - 1 `OrthogonalAxisX` and 1 `OrthogonalAxisY`. All surfaces in the X direction belong to `OrthogonalAxisX`, all those in the Y direction belong to `OrthogonalAxisY`.

<u>Naming:</u>

1.  Matches with Orthogonal Grid in `OpenBuildings Designer`

<u>Geometry Use:</u>

1.  No geometry
1.  Local Coordinates : defines the origin and direction for surfaces

<u>Properties:</u>

1. DefaultCoordinateIncrementX - suggested coordinate increment in the X direction for new inserted surfaces
1. DefaultCoordinateIncrementY - suggested coordinate increment in the Y direction for new inserted surfaces
1. DefaultStartExtentX - suggested start extent in the X direction for new inserted surfaces
1. DefaultEndExtentX - suggested end extent in the X direction for new inserted surfaces
1. DefaultStartExtentY - suggested start extent in the Y direction direction for new inserted surfaces
1. DefaultEndExtentY - suggested end extent in the Y direction direction for new inserted surfaces

<u>Schema:</u>

```xml
    <ECEntityClass typeName="OrthogonalGridSystem" description="And OrthogonalGridSystem has all of its' surfaces orthogonal in either X or Y direction">
        <BaseClass>PlanGridSystem</BaseClass>
        <ECProperty propertyName="DefaultCoordinateIncrementX" displayLabel="DefaultCoordinateIncrementX" typeName="double" kindOfQuantity="AECU:LENGTH" description="default increment in the X direction for newly added GridSurfaces" />
        <ECProperty propertyName="DefaultCoordinateIncrementY" displayLabel="DefaultCoordinateIncrementY" typeName="double" kindOfQuantity="AECU:LENGTH" description="default increment in the Y direction for newly added GridSurfaces" />
        <ECProperty propertyName="DefaultStartExtentX" displayLabel="DefaultStartExtentX" typeName="double" kindOfQuantity="AECU:LENGTH" description="default surface start extension in the X direction for newly added GridSurfaces" />
        <ECProperty propertyName="DefaultEndExtentX" displayLabel="DefaultEndExtentX" typeName="double" kindOfQuantity="AECU:LENGTH" description="default surface end extension in the X direction for newly added GridSurfaces" />
        <ECProperty propertyName="DefaultStartExtentY" displayLabel="DefaultStartExtentY" typeName="double" kindOfQuantity="AECU:LENGTH" description="default surface start extension in the Y direction for newly added GridSurfaces" />
        <ECProperty propertyName="DefaultEndExtentY" displayLabel="DefaultEndExtentY" typeName="double" kindOfQuantity="AECU:LENGTH" description="default surface end extension in the Y direction for newly added GridSurfaces" />
    </ECEntityClass>
```

### RadialGridSystem

A collection of `PlanRadialGridSurface` and `PlanCircumferentialGridSurface` elements. Has 2 axes - 1 `CircularAxis` and 1 `RadialAxis`. All `PlanCircumferentialGridSurface` are in the `CircularAxis`, all `PlanRadialGridSurface` in the `RadialAxis`.
`
<u>Naming:</u>

1.  matches with Radial Grid in `OpenBuildings Designer`

<u>Geometry Use:</u>

1.  no geometry
2.  Local Coordinates : defines the origin and direction for surfaces

<u>Properties:</u>

1.  DefaultAngleIncrement - suggested angle increment for new instances of `PlanRadialGridSurface`
2.  DefaultRadiusIncrement - suggested radius increment for new instances of `PlanCircumferentialGridSurface`
3.  DefaultStartAngle - suggested start angle for new instances of `PlanCircumferentialGridSurface`
4.  DefaultEndAngle - suggested end angle for new instances of `PlanCircumferentialGridSurface`
5.  DefaultStartRadius - suggested start radius for new instances of `PlanRadialGridSurface`
6.  DefaultEndRadius - suggested end radius for new instances of `PlanRadialGridSurface`

<u>Schema:</u>

```xml
    <ECEntityClass typeName="RadialGridSystem" description="A RadialGridSystem consists either of arcsurfaces in radial axis or planarsurfaces in circular axis">
        <BaseClass>PlanGridSystem</BaseClass>
        <ECProperty propertyName="DefaultAngleIncrement" displayLabel="DefaultAngleIncrement" typeName="double" kindOfQuantity="AECU:ANGLE" description="Default angle increment for newly added PlanRadialGridSurfaces in this GridSystem"/>
        <ECProperty propertyName="DefaultRadiusIncrement" displayLabel="DefaultRadiusIncrement" typeName="double" kindOfQuantity="AECU:ANGLE" description="Default radius increment for newly added PlanCircumferentialGridSurface in this GridSystem" />
        <ECProperty propertyName="DefaultStartAngle" displayLabel="DefaultStartAngle" typeName="double" kindOfQuantity="AECU:ANGLE" description="Default start angle for newly added PlanCircumferentialGridSurface in this GridSystem" />
        <ECProperty propertyName="DefaultEndAngle" displayLabel="DefaultEndAngle" typeName="double" kindOfQuantity="AECU:ANGLE" description="Default end angle for newly added PlanCircumferentialGridSurface in this GridSystem"/>
        <ECProperty propertyName="DefaultStartRadius" displayLabel="DefaultStartRadius" typeName="double" kindOfQuantity="AECU:LENGTH" description="Default start radius for newly added PlanRadialGridSurfaces in this GridSystem"/>
        <ECProperty propertyName="DefaultEndRadius" displayLabel="DefaultEndRadius" typeName="double" kindOfQuantity="AECU:LENGTH" description="Default end radius for newly added PlanRadialGridSurfaces in this GridSystem"/>
    </ECEntityClass>
```

### GridAxis

A subcollection of `GridSurface`s in a `GridSystem`. Typically used to group parallel surfaces together.

<u>Naming:</u>

1.  Matches with Grid Axis in `OpenBuildings Designer`

<u>Schema:</u>

```xml
    <ECEntityClass typeName="GridAxis" modifier="Abstract" description="an element which groups (typically parallel) GridSurface elements">
        <BaseClass>bis:GroupInformationElement</BaseClass>
        <ECProperty propertyName="Name" displayLabel="Name" typeName="string"/>
    </ECEntityClass>
```

### GeneralGridAxis

A subcollection of `GridSurface` instances in a Grid. Used for grouping any kind of grid surfaces together.

<u>Naming:</u>

1.  Matches with Grid Axis in `OpenBuildings Designer`

<u>Schema:</u>

```xml
    <ECEntityClass typeName="GeneralGridAxis" description="an element which groups GridSurface elements together in other grids">
        <BaseClass>GridAxis</BaseClass>
    </ECEntityClass>
```

### OrthogonalAxisX

A subcollection of `PlanCartesianGridSurface` in an `OrthogonalGrid` X direction.

<u>Naming:</u>

1.  Named so because it is an X axis in OrthogonalGrid.

<u>Schema:</u>

```xml
    <ECEntityClass typeName="OrthogonalAxisX" description="an element which groups all PlanCartesianGridSurface elements in the X direction">
        <BaseClass>GridAxis</BaseClass>
    </ECEntityClass>
```

### OrthogonalAxisY

A subcollection of `PlanCartesianGridSurface` in an `OrthogonalGrid` Y direction.

<u>Naming:</u>

1.  Named so because it is an Y axis in OrthogonalGrid.

<u>Schema:</u>

```xml
    <ECEntityClass typeName="OrthogonalAxisY" description="an element which groups all PlanCartesianGridSurface elements in the Y direction">
        <BaseClass>GridAxis</BaseClass>
    </ECEntityClass>
```

### CircularAxis

A subcollection of `PlanCircumferentialGridSurface` in a `RadialGrid`.

<u>Naming:</u>

1.  Matches with Circular Axis in `OpenBuildings Designer`

<u>Schema:</u>

```xml
    <ECEntityClass typeName="CircularAxis" description="an element which groups all PlanCircumferentialGridSurface elements in a RadialGrid together">
        <BaseClass>GridAxis</BaseClass>
    </ECEntityClass>
```

### RadialAxis

a subcollection of `PlanRadialGridSurface` in a `RadialGrid`

<u>Naming:</u>

1.  Matches with Radial Axis in `OpenBuildings Designer`

<u>Schema:</u>

```xml
    <ECEntityClass typeName="RadialAxis" description="an element which groups all PlanRadialGridSurface elements in a RadialGrid together">
        <BaseClass>GridAxis</BaseClass>
    </ECEntityClass>
```

### Grid

a Grid holds GridCurve elements

<u>Naming:</u>

1.  Matches with IfcGrid in IFC

<u>Geometry Use:</u>

1.  No geometry
2.  Local Coordinates : none

<u>Schema:</u>

```xml
    <ECEntityClass typeName="Grid" description="a Grid holds GridCurve elements">
        <BaseClass>bis:SpatialLocationElement</BaseClass>
        <BaseClass>bis:ISubModeledElement</BaseClass>
    </ECEntityClass>
```

### GridSurface

An 3 - dimensional surface contained in a `GridSystem`. A GridSurface is modeled by combining the information of grid construction line and the elevation extents. `GridSystem`s contain such information in products like `OpenBuildings Designer`.

<u>Naming:</u>

1.  Name GridSurface signifies that it is a surface grid element

<u>Properties:</u>

1.  Axis - a `GridAxis` this surface belongs to.

<u>Schema:</u>

```xml
    <ECEntityClass typeName="GridSurface" modifier="Abstract" description="A GridSurface element.">
        <BaseClass>bis:SpatialLocationElement</BaseClass>
        <ECNavigationProperty propertyName="Axis" relationshipName="GridAxisContainsGridSurfaces" direction="Backward" description="Axis this gridSurface belong to" />
    </ECEntityClass>
```

### IPlanGridSurface

A mix-in for `GridSurface` classes contained in a `PlanGrid`

<u>Naming:</u>

1.  named by combining `PlanGridSystem` and `GridSurface`

<u>Properties:</u>

1.  StartElevation - start elevation for the extrusion surface
1.  EndElevation - end elevation for the extrusion surface

<u>Schema:</u>

```xml
    <ECEntityClass typeName="IPlanGridSurface" modifier="Abstract" displayLabel="PlanGrid Surface" description="An interface that indicates that this Surface is suitable to be placed in a PlanGrid">
        <ECCustomAttributes>
            <IsMixin xmlns="CoreCustomAttributes.01.00.00">
                <!-- Only subclasses of grids:GridSurface can implement the IPlanGridSurface interface -->
                <AppliesToEntityClass>GridSurface</AppliesToEntityClass>
            </IsMixin>
        </ECCustomAttributes>
        <ECProperty propertyName="StartElevation" displayLabel="StartElevation" typeName="double" kindOfQuantity="AECU:LENGTH" description="Elevation this surface is swept from, relative to the modeled PlanGridSystem placement" />
        <ECProperty propertyName="EndElevation" displayLabel="EndElevation" typeName="double" kindOfQuantity="AECU:LENGTH" description="Elevation this surface is swept to, relative to the modeled PlanGridSystem placement" />
    </ECEntityClass>
```

### GridPlanarSurface

A class for planar `GridSurface` elements.

<u>Naming:</u>

1.  Named to note that this is a planar `GridSurface`

<u>Schema:</u>

```xml
    <ECEntityClass typeName="GridPlanarSurface" modifier="Abstract" description="A planar GridSurface element.">
        <BaseClass>GridSurface</BaseClass>
    </ECEntityClass>
```

### ElevationGridSurface

A planar `GridSurface` used in `ElevationGridSystem`. this is the only type of `GridSurface` allowed in an `ElevationGridSystem`.

<u>Naming:</u>

1.  Named by combining `ElevationGridSystem` and `GridSurface`

<u>Geometry Use:</u>

1.  A `CurveVector`
2.  Local Coordinates : grid coordinates + Elevation property in Z axis

<u>Properties:</u>

1.  Elevation - elevation this surface is located at, relative to `GridSystem` coordinate system.
1.  Surface2d - a property for the 2d surface geometry.

<u>Schema:</u>

```xml
    <ECEntityClass typeName="ElevationGridSurface" description="A PlanarGridSurface that is parallel with its Grid’s x-y plane (always contained in an ElevationGridSystem).">
        <BaseClass>GridPlanarSurface</BaseClass>
        <ECProperty propertyName="Elevation" displayLabel="Elevation" typeName="double" kindOfQuantity="AECU:LENGTH" description="Elevation this surface is at, relevant to the GridSystem coordinate system"/>
        <ECProperty propertyName="Surface2d" displayLabel="Surface2d" typeName="Bentley.Geometry.Common.IGeometry" description="geometry of the elevation surface. Must be planar and coincident with global XY plane" />
    </ECEntityClass>
```

### PlanGridPlanarSurface

A class for `GridPlanarSurface` elements used in `PlanGrid`.

<u>Naming:</u>

1.  Named by combining `PlanGridSystem` and `GridPlanarSurface`

<u>Geometry Use:</u>

1.  A `SolidPrimitive` DgnExtrusion containing single line for base, swept from StartElevation to EndElevation
2.  Local Coordinates : defined by subclasses

<u>Schema:</u>

```xml
    <ECEntityClass typeName="PlanGridPlanarSurface" modifier="Abstract" description="A planar PlanGridSurface element.">
        <BaseClass>GridPlanarSurface</BaseClass>
        <BaseClass>IPlanGridSurface</BaseClass>
    </ECEntityClass>
```

### PlanCartesianGridSurface

A class for `GridSurface` contained in `OrthogonalGridSystem`

<u>Naming:</u>

1.  Named so because it is a `GridSurface` defined by cartesian coordinates

<u>Geometry Use:</u>

1.  "inherit from parent" a `SolidPrimitive` DgnExtrusion containing single line for base, swept from StartElevation to EndElevation
2.  Local Coordinates : `GridSystem` coordinates + Coordinate in X or Y direction depending on the type of axis

<u>Properties:</u>

1.  Coordinate - offset from coordinate system origin. direction defined by the axis
2.  StartExtent - start extent of the surface
3.  EndExtent - end extent of the surface

<u>Schema:</u>

```xml
    <ECEntityClass typeName="PlanCartesianGridSurface" description="A planar PlanGridSurface that is perpendicular to the grid’s x-axis or y-axis.">
        <BaseClass>PlanGridPlanarSurface</BaseClass>
        <ECProperty propertyName="Coordinate" displayLabel="Coordinate" typeName="double" kindOfQuantity="AECU:LENGTH" description="Origin of the surface along the axis"/>
        <ECProperty propertyName="StartExtent" displayLabel="StartExtent" typeName="double" kindOfQuantity="AECU:LENGTH" description="start extent of the surface construction line" />
        <ECProperty propertyName="EndExtent" displayLabel="EndExtent" typeName="double" kindOfQuantity="AECU:LENGTH" description="start extent of the surface construction line" />
    </ECEntityClass>
```

### PlanRadialGridSurface

A class for `GridSurface` instances of angular increments contained in `RadialGridSystem`

<u>Naming:</u>

1.  Named so because it is a `GridSurface` defined by radial parameters

<u>Geometry Use:</u>

1.  "inherit from parent" a `SolidPrimitive` DgnExtrusion containing single line for base, swept from StartElevation to EndElevation
2.  Local Coordinates : `GridSystem` coordinates rotated by the Angle property from Y direction, clockwise

<u>Properties:</u>

1.  Angle - angle in the clockwise direction from the Y axis of the `RadialGridSystem` defining the direction of surface base line.
2.  StartRadius - start radius of the surface
3.  EndRadius - end radius of the surface

<u>Schema:</u>

```xml
    <ECEntityClass typeName="PlanRadialGridSurface" description="A PlanGridPlanarSurface whose infinite plane contains the PlanGridSystem’s origin.">
        <BaseClass>PlanGridPlanarSurface</BaseClass>
        <ECProperty propertyName="Angle" displayLabel="Angle" typeName="double" kindOfQuantity="AECU:LENGTH" description="Angle at which the surface construction line is placed, relative to modeled GridSystem placement"/>
        <ECProperty propertyName="StartRadius" displayLabel="StartRadius" typeName="double" kindOfQuantity="AECU:LENGTH" description="Start radius from which the surface construction line is drawn, relative to modeled GridSystem placement" />
        <ECProperty propertyName="EndRadius" displayLabel="EndRadius" typeName="double" kindOfQuantity="AECU:LENGTH" description="End radius to which the surface construction line is drawn, relative to modeled GridSystem placement" />
    </ECEntityClass>
```

### SketchLineGridSurface

A class for `GridSurface` instances of sketched line surfaces in `SketchGridSystem`

<u>Naming:</u>

1.  Named so because it is an extruded line surface in a `SketchGrid`

<u>Geometry Use:</u>

1.  "inherit from parent" a `SolidPrimitive` DgnExtrusion containing single line for base, swept from StartElevation to EndElevation
2.  Local Coordinates : `GridSystem` coordinates

<u>Properties:</u>

1.  Line2d - line geometry used to extrude the surface - a `CurveVector` containing a single line

<u>Schema:</u>

```xml
    <ECEntityClass typeName="SketchLineGridSurface" description="An extruded line gridsurface element.">
        <BaseClass>PlanGridPlanarSurface</BaseClass>
        <ECProperty propertyName="Line2d" displayLabel="Line2d" typeName="Bentley.Geometry.Common.IGeometry" description="Surface construction line geometry relative to the modeled GridSystem placement"/>
    </ECEntityClass>
```

### GridArcSurface

A `GridSurface` that is parallel to extruded arc.

<u>Naming:</u>

1.  Named to note that this is an arc `GridSurface`

<u>Schema:</u>

```xml
    <ECEntityClass typeName="GridArcSurface" modifier="Abstract" description="A GridSurface that is parallel to extruded arc.">
        <BaseClass>GridSurface</BaseClass>
    </ECEntityClass>
```

### PlanGridArcSurface

A class for `GridArcSurface` elements used in `PlanGridSystem`.

<u>Naming:</u>

1.  named by combining `PlanGridSystem` and `GridArcSurface`

<u>Geometry Use:</u>

1.  A `SolidPrimitive` DgnExtrusion containing single arc for base, swept from StartElevation to EndElevation
2.  Local Coordinates : defined by subclasses

<u>Schema:</u>

```xml
    <ECEntityClass typeName="PlanGridArcSurface" modifier="Abstract" description="An arc PlanGridSurface element.">
        <BaseClass>GridArcSurface</BaseClass>
        <BaseClass>IPlanGridSurface</BaseClass>
    </ECEntityClass>
```

### PlanCircumferentialGridSurface

A class for `GridSurface` instances of circular radius increments contained in `RadialGridSystem`

<u>Naming:</u>

1.  named so because it is a `GridSurface` defined by circumferential parameters

<u>Geometry Use:</u>

1.  "inherit from parent" a `SolidPrimitive` DgnExtrusion containing single arc for base, swept from StartElevation to EndElevation
2.  Local Coordinates : `GridSystem` coordinates

<u>Properties:</u>

1.  Radius - radius from the `GridSystem` origin at which the arc surface is swept.
2.  StartAngle - start angle of the arc surface
3.  EndAngle - end angle of the arc surface

<u>Schema:</u>

```xml
    <ECEntityClass typeName="PlanCircumferentialGridSurface" description="An PlanGridArcSurface that is centered on the GridSystem’s origin.">
        <BaseClass>PlanGridArcSurface</BaseClass>
        <ECProperty propertyName="Radius" displayLabel="Radius" typeName="double" kindOfQuantity="AECU:LENGTH" description="Radius of the surface construction arc curve geometry"/>
        <ECProperty propertyName="StartAngle" displayLabel="StartAngle" typeName="double" kindOfQuantity="AECU:ANGLE" description="Start Angle of the surface construction arc curve geometry, relative to the modeled GridSystem" />
        <ECProperty propertyName="EndAngle" displayLabel="EndAngle" typeName="double" kindOfQuantity="AECU:ANGLE" description="End Angle of the surface construction arc curve geometry, relative to the modeled GridSystem" />
    </ECEntityClass>
```

### SketchArcGridSurface

A class for `GridSurface` instances of sketched arc surfaces in `SketchGridSystem`

<u>Naming:</u>

1.  named so because it is an extruded arc surface in a `SketchGridSystem`

<u>Geometry Use:</u>

1.  "inherit from parent" a `SolidPrimitive` DgnExtrusion containing single arc for base, swept from StartElevation to EndElevation
2.  Local Coordinates : `GridSystem` coordinates

<u>Properties:</u>

1.  Arc2d - arc geometry used to extrude the surface - a `CurveVector` containing a single arc

<u>Schema:</u>

```xml
    <ECEntityClass typeName="SketchArcGridSurface" description="An extruded arc gridsurface element.">
        <BaseClass>PlanGridArcSurface</BaseClass>
        <ECProperty propertyName="Arc2d" displayLabel="Arc2d" typeName="Bentley.Geometry.Common.IGeometry" description="Surface construction arc curve geometry relative to the modeled GridSystem placement"/>
    </ECEntityClass>
```

### GridSplineSurface

A `GridSurface` that is parallel to an extruded spline.

<u>Naming:</u>

1.  Named to note that this is a spline `GridSurface`

<u>Schema:</u>

```xml
    <ECEntityClass typeName="GridSplineSurface" modifier="Abstract" description="A GridSurface that is parallel to an extruded spline.">
        <BaseClass>GridSurface</BaseClass>
    </ECEntityClass>
```

### PlanGridSplineSurface

A class for `GridSplineSurface` elements used in `PlanGrid`.

<u>Naming:</u>

1.  Named by combining `PlanGrid` and `GridSplineSurface`

<u>Geometry Use:</u>

1.  A `SolidPrimitive` DgnExtrusion containing single spline for base, swept from StartElevation to EndElevation
2.  Local Coordinates : defined by subclasses

<u>Schema:</u>

```xml
    <ECEntityClass typeName="PlanGridSplineSurface" modifier="Abstract" description="A spline PlanGridSurface element.">
        <BaseClass>GridSplineSurface</BaseClass>
        <BaseClass>IPlanGridSurface</BaseClass>
    </ECEntityClass>
```

### SketchSplineGridSurface

A class for `GridSurface` instances of sketched spline surfaces in `SketchGridSystem`

<u>Naming:</u>

1.  Named so because it is an extruded spline surface in a `SketchGridSystem`

<u>Geometry Use:</u>

1.  "inherit from parent" a `SolidPrimitive` DgnExtrusion containing single spline for base, swept from StartElevation to EndElevation
2.  Local Coordinates : `Grid` coordinates

<u>Properties:</u>

1.  Spline2d - spline geometry used to extrude the surface - a `CurveVector` containing a single spline

<u>Schema:</u>

```xml
    <ECEntityClass typeName="SketchSplineGridSurface" description="An extruded spline GridSurface element.">
        <BaseClass>PlanGridSplineSurface</BaseClass>
        <ECProperty propertyName="Spline2d" displayLabel="Spline2d" typeName="Bentley.Geometry.Common.IGeometry" description="Surface construction spline curve geometry relative to the modeled GridSystem placement"/>
    </ECEntityClass>
```


### GridAxisContainsGridSurfaces

A relationship to map `GridAxis` to its `GridSurface`s

<u>Naming:</u>

1.  Named as per standards - noting that `GridAxis` contains `GridSurface` instances.

<u>Schema:</u>

```xml
    <ECRelationshipClass typeName="GridAxisContainsGridSurfaces" modifier="None" strength="embedding" description="maps axis to grouped surfaces">
        <Source multiplicity="(1..1)" roleLabel="contains" polymorphic="true">
            <Class class="GridAxis"/>
        </Source>
        <Target multiplicity="(0..*)" roleLabel="is contained in" polymorphic="true">
            <Class class="GridSurface"/>
        </Target>
    </ECRelationshipClass>
```
