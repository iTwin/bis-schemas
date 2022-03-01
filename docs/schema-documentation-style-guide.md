# Schema Documentation Style Guide

The goal of the schema documentation is to clarify:

- What is the goal of the schema
- How should the schema be used
- Why is the schema done this way

## General Guidelines

1. One `.remarks.md` per `.ecschema.xml`
1. Name the `remarks.md` using the same name as the ECSchemas
1. Do not add `-00.00.00` to the filename.

## **Documentation Style Guide (Schema Xml file)**

* Use single-sentence definitions in the descriptions. Leave further details to be explained in the remarks file.

`Do`: 
```xml 
typeName=”Thing” description=”A bis:PhysicalElement modeling a generic object.”.
```
`Don’t`: 
```xml
typeName=”Thing” description=”A bis:PhysicalElement modeling a generic object. Its Category is expected to be… Its GeometryStream can contain multiple Paths representing the edges of the mesh…” 
```
* Do not use the term being defined in its description.
* In general, use the base class in the description.
* Use schema alias when referring to classes outside of current schema.
* Start descriptions with upper-case and end them with “.”.
* Use case-sensitive names when referring to other classes or properties in from a description.
* Get inspiration from equivalent definitions in relevant standards (e.g. IFC, ISO, etc) while coming up with the appropriate description for a class.

`Do`: 
```xml
typeName=”Thing” description=”A bis:PhysicalElement modeling a generic object.”
```
`Don’t`:
```xml
typeName=”Object” description=”an object”
```

## **Documentation Style Guide for the Remarks file**

### General Guidelines

Avoid duplicating or paraphrasing the single-sentence description from the XML file. Picture the merging of the description from the XML file with the content in the remarks in order to avoid being repetitive. 

`Do`:

XML: 
```xml
typeName=”Thing” description=”A bis:PhysicalElement modeling a generic object.”
```
Remarks: 
```
Instances of `Thing` shall be contained in a `PhysicalModel`.
```

`Don’t`: 

XML: 
```xml
typeName=”Thing” description=”A bis:PhysicalElement modeling a generic object.”
```
Remarks: 
```
A `Thing` is a generic object. Instances of `Thing` shall be contained in a `PhysicalModel`.
```

### Schema diagrams

1. Add .cmap in media folder
1. Export .cmap as .png file
1. .cmap style guide and examples can be found [here](schema-cmap-style-guide.md)
1. For complex schemas, it is a good idea to provide more than one diagram. The initial diagram can cover only the core pattern or structure of the schema while other diagrams can depict additional subsystems or subclasses.
1. Add links to class and instance screenshots of associated cmaps at the end of the schema overview remarks.

### Guidelines for the Schema Overview

Clarify the purpose of the schema and whether it is the main schema for a particular domain, or an application-specific one.

### Guidelines for Elements

Some questions to think about when writing the documentation for Element classes

- The invariants:
  - What is true for all instances?
  - What is never true for all instances?

- Which Models can contain the Element?
  - How does software decide which Model to put the Element in?
  - What repercussions (or "meaning") does the containment of the Element in a Model have?

- If the class has a GeometryStream that is expected to contain only certain geometric primitives, the remarks should describe them in terms of iTwin.js Typescript class names, not their C++ equivalents. A link to the primitive's documentation is preferred, which can be found under https://www.itwinjs.org/learning/geometry/.

- If instances of the class are typically expected to reference a particular Category, its domain and code should be mentioned.

- A link to the equivalent concept in a relevant standard (if any) – e.g. link to the topic in IFC docs.

- In general, start paragraphs with upper-case and end them with “.”.