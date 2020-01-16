# **Schema CMAP style guide**

## **Concept Maps (CMAP)**
Concept Maps (CMAP) is a tool we use to share ideas and visualize schemas. A CMAP consists out of nodes (classes) - bubbles with text, and connections (relationships) between them describing how nodes/concepts interact with each other.

- You can learn more about Concept Maps [here](https://cmap.ihmc.us/docs/learn.php).
- CMAP tools can be downloaded from [here](https://cmap.ihmc.us/cmaptools/cmaptools-download/).

## **Introduction**
This page provides the recommended style guidelines for creating CMAPs that represent Schema class or instance diagrams. These guidelines are not strict, but one should not diverge far from it - custom labeling, additional marking or color overrides can take place in different contexts or if you feel the need for it, but the core picture should look the same (alignment,  shapes, line styles etc.)

## **Guidelines**

- **Class diagram**
  - [Guidelines](.\schema-cmap-class-style-guide)
  - [Example](.\cmap-example\example-class.cmap)
  - [Template](.\cmap-example\template-class.cmap)
- **Instance diagram**
  - [Guidelines](.\schema-cmap-instance-style-guide)
  - [Example](.\cmap-example\example-instance.cmap)
  - [Template](.\cmap-example\template-instance.cmap)

## **CMAP Tips**
- **"Named styles"** are provided with the template CMAPs, but are not visible by default. To enable them open the main ("Views - CmapTools") window -> Edit -> Preferences -> Cmap Editing -> Show Named styles in the Style Palette (check).

![styles settings](.\cmap-example\media\styles-settings.gif)
![styles ui](.\cmap-example\media\styles-ui.gif)

- To draw arrows/links between nodes with no labels: <kbd>**Ctrl**</kbd>+<kbd>**Drag**</kbd>.
- To create a "nested node": select multiple nodes -> context menu -> Nested Node -> Create

![nested node](.\cmap-example\media\nested-node.gif)
