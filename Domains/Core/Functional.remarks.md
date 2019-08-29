---
noEditThisPage: true
remarksTarget: Functional.ecschema.md
---

# Functional

The Functional domain schema contains the core classes that define the "Functional" Modeling Perspective.

The "Functional" perspective *sees* an Object not as a physical Entity with form and mass, but as a functional Entity that will perform some activity when in use.

They say "form follows function". Separating the "Functional" perspective from the "Physical" perspective allows independent modeling of "form" and "function". Functional modeling/planning can occur first and be handled by a different responsible party than physical modeling. There is generally more than one physical Entity that could fulfill a given function. The particular physical Entity may be refined throughout the design process and may be changed over the lifetime of the operation of the Object.

The Functional Modeling Perspective is abstract. Domain authors are expected to specialize [FunctionalPartition](#functionalpartition), [FunctionalModel](#functionalmodel), and one or more of the subclasses of [FunctionalElement](#functionalelement) to express their disciplines particular needs for functional modeling, e.g. architectural functional programming or plant process modeling.

## Entity Classes

### FunctionalPartition

A func:FunctionalPartition element establishes a 'Functional' Modeling Perspective for its parent bis:Subject. It is intended to be specialized, and should be considered 'abstract'.

See [Functional](#functional) for a definition of the "Functional" Modeling Perspective.

### FunctionalModel

Should be considered abstract. It should be specialized to hold discipline-specific functional Models.

### FunctionalElement

Models a particular functional Entity--something that will perform a particular activity when in use. Functional Entities are non-geometric in nature, and are considered to be 'roles' played by an Object.

If you are designing a specialization of `FunctionalElement` that will have children, then specialize [FunctionalBreakdownElement](#functionalbreakdownelement).

If you are designing a specialization of `FunctionalElement` that will not have children and will not be sub-modeled, then specialize [FunctionalComponentElement](#functionalbreakdownelement).

If you are designing a specialization of `FunctionalElement` that will be sub-modeled, then specialize [FunctionalElement](#functionalelement) directly.

### FunctionalBreakdownElement

This specialization of `FunctionalElement` models an aggregate functional Entity with child functional Entities modeling its parts.

### FunctionalComposite

This class will be DEPRECATED in an upcoming release. Use your own specialization of [FunctionalBreakdownElement](#functionalbreakdownelement) instead.

### FunctionalComponentElement

This specialization of `FunctionalElement` models an 'atomic' functional Entity which will not be sub-modeled at a finer granularity and does not have 'child' parts.

### FunctionalType

The `FunctionalType` of a `FunctionalElement` is distinct from the `PhysicalType` of the `PhysicalElement` that may be used to fulfill the function.

### PhysicalElementFulfillsFunction

`PhysicalElementFulfillsFunctionThis` models the relationship between the functional Entity and the physical Entity that actually fulfills it. There may be other relationships (defined elsewhere) to indicate a `PhysicalType` for `PhysicalElement`s that may potentially be used to fulfill the function.

### DrawingGraphicRepresentsFunctionalElement

Used to relate schematic drawings to `FunctionalElement`s.
