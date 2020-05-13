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
1. Export .cmap as .png file
1. .cmap style guide and examples can be found [here](schema-cmap-style-guide.md)

## Guidelines for Elements

Some questions to think about when writing the documentation for Element classes

- The invariants:
  - What is true for all instances?
  - What is never true for all instances?

- Which Models can contain the Element?
  - How does software decide which Model to put the Element in?
  - What repercussions (or "meaning") does the containment of the Element in a Model have?
