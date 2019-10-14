# **Schema CMAP style guide**

## **Concept Maps (CMAP)**
Concept Maps (CMAP) is a tool we use to share ideas and visualize schemas. A CMAP consists out of concepts - bubbles with text, and connections (relationships) between them describing how concepts interacts with each other.

- You can learn more about Concept Maps [here](https://cmap.ihmc.us/docs/learn.php).
- CMAP tools can be downloaded from [here](https://cmap.ihmc.us/cmaptools/cmaptools-download/).

## **Introduction**
This page lists the recomended style guidelines for CMAPs that represent Schemas. These guidelines are not strict, but one should not diverge far from it - custom labeling and additional marking can take place if you feel the need for it, but the core picture should look the same (alignment, colors, shapes, line styles etc.)

- Example CMAP can be found [here](.\cmap-example\example.cmap).
- Template CMAP can be found [here](.\cmap-example\template.cmap).
- CMAP with more examples and situational markings can be found [here](.\cmap-example\situational-markings.cmap).

## **Core guidelines**

### **Colors**
Colors of concepts are determined by the type of the class/entity. All bellow listed colors can be picked from the defaults provided in the CMAP tools:
- `Elements\Models`
  - `Definition` - light cyan (#EDF4F6)
  - `Physical` - light blue (#96C8FF)
  - `Functional` - light green (#C8FFC8)
  - `Spatial Location` - light yellow (#FFFF96)
- `Other`
  - `Aspects` - light orange (#FFC896)
  - `Mixins, Structs, Enums, Relationships, Other` - grey (#C8C8C8)

![Colors](.\cmap-example\media\colors.png)

### **Shapes and outlines**
Shapes and outlines of concepts are determined by the class modifier if it is of entity type. Non-element concepts fall into a single style:
|Type / Modifier|Shape|Margin|Line style|Line thickness|
|---------------------|-----------------|--:|-------|--:|
|`Abstract`           |rounded rectangle|4  |dotted |1  |
|`Mixin`              |rectangle        |8  |dotted |1  |
|`None (default)`     |rounded rectangle|4  |solid  |1  |
|`Sealed`             |rounded rectangle|4  |solid  |2  |
|`Struct, Enum, Other`|rectangle        |8  |solid  |2  |

![Shapes](.\cmap-example\media\shapes.png)

### **Inheritance/Relationships**
Arrows should be **straight lines** (can have break points) with line **thickness 1**.
- ``Inheritance`` - solid arrow pointing from derived class to base class with no label (CMAP shortcut: <kbd>Ctrl</kbd>+<kbd>Drag</kbd>). You should always aim to put the base class above the derived class.
- ``Relationship`` - dotted arrow pointing from source to target end point, with label describing the relationship. Good practice is to include the strength and multiplicity of the relationship, but this may be in free form.

![Inheritance/Relationships](.\cmap-example\media\relationships.png)

### **Content**
All text in a concept should be **left aligned**.
Class contents in order:
- ``Class name`` - first line, **bold text**
- ``Description`` - (optional) right after class name, **italic text**
- ``Properties`` - (optional) list of properties in the form: ``'- <name>: <type> [<description>]'`` where:
  - ``name`` - name of the property
  - ``type`` - type of the property, this might be:
    - `primitive` - ec primitive types ([full list](https://imodeljs.github.io/iModelJs-docs-output/bis/ec/primitive-types/)) e.g. string, double, point3d, IGeometry, etc.
    - `array` - double[], SomeStruct[], etc.
    - `enum` - name of the enum e.g. "SomeEnum"
    - `navigation` - name of the end point class e.g. "PhysicalElement"
  - ``decription`` - (optional) description in italic, should start in new line

![Content](.\cmap-example\media\content-elements.png)

``Source`` and ``Target`` of relationship classes can be defined in the form: ``'- <endPoint>: <multiplicity>, <class>, [polymorphic]'`` where:
- ``endPoint`` - relationship end point, either "Source" or "Target"
- ``multiplicity`` - multiplicity of the relationship in the form (x..y), see [bis documentation](https://imodeljs.github.io/iModelJs-docs-output/bis/ec/ec-relationship-class/#attributes) for details
- ``class`` - class name of the relationship end point
- ``plymorphic`` - (optional) "polymorphic" sufix if relationship end point is polymorphic

![Content](.\cmap-example\media\content-relationships.png)

## **Additional guidelines**
- Classes referenced from other schemas should be prefixed with schema alias in the form: ``'<alias>:<name>'`` e.g. "bis:DefinitionElement"

## **Example**
Full CMAP containing below shown example can be found [here](.\cmap-example\example.cmap).

![Example](.\cmap-example\media\example.png)

## **Situational examples**
Full CMAP containing below shown examples can be found [here](.\cmap-example\situational-example.cmap).

- In biger cmaps placing inheritance/relationship arrows might be
difficult as the line might extend long dsitances or cut through other classes.
In such cases one could use the following marking:
have a single definition for the class and then place arrows to new concepts
containing only the name of the referenced class.

![Situational](.\cmap-example\media\situational-gaps.png)

- In cases where some base class has many derived classes one could represent that by
some sort of grouping like the following.

![Situational](.\cmap-example\media\situational-inheritance.png)