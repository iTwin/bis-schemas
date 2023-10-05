---
noEditThisPage: true
remarksTarget: Fasteners.ecschema.md
---

# Fasteners

This schema contains classes that are used to model the real-world physical entities such as welds or bolts that connect or join structural members for the purpose of transfering forces between members or establish end conditions that either transfer forces or release the member in a given degree of of freedom in accordance with the design intent.

Due to the importance of IFC in coordinating physical infrastructure, the classes in the schema are intended to have a 1:1 instance mapping (not *class* mapping!) with IFC that will work for transformations in either direction.  It is expected that round-trip transformations may result in changes that provide an *equivalent*, but not *identical* model.

## Entity Classes

### FastenerComponent

`FastenerComponent` is used to represent a `StructuralComponent` that is used (often with other `FastenerComponent`s) to fasten  `PhysicalElement`s together.

<!-- ********** FastenerComponent hierarchy starts here ********** -->

### Bolt

`Bolt`s are almost always of standard manufacture and hence are almost always associated with a `BoltType`s through the `BoltIsOfBoltType` relationship.

### Washer

`Washer`s are almost always of standard manufacture and hence are almost always associated with a `WasherType`s through the `WasherIsOfWasherType` relationship.

### Nut

`Nut`s are almost always of standard manufacture and hence are almost always associated with a `NutType`s through the `NutIsOfNutType` relationship.

### Weld

`Weld`s are not manufactured, but are almost always classified by type (which includes size) and hence are almost always associated with a `WeldType`s through the `WeldIsOfWeldType` relationship.

<!-- ********** FastenerComponentType hierarchy starts here ********** -->

### FastenerComponentType

Most `FastenerComponent`s are standard manufactured items and hence are defined via a `FastenerComponentIsOfFastenerType` relationship to a `FastenerType`.

An example of a `FastenerComponentType` is a *Galvanized 3/4" A325 bolt, 3" long*.

### WeldType

`WeldType` is used to represent the material, shape and the nominal size of a `Weld`. The welding process is sometimes included also. `WeldType` does not include the *length* of a weld, that is specified in the `Weld`s that are related to the `WeldType`.

An example of a WeldType is a *1/4" fillet weld with E70XX electrodes*.