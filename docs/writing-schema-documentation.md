# Documenting a BIS Schema

The goal of writing schema documentation is to clarify the goal of the schema, how the schema should be used and the reasoning behind the design of the schemas.

Schemas contain descriptions on each of its items but that is meant to be a short one-line description, whereas a lot of the different classes and types within BIS require longer and more detailed explanations.  To support documenting more detailed information, an additional markdown file, a `remarks` file, can be used.

The remarks file lives outside the ECSchema xml allowing for more detail, and images, to be defined in a markdown format.  When creating the documentation site the end result of schema documententation is in the form of a `*.ecschema.md` and `*.remarks.md` file, the combination of the two contains the description in the schema and all of contents of the remarks files.  (Combining the two into a single page is done by the tool __BeMetalsmith__)

More details on how this is happens in the [Writing Schema Docs Section](#writing-schema-remarks).

## Table of Contents

- [Starting a new Remarks File](#starting-a-new-remarks-file)
- [Writing Schema Remarks](#writing-schema-remarks)
  - [Schema Documentation Style Guide](./schema-documentation-style-guide.md)
- [Viewing the Schema Docs in a local iModel.js build](#viewing-the-schema-docs-in-a-local-iModel.js-build)
- [Publishing Schema Documentation](#publishing-schema-documentation)

## Starting a new Remarks File

> There is one remarks file for each ECSchema.

Create a `{schemaName}.remarks.md` file directly next to your schema in this repository with the following content:

```md
---
noEditThisPage: true
remarksTarget: {SchemaName}.ecschema.md
---

# {SchemaName}
```

- Replace `{SchemaName}` with the name of your schema.

## Writing Schema Remarks

The schema remarks are used to enhance the descriptions and information that is available in the ECSchema.  This is done by using a separate file, a `*.remarks.md`.  The `remarks` file has a specific format to allow the tool that creates the iModel.js documentation to merge the ECSchema information with the contents of the remarks.

The basic format for the `remarks.md` is,

- One `#` represents the schema level

    `# {SchemaName}`

  - Must exactly match the schema name defined in xml
- Two `##` is used to specify the Schema Item type
  - i.e. `Entity Classes`, `Enumerations`, `Custom Attribute Classes`
- Three `#` represents a Schema Item, i.e. ECClass, ECEnumeration, KindOfQuantity, etc.

  `### {ECClassName}`

  - Use the value of the `typeName` attribute in the schema, not the full name

Each of the above must be in the appropriate order, all `##` should be under a `#` and all `###` should be under a `##`.

An example of a remarks file for a the [Fields.ecschema.xml](./remarks-example/Fields.ecschema.xml) is available [here](./remarks-example/Fields.remarks.md).

> The [Fields.ecschema.md](./remarks-example/Fields.ecschema.md) is an example of the `ecschema.md` format that is used to create the combined documentation.

For more information visit the [Schema documentation style guide](./schema-documentation-style-guide.md).

## Publishing Schema Documentation

Markdown files are generated and published as an artifact for every released schema by default (see [Docs Generation Build](../tools/MarkdownGeneration/generate-docs.yaml)).  This artifact is published automatically as part of the iModel.js doc build.  To make the schema visible in the iModel.js docs you must add it to the domains index page (docs/bis/domains/index.md) in the iModel.js repo

> WARNING:  When the documentation is added to the iModel.js docs it will be published publicly for anyone to see, so you will need to consider if that's what you want for your domain.

> NOTE: Currently there is no other published location for Schema documentation, only on the iModel.js site.
