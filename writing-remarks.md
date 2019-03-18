# Writing Remarks for Schema Documentation

## Table of Contents

- [Introduction](#introduction)
- [Example](#example)
- [Adding Remarks to Local Documentation Builds](#adding-remarks-to-local-documentation-builds)

---

## Introduction

 Remarks provide extra information about the Schema markdown documentation. Since the markdown is auto-generated, any remarks to be made must be provided in a separate file, accompanying the schema markdown file. The [BeMetalsmith](http://builds.bentley.com/prgbuilds/AzureBuilds/Bemetalsmith-Docs/public/)  tool merges the files and includes the remarks for each schema item matched.

## Example

 For example, a file named `Fields.ecschema.md` with remarks intended to be in the generated markdown should  be accompanied with a file named `Fields.remarks.md` in order for BeMetalsmith to merge the files. For example, say `Fields.ecschema.md` contains the following content:

```markdown

# Fields

**alias**: MyFields

**version:** 1.0

**description**: Example description

## Entity Classes

### **RedField** (Red Field Label) *Sealed*

**typename:** EntityClass

**description:** A red field

### **GreenField** (Green Field Label)

**typename:** EntityClass

**description:** A green field

#### Properties

|    Name    |    Description    |    Type    |      Extended Type     |
|:-----------|:------------------|:-----------|:-----------------------|
|Description|Description of the field|string||
|Data|Encoded field properties|binary||

```

Remarks can be made for each header (any line beginning with `#` represents a header). In order to provide a remark for each header in the above file, `Fields.remarks.md` should contain the following content:

```markdown

---
remarksTarget: Fields.ecschema.md
---

# Fields

An area of land marked by the presence of particular objects or features.

## Entity Classes

These are the entity classes Field contains.

### RedField

A distinctively red field.

### GreenField

A distinctively green field.

```

Adding `remarksTarget: ***.ecschema.md` to frontmatter of the file indicates that the remarks in this file should be linked to the corresponding schema. Without this property defined the remarks file will not be acknowledged.

Note that despite the styling applied to SchemaItem headers by [ecjson2md](/_git/ecjson2md), BeMetalsmith will detect match the remarks with the header such that `# **text** (text Label)` matches `# text`. Remarks for a schema item will be inserted before its properties, as its properties can also have a general remark.

Below represents the expected content `Fields.ecschema.md` will have when BeMetalsmith merges the remarks.

```markdown

# Fields

**alias**: MyFields

**version:** 1.0

**description**: Example description

An area of land marked by the presence of particular objects or features.

## Entity Classes

### **RedField** (Red Field Label) *Sealed*

**typename:** EntityClass

**description:** A red field

A distinctively red field.

### **GreenField** (Green Field Label)

**typename:** EntityClass

**description:** A green field

A distinctively green field.

#### Properties

|    Name    |    Description    |    Type    |      Extended Type     |
|:-----------|:------------------|:-----------|:-----------------------|
|Description|Description of the field|string||
|Data|Encoded field properties|binary||

```

Below is the markdown output of the same file.

---

# Fields

**alias**: MyFields

**version:** 1.0

**description**: Example description

An area of land marked by the presence of particular objects or features.

## Entity Classes

### **RedField** (Red Field Label) *Sealed*

**typename:** EntityClass

**description:** A red field

A distinctively red field.

### **GreenField** (Green Field Label)

**typename:** EntityClass

**description:** A green field

A distinctively green field.

#### Properties

|    Name    |    Description    |    Type    |      Extended Type     |
|:-----------|:------------------|:-----------|:-----------------------|
|Description|Description of the field|string||
|Data|Encoded field properties|binary||

---

## Adding Remarks to Local Documentation Builds

To include remarks files in a local [iModel.js doc site build](/_wiki/wikis/iModelTechnologies.wiki?wikiVersion=GBwikiMaster&pagePath=%2FiModel%20Technology%2FiModel.js&pageId=309):

- Drop both the `ecschema.md` and `remarks.md` files in the relevant `docs` folder, e.g in `core` or `ui`.
- If the `ecschema.md` file already exists, copy over just the `remarks.md` file.
- To preview the changed site, run the build command `buildDocSite` against the folder that has the new remarks. This will automatically open the site in the browser when it completes.
