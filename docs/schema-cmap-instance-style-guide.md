# **Schema CMAP instance diagram style guide**

## **Introduction**
This page provides the recommended style guidelines for creating **instance** diagrams for Schemas using CMAP tools. For more details about CMAP see the [main page](.\schema-cmap-style-guide) of these guidelines.

- Example CMAP can be found [here](.\cmap-example\example-instance.cmap).
- Template CMAP can be found [here](.\cmap-example\template-instance.cmap).

## **Colors**
This style guide provides a default set of colors to use, but they **can be overridden in different contexts** if needed - in such cases the legend must be updated.

For **Models** colors are determined by the type of the model:
- `Information` - light cyan (#EDF4F6)
- `Physical` - light blue (#96C8FF)
- `Functional` - light green (#C8FFC8)
- `Spatial Location` - light yellow (#FFFF96)
- `Drawing` - purple (#C896FF)

![Model colors](.\cmap-example\media\instance\colors-models.png)

All **Elements** are colored white (#FFFFFF) since element type can be inferred from their Model type.

![Element colors](.\cmap-example\media\instance\colors-elements.png)

## **Shapes and outlines**
Models are represented by a **nested node** (see [CMAP tips](.\schema-cmap-style-guide#cmap-tips))

Both Models and Elements should have a **rounded rectangle** shape, **solid line, thickness 1** outline and **margin 4 (default)**.

![Element colors](.\cmap-example\media\instance\shapes.png)

## **Relationships**

All relationship arrow are represented by a **solid arrow** with **thickness 1**.

- `Parent owns child` - arrow pointing from child element to its parent element. **By default no label** should be added, but if a specialized parent-child relationship is relevant for the given context, custom label can be added.
- `Model sub-models Element` - arrow pointing from model to a sub-modeled element (i.e. element that the model breaks down). **By default no label** should be added, but if there's a need for one, the best fitting and preferred term would be "sub-models".
- `Other relationships` - arrow pointing from the source element to the target element with a **required label** describing the relationship. Common labels are "refers to" and "drives", but can be context or discipline specific labels.

![Relationships](.\cmap-example\media\instance\relationships.png)

## **Content**
The following style guide applies to all **Element** instances (aspects included).
Instance contents in order:
- `Class name` - **bold text**, first line
- `Code/UserLabel` - (optional) right after class name, surrounded by quotation marks e.g. `"The Taj Mahal"`
- `Properties` - (optional) list of properties in the form: `'- <name> <operator> <value>'` where:
  - `name` - name of the property
  - `operator` - "=" if it's a regular property or "->" if it's a navigation property
  - `value` - value of the property. In case of a navigation property the Code/UserLabel should be added e.g. `"The Taj Mahal"`

![Content](.\cmap-example\media\instance\content.png)

**Models** can have an optional label added denoting concrete type of the model or context specific information like the what real world entity is being modeled. See [shapes and outlines example](#shapes-and-outlines).

## **Additional guidelines**
- In instance diagrams you should always aim to put parent instances above their child instances.

## **Example**
Full CMAP containing below shown example can be found [here](.\cmap-example\example-instance.cmap).

![Example](.\cmap-example\media\instance\example.png)
