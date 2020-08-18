# **Schema CMAP class diagram style guide**

## **Introduction**

This page provides the recommended style guidelines for creating class diagrams for Schemas using CMAP tools. For more details about CMAP see the [main page](schema-cmap-style-guide) of these guidelines.

- Example CMAP can be found [here](cmap-example\example-class.cmap).
- Template CMAP can be found [here](cmap-example\template-class.cmap).
- CMAP with more examples and situational markings can be found [here](cmap-example\situational-markings.cmap).

## **Colors**

Colors of nodes are determined by the type of the class/entity. This style guide provides a default set of colors to use, but they **can be overridden in different contexts** if needed - in such cases the legend must be updated.

Bellow are listed default colors by class/entity type (all colors can be picked from the defaults provided in the CMAP tools):

- `Elements\Models`
  - `Definition` - light cyan (#EDF4F6)
  - `Physical` - light blue (#96C8FF)
  - `Functional` - light green (#C8FFC8)
  - `Spatial Location` - light yellow (#FFFF96)
- `Other`
  - `Aspects` - light orange (#FFC896)
  - `Relationships` - purple (#C896FF)
  - `Mixins, Structs, Enums, Other` - grey (#C8C8C8)

![Colors](cmap-example\media\class\colors.png)

## **Shapes, outlines and Class name style**

All entity classes have **rectangle** shape with **margin 8**.
Outline and class name style of nodes are determined by the class modifier:
|Modifier            |Class name style|Line style|Line thickness|
|--------------------|----------------|----------|-------------:|
|`Abstract`          |bold + italic   |dotted    |1             |
|`None (default)`    |bold            |solid     |1             |
|`Sealed`            |bold + underline|solid     |2             |

![Shapes](cmap-example\media\class\shapes.png)

## **Inheritance/Relationships**

Arrows should be **straight, solid lines** (can have break points) with line **thickness 1**. Note that existence of a label on the arrow indicates that this is a relationship and not inheritance.

- `Inheritance` - arrow pointing from derived class to base class with **no label** (CMAP shortcut: <kbd>Ctrl</kbd>+<kbd>Drag</kbd>). You should always aim to put the base class above the derived class.
- `Relationship` - arrow pointing from source to target end point, with a **required label** describing the relationship. Good practice is to include the strength and UML like multiplicity ([link](https://www.uml-diagrams.org/multiplicity.html)) of the relationship, but this may be in free form.

![Inheritance/Relationships](cmap-example\media\class\relationships.png)

Relationships can be detailed by linking the label to the relationship class definition similarly like "association class" pattern in UML. The link should have **no arrows** and have a **dotted line, thickness 1**.

![Association classes](cmap-example\media\class\relationships-details.png)

## **Content**

The following style guide applies to all definitions: classes, structs, relationships etc. All text in a node should be **left aligned**.
Class contents in order:

- `Stereotype` - (optional) see [Stereotypes](#stereotypes) for more details
- `Class name` - **bold text**, first line if stereotype is not present
- `Description` - (optional) right after class name, **italic text**
- `Properties` - (optional) list of properties in the form: `'- <name><separator> <type> [<description>]'` where:
  - `name` - name of the property
  - `separator` - ":" if it's a regular property or " ->" if it's a navigation property
  - `type` - type of the property, this might be:
    - `primitive` - ec primitive types ([full list](https://imodeljs.github.io/iModelJs-docs-output/bis/ec/primitive-types/)) e.g. string, double, point3d, IGeometry, etc.
    - `array` - double[], SomeStruct[], etc.
    - `enum` - name of the enum e.g. "SomeEnum"
    - `navigation` - name of the end point class e.g. "PhysicalElement"
  - `description` - (optional) description in italic, should start in new line

![Content](cmap-example\media\class\content-elements.png)

`Source` and `Target` properties of relationship classes can be defined in the form: `'- <endPoint>: <multiplicity>, <class>, [polymorphic]'` where:

- `endPoint` - relationship end point, either "Source" or "Target"
- `multiplicity` - UML like multiplicity ([link](https://www.uml-diagrams.org/multiplicity.html)) of the relationship in the form (x..y)
- `class` - class name of the relationship end point
- `polymorphic` - (optional) "polymorphic" suffix if relationship end point is polymorphic

![Content](cmap-example\media\class\content-relationships.png)

## **Stereotypes**

UML like **stereotypes** (profile classes) can be optionally added for nodes to add context specific meaning.

Stereotypes should be defined in the form: `'<<Name>>'`, should be placed as the first line in a node and start with an upper-case letter.

Following stereotypes **must** be added for:

- `Relationship class` - **&lt;&lt;Relationship>>**
- `Aspect class` - **&lt;&lt;Aspect>>**
- `Mixin class` - **&lt;&lt;Mixin>>**
- `Struct` - **&lt;&lt;Struct>>**
- `Enumeration` - **&lt;&lt;Enum>>**

![Stereotypes](cmap-example\media\class\stereotypes.png)

## **Example**

Full CMAP containing below shown example can be found [here](cmap-example\example-class.cmap).

![Example](cmap-example\media\class\example.png)

## **Additional guidelines**

- Classes referenced from other schemas should be prefixed with schema alias in the form: `'<alias>:<name>'` e.g. "bis:DefinitionElement"
- In class diagrams you should always aim to put the base class above the derived class.

## **Situational examples**

Full CMAP containing below shown examples can be found [here](cmap-example\situational-markings.cmap).

- In bigger cmaps placing inheritance/relationship arrows might be
difficult as the line might extend long distances or cut through other classes.
In such cases one could use the following marking:
have a single definition for the class and then place arrows to new nodes
containing only the name of the referenced class.

![Situational](cmap-example\media\class\situational-gaps.png)

- In cases where some base class has many derived classes one could represent that by
some sort of grouping like the following.

![Situational](cmap-example\media\class\situational-inheritance.png)