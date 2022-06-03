# Schema CMAP style guide

## Concept Maps (CMAP)

Concept Maps (CMAP) is a tool we use to share ideas and visualize schemas. A CMAP consists out of nodes (classes) - bubbles with text, and connections (relationships) between them describing how nodes/concepts interact with each other.

- You can learn more about Concept Maps [here](https://cmap.ihmc.us/docs/learn.php).
- CMAP tools can be downloaded from [here](https://cmap.ihmc.us/cmaptools/cmaptools-download/).

## Introduction

This page provides the recommended style guidelines for creating CMAPs that represent Schema class or instance diagrams. These guidelines are not strict, but one should not diverge far from it - custom labeling, additional marking or color overrides can take place in different contexts or if you feel the need for it, but the core picture should look the same (alignment,  shapes, line styles etc.)

## Guidelines

- [Class Diagram Guidelines](schema-cmap-class-style-guide.md)
- [Instance Diagram Guidelines](schema-cmap-instance-style-guide.md)

## CMAP Tips

### Fix arrowhead Style

In any diagram, the first thing you want to do is correct the arrowhead style:

![styles settings](cmap-example/media/fix-arrowheads.gif)

### Unlabeled lines

To draw arrows/links between nodes with no labels, use <kbd>**Ctrl**</kbd>+<kbd>**Drag**</kbd>.

### Nested nodes

To create a "nested node": select multiple nodes -> context menu -> Nested Node -> Create

![nested node](cmap-example/media/nested-node.gif)

### Named styles

**"Named styles"** are provided with the template CMAPs, but are not visible by default. To enable them open the main ("Views - CmapTools") window -> Edit -> Preferences -> Cmap Editing -> Show Named styles in the Style Palette (check).

![styles settings](cmap-example/media/styles-settings.gif)
![styles ui](cmap-example/media/styles-ui.gif)