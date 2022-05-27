---
noEditThisPage: true
remarksTarget: StructuralPhysical.ecschema.md
---

# StructuralPhysical

This schema contains classes that are used to model the real-world physical entities that comprise the structural systems of infrastructure.

Due to the importance of IFC in coordinating physical infrastructure, the classes in the schema are intended to have a 1:1 instance mapping (not *class* mapping!) with IFC that will work for transformations in either direction.  It is expected that round-trip transformations may result in changes that provide an *equivalent*, but not *identical* model.

## StructuralPhysicalModel

***This class has been deprecated. Do not use.***

Applications, services and components should never create instances of this class. Use `PhysicalModel` instead.

## StructuralElement

`StructuralElement` is a component of the load-bearing structure.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
Blah, blah, blah....

### Mapping to and from IFC

`StructuralElement` is abstract, and hence there is never a need to map to or from `StructuralElement` instances.

<!-- ********** StructuralComponent hierarchy starts here ********** -->

## StructuralComponent

`StructuralComponent` is a part of a `StructuralAssembly`. `StructuralComponent`s represent the building blocks from which `StructuralMember`s, `StructuralConnection`s and other `StructuralAssembly`s are comprised.

`StructuralComponent`s are "atomic" and hence should not have child `Element`s or sub `Model`s.
<!-- TODO: probably need to modify the sentence above to consider feature additions or subtractions....will need to wait until we have clarity on those -->

### Usage

`StructuralComponent`s alway have a parent `StructuralAssembly`.

<!--TODO: It seems we should have a special relationship between StructuralComponent and StructuralAssembly, which inherits from an "Assembles" relationship that does not yet exist.... -->

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

## Masonry

`Masonry` is used to represent a volume of masonry (brick, stone, CMU, etc.) construction. Most often Masonry is a component of `Wall`s or `Column`s but it can have other uses as well.

For masonry components, `Masonry` should be used in place of `ProfileElement` or `Plate` even if the shape of the component satisfies the requirements of those classes.

### Usage

<!-- TODO: we probably want a MasonryType that can be used to specify the masonry units, mortar, etc. -->

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

## CementConcrete

`CementConcrete` is used to represent a volume of concrete made with Portland or similar cements.

For concrete components, `CementConcrete` should be used in place of `ProfileElement` or `Plate` even if the shape of the component satisfies the requirements of those classes.

## Usage

<!-- TODO: Best practice should be a relationship to a Concrete material -->

<!-- TODO: should probably provide some note here how reinforcement is handled -->

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

## ProfileElement

`ProfileElement` is used to represent a `StructuralComponent` volume that has an extruded shape and is not better represented by another `StructuralComponent` subclass.

`ProfileElement` is most commonly used to represent steel or aluminum `StructuralComponent`s that are rolled or extruded.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

## Plate

`Plate` is used to represent a `StructuralComponent` volume that is an extrusion of a 2D shape through a uniform thickness and is not better represented by another `StructuralComponent` subclass.

`Plate` is most commonly used to represent steel or aluminum `StructuralComponent`s that are cut from rolled or extruded plates.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

## FastenerComponent

`FastenerComponent` is used to represent a `StructuralComponent` that is used (often with other `FastenerComponent`s) to fasten  `PhysicalElement`s together.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- ********** FastenerComponent hierarchy starts here ********** -->

## Bolt

xxxxxxxxxxx overview info xxxxxxxx

### Usage

`Bolt`s are almost always of standard manufacture and hence are almost always associated with a `BoltType`s through the `BoltIsOfBoltType` relationship.
<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

## Washer

xxxxxxxxxxx overview info xxxxxxxx

### Usage

`Washer`s are almost always of standard manufacture and hence are almost always associated with a `WasherType`s through the `WasherIsOfWasherType` relationship.
<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

## Nut

xxxxxxxxxxx overview info xxxxxxxx

### Usage

`Nut`s are almost always of standard manufacture and hence are almost always associated with a `NutType`s through the `NutIsOfNutType` relationship.
<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

## Weld

xxxxxxxxxxx overview info xxxxxxxx

### Usage

`Weld`s are not manufactured, but are almost always classified by type (which includes size) and hence are almost always associated with a `WeldType`s through the `WeldIsOfWeldType` relationship.
<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- ********** StructuralAssembly hierarchy starts here ********** -->

## StructuralAssembly

xxxxxxxxxxx overview info xxxxxxxx

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

## StructuralAccessory

xxxxxxxxxxx overview info xxxxxxxx

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- ********** StructuralMember Hierarchy starts here ********** -->

## StructuralMember

`StructuralMember` is a major identifiable `StructuralElement` of the load bearing structure. Subclasses of `StructuralMember` should be used whenever possible in place of `StructuralMember` as they provide a better understanding of the `StructuralMember`.

### Usage

<!-- TODO: explain 2 cases here:
 - low LOD StructuralMember (like produced by bridges now)
 - high LOD StructuralMember (using components, etc.)
 -->
<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
Blah, blah, blah....

### Mapping to and from IFC

| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| `StructuralMember` | (linear geometry) | `IfcMember` | PredefinedType == NOTDEFINED |
| `StructuralMember` | (surface geometry) | `IfcPlate` | PredefinedType == NOTDEFINED |

<!-- do we want to handle IfcPlateStandardCase? -->

<!-- additional mapping notes go here -->

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| `IfcMember`            | PredefinedType != BRACE | `Member` | (none) |
| `IfcPlate`             | PredefinedType != USERDEFINED or NOTDEFINED | `Member` | (none) |
| `IfcPlateStandardCase` | PredefinedType != USERDEFINED or NOTDEFINED | `Member` | (none) |

See `Brace` for the PredefinedType of BRACE.

<!-- additional mapping notes go here -->

## Slab

`Slab` is a plate-like superstructure `StructuralMember` that is primarily horizontal, and that transmits to its support locations (usually `Wall`s and `Column`s) the applied loads, primarily through bending.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
Blah, blah, blah....

### Mapping to and from IFC

| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| `Slab`    | (constraints of standard case met) | `IfcSlabStandardCase` | (none) |
| `Slab`    | (any other) | `IfcSlab` | (none) |

<!-- do we want to handle IfcSlabElementedCase? -->
Nothing in the StructuralPhysical schema maps to `IfcSlabElementedCase`.

<!-- additional mapping notes go here -->

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| IfcSlab   | PredefinedType != BASESLAB | Slab      | (none)  |
| IfcSlabElementedCase | PredefinedType != BASESLAB | Slab      |           |
| IfcSlabStandardCase  | PredefinedType != BASESLAB | Slab      | (none) |

When PredefinedType is BASESLAB, the IfcSlab is mapped to a `FoundationMember`.

<!-- additional mapping notes go here -->

## Wall

`Wall` is a plate-like superstructure `StructuralMember` that is primarily vertical, and that transmits to its base the forces, primarily through compression.

### Usage

 <!-- also explain the structural vs architectural wall case? -->

 <!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
Blah, blah, blah....

### Mapping to and from IFC

| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| `Wall`    | (constraints of standard case met) | `IfcWallStandardCase` | (none) |
| `Wall`    | (any other) | `IfcWall` | (none) |

<!-- do we want to handle IfcWallElementedCase? -->
`IfcWallElementedCase` is never mapped to.

<!-- additional mapping notes go here -->

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| `IfcWall`              | (any) | `Wall` | (none) |
| `IfcWallElementedCase` | (any) | `Wall` | Child `IfcElement`s become child `Elements` |
| `IfcWallStandardCase`  | (any) | `Wall` | (none) |

<!-- additional mapping notes go here -->

## Beam

Beam is a slender superstructure StructuralMember that is primarily horizontal, and that transmits to its ends the applied loads, primarily through bending.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
Blah, blah, blah....

### Mapping to and from IFC

| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| Beam      | (any) | IfcBeam | (none) |

<!-- additional mapping notes go here -->

| From IFC | Condition | To BIS | Condition |
| --------- | --------- | --------- | --------- |
| IfcBeam             | (any) | Beam | (none) |
| IfcBeamStandardCase | (any) | Beam | (none)  |

<!-- additional mapping notes go here -->

## Column

`Column` is a slender superstructure `StructuralMember` that is primarily vertical, and that transmits force to its base, primarily through compression.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
Blah, blah, blah....

### Mapping to and from IFC

| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| `Column`  | (any    ) | IfcColumn |  (none)   |

<!-- additional mapping notes go here -->

| From IFC | Condition | To BIS | Condition |
| --------- | --------- | --------- | --------- |
| IfcColumn | (any)     | `Column`  |   (none)  |
| IfcColumnStandardCase | (any)     | `Column`  |   (none)  |

<!-- additional mapping notes go here -->

## Brace

Brace is a slender superstructure StructuralMember that may have any orientation, and prevents racking behavior, primarily through axial forces.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
Blah, blah, blah....

### Mapping to and from IFC

| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| `Brace`   | (any)     | `IfcMember` | PredefinedType = BRACE |

<!-- additional mapping notes go here -->

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| `IfcMember` | PredefinedType = BRACE | `Brace` | (none) |

<!-- additional mapping notes go here -->

<!-- ********** FoundationMember Hierarchy starts here ********** -->

## FoundationMember

`FoundationMember` is a `StructuralMember` that forms part of the substructure that transfers the loads from the superstructure to the ground. Subclasses of `FoundationMember` should be used whenever possible in place of `FoundationMember` as they provide a better identification of the `FoundationMember`.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
Blah, blah, blah....

### Mapping to and from IFC

| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| `FoundationMember`   | (all) | IfcFooting |  PredefinedType = "notdefined" |

<!-- additional mapping notes go here -->

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| `IfcFooting`   | PredefinedType == CAISSON_FOUNDATION or FOOTING_BEAM or USERDEFINED or NOTDEFINED | `FoundationMember`   | (none) |
| `IfcSlab`   | PredefinedType == BASESLAB | `FoundationMember`   | (none) |

<!-- We need a mat foundation class -->

For all other IfcFooting.PredefinedType values, subclasses of `FoundationMember` should be used.

## SpreadFooting

SpreadFooting is a `FoundationMember` that transfers the load from a small number of superstructure elements (often one) to the ground, spreading the load in two directions. SpreadFootings are sometimes known as "pad footings".

Compared to `StripFooting`s, `SpreadFooting`s tend to have plan dimensions of similar magnitudes (they are not strip-like) and most often support one or two `Column`s instead of `Wall`s. Due to their plan-view dimensions and the geometry of the supported elements, `SpreadFooting`s spread the load of the superstructure in two directions before applying it to the ground.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
Blah, blah, blah....

### Mapping to and from IFC

| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| SpreadFooting | (any) | IfcFooting | PredefinedType = PAD_FOOTING |

<!-- additional mapping notes go here -->

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| IfcFooting | PredefinedType = PAD_FOOTING | SpreadFooting | (none) |

<!-- additional mapping notes go here -->

## StripFooting

`StripFooting` is a linear `FoundationMember` that transfers the load from a linear superstructure element (usually a `Wall`) or a linear series of closely spaced superstructure elements to the ground. As the superstructure element (or elements) spread the load in one direction, the strip footing is only required to spread the load in the perpendicular direction.

Compared to `SpreadFooting`s, `StripFooting`s tend to have one linear plan view dimension much longer than their other dimensions.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
Blah, blah, blah....

### Mapping to and from IFC

| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| StripFooting | (any) | IfcFooting | PredefinedType = STRIP_FOOTING |

<!-- additional mapping notes go here -->

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| IfcFooting   | PredefinedType = STRIP_FOOTING | StripFooting | (none) |

<!-- additional mapping notes go here -->

## PileCap

`PileCap` is a `FoundationMember` that transfers the load from the superstructure to a or `Pile` or group of `Pile`s.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
Blah, blah, blah....

### Mapping to and from IFC

| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| `PileCap`   | (any) | `IfcFooting` | PredefinedType = PILE_CAP |

<!-- additional mapping notes go here -->

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| `IfcFooting`   | PredefinedType = PILE_CAP | `PileCap`   |   (none)        |

<!-- additional mapping notes go here -->

## Pile

`Pile` is a slender `FoundationMember`, substantially underground, intended to transmit forces into load-bearing strata significantly below the surface of the ground.

*(ISO 6707-1: slender structural member, substantially underground, intended to transmit force(s) into loadbearing strata below the surface of the ground.)*

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
Blah, blah, blah....

### Mapping to and from IFC

| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| `Pile`    | (any)     | `IfcPile` | (none) |

<!-- additional mapping notes go here -->

| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| `IfcPile` | (any)     | `PIle`    | (none) |

<!-- additional mapping notes go here -->

<!-- ********** Type classes start here ********** -->

<!-- ********** FastenerComponentType hierarchy starts here ********** -->

## FastenerComponentType

Most `FastenerComponent`s are standard manufactured items and hence are defined via a `FastenerComponentIsOfFastenerType` relationship to a `FastenerType`.

An example of a `FastenerComponentType` is a *Galvanized 3/4" A325 bolt, 3" long*.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

## BoltType

xxxxxxxxxxx overview info xxxxxxxx

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

## WasherType

xxxxxxxxxxx overview info xxxxxxxx

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

## NutType

xxxxxxxxxxx overview info xxxxxxxx

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

## WeldType

`WeldType` is used to represent the material, shape and the nominal size of a `Weld`. The welding process is sometimes included also. `WeldType` does not include the *length* of a weld, that is specified in the `Weld`s that are related to the `WeldType`.

An example of a WeldType is a *1/4" fillet weld with E70XX electrodes*.

### Usage

<!-- add notes about usage here. Placement in models. Parent-child issues; ElementAspects, key relationships. --->
xxxxxxxxxxx usage info xxxxxxxx

### Mapping to and from IFC

<!-- OK to remove this table if a simple sentence explains better. --->
| From BIS  | Condition | To IFC    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->

<!-- OK to remove this table if a simple sentence explains better. --->
| From IFC  | Condition | To BIS    | Condition |
| --------- | --------- | --------- | --------- |
| xxxxxxxxx | xxxxxxxxxx | xxxxxxxx | xxxxxxxxx |

<!-- additional mapping notes go here -->
