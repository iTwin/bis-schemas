# Schema Documentation Style Guide

Goal of the schema documentation is to clarify:

- What is the goal of the schema
- How should the schema be used
- Why is the schema done this way

## General Guidelines

1. One `.remarks.md` per `.ecschema.xml`
1. Name the `remarks.md` using the same name as the ECSchemas
1. Do not add `-00.00.00` to the filename.

## Schema diagrams

1. Add .cmap in media folder
1. Create screenshot of cmap at 150%
1. Add legend (Bis section, Abstract (dashed line), Mixin (square box), Sealed)
1. Color yellow:spatial location, green:functional, grey:definition
1. Class is shown in rounded rectangle.
1. Relationships are shown as arrows.
1. Clean up the diagram make vertical lines vertical, horizontal lines horizontal.

## Guidelines for Elements

Some questions to think about when writing the documentation for Element classes

- The invariants:
  - What is true for all instances?
  - What is never true for all instances?

- Which Models can contain the Element?
  - How does software decide which Model to put the Element in?
  - What repercussions (or "meaning") does the containment of the Element in a Model have?
