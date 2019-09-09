---
noEditThisPage: true
remarksTarget: Functional.ecschema.md
---

# Functional

The Functional domain schema contains the core classes that define the "Functional" Modeling Perspective.

The "Functional" perspective *sees* an Object not as a physical Entity with form and mass, but as a functional Entity that will perform some activity when in use.

They say "form follows function". Separating the "Functional" perspective from the "Physical" perspective allows independent modeling of "form" and "function". Functional modeling/planning can occur first and be handled by a different responsible party than physical modeling. There is generally more than one physical Entity that could fulfill a given function. The particular physical Entity may be refined throughout the design process and may be changed over the lifetime of the operation of the Object.

The Functional Modeling Perspective is abstract. Domain authors are expected to specialize [FunctionalPartition](#functionalpartition), [FunctionalModel](#functionalmodel), and one or more of the subclasses of [FunctionalElement](#functionalelement) to express their discipline's particular needs for functional modeling, e.g. architectural functional programming or plant process modeling.

## Entity Classes

### FunctionalPartition

A func:FunctionalPartition element establishes a 'Functional' Modeling Perspective for its parent bis:Subject. It is intended to be specialized, and should be considered 'abstract'.

See [Functional](#functional) for a definition of the "Functional" Modeling Perspective.

### FunctionalModel

Should be considered abstract. It should be specialized to hold discipline-specific functional Elements.

### FunctionalElement

Models a particular functional Entity--something that will perform a particular activity when in use. Functional Entities are non-geometric in nature, and are considered to be 'roles' played by an Object.

### FunctionalBreakdownElement
FunctionalBreakdownElement and [FunctionalComponentElement](#functionalcomponentelement) are intended for use together, in a style of functional modeling that does not use sub-models. If you using sub-modeling, then specialize `FunctionalElement` directly.

### FunctionalComponentElement
FunctionalComponentElement and [FunctionalBreakdownElement](#functionalbreakdownelement) are intended for use together, in a style of functional modeling that does not use sub-models. If you using sub-modeling, then specialize `FunctionalElement` directly.

### FunctionalType

The `FunctionalType` of a `FunctionalElement` is distinct from the `PhysicalType` of the `PhysicalElement` that may be used to fulfill the function.

### PhysicalElementFulfillsFunction

There may be other relationships (defined elsewhere) to indicate a `PhysicalType` for `PhysicalElement`s that may potentially be used to fulfill the function.

### DrawingGraphicRepresentsFunctionalElement

Used to relate schematic drawings to `FunctionalElement`s.
