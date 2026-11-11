# Schema Localization

Schema localization provide translated labels and descriptions for the respective schemas and their items.

## File Naming Convention

Localization files follow a specific pattern.

- For WIP schemas:
```
{SchemaName}.{locale}.json
```

- For release schemas:
```
{SchemaName}.{version}.{locale}.json
```

- **`{SchemaName}`** — exact schema name, case-sensitive (e.g., `BuildingPhysical`)
- **`{version}`** — exact schema version (e.g., `01.00.00`)
- **`{locale}`** — a BCP 47 language tag. Use a base language tag (`de`, `fr`, `es`) for broad coverage, or a region-specific tag (`es-CO`, `de-AT`) for regional overrides

**Examples:**

- For a WIP, `BuildingPhysical` ecschema:

```
BuildingPhysical.es.json
BuildingPhysical.es-CO.json
BuildingPhysical.de.json
```

- For a release, `BuildingPhysical` ecschema version `01.00.00`:

```
BuildingPhysical.01.00.00.es.json
BuildingPhysical.01.00.00.es-CO.json
BuildingPhysical.01.00.00.de.json
```

## File Structure

Localization files are JSON documents with the following top-level fields:

| Field | Required | Description |
|---|---|---|
| `$schema` | **Yes** | Schema identifier for the localization format. |
| `name` | **Yes** | The schema name. Must match the schema actual name. |
| `version` | **Yes** | Schema version string (e.g., `"01.00.00"`). Only the major version is validated. |
| `locale` | **Yes** | The locale this file targets (e.g., `"de"`, `"es-CO"`). Must match the locale in the filename. |
| `label` | No | Localized display label for the schema itself. |
| `description` | No | Localized description for the schema itself. |
| `items` | No | Map of schema item names to their localized text (see [Items](#items)). |

### Items

The `items` object can contain any `item` of a schema like classes, enumerations, etc. Each item must be represented with the exact item name (case-sensitive) from the actual schema

| Field | Required | Description |
|---|---|---|
| `label` | No | Localized display label for the item. |
| `description` | No | Localized description for the item. |
| `members` | No | Map of member names to their localized text (see [Members](#members)). |

For example, if `Building` item is present in our localization: 

```json
  "items": {
    "Building": {
      "label": "Gebäude",
      "description": "Eine physische Gebäudestruktur."
    }
```

it means that it is representing the `Building` item from the actual schema.

### Members

The `members` object inside an item represents its `properties` or `enumerators` which must also follow the exact match naming:

| Field | Required | Description |
|---|---|---|
| `label` | No | Localized display label for the member. |
| `description` | No | Localized description for the member. |

For example, **Height** is the property of **Building** class item: 

```json
  "items": {
    "Building": {
      "label": "Gebäude",
      "description": "Eine physische Gebäudestruktur.",
      "members": {
        "Height": {
          "label": "Höhe",
          "description": "Die Höhe des Gebäudes in Metern."
        }
      }
    }
  }
```

## Content Guidelines

- **Only translate `label` and `description`.** Do not translate item names or member names — these are identifiers used in code and must remain as defined in the schema.
- **`label` and `description` are independently optional.** Provide only the fields that have meaningful translations. Missing fields fall back to the original schema value.
- **`label` should be a short, display-ready string** suitable for use in a UI (e.g., a dropdown option, a column header, or a tooltip title).
- **`description` should be a complete sentence** describing the element, ending with a period.

## Version Validation

We make sure that the localization file is compatible with the version of the schema being used. Only the **major version** is compared. In short, localization file will be discarded if the major version of localization json do not match to the read version of the actual schema.

## Example

The following example localizes a `BuildingPhysical` schema into German (`de`) in the file `BuildingPhysical.de.json`:

```json
{
  "$schema": "ecschema-localization-v1",
  "name": "BuildingPhysical",
  "version": "01.00.00",
  "locale": "de",
  "label": "Physisches Gebäudeschema",
  "description": "Schema für physische Gebäudeelemente.",
  "items": {
    "Building": {
      "label": "Gebäude",
      "description": "Eine physische Gebäudestruktur.",
      "members": {
        "Height": {
          "label": "Höhe",
          "description": "Die Höhe des Gebäudes in Metern."
        },
        "Name": {
          "label": "Name"
        }
      }
    },
    "BuildingType": {
      "label": "Gebäudetyp",
      "description": "Arten von Gebäuden.",
      "members": {
        "Residential": {
          "label": "Wohngebäude",
          "description": "Ein Wohngebäude."
        },
        "Commercial": {
          "label": "Gewerbegebäude",
          "description": "Ein Gewerbegebäude."
        }
      }
    }
  }
}
```

And a region-specific override for Colombian Spanish (`es-CO`) in the file `BuildingPhysical.es-CO.json`:

```json
{
  "$schema": "ecschema-localization-v1",
  "name": "BuildingPhysical",
  "version": "01.00.00",
  "locale": "es-CO",
  "label": "Esquema de Construcciones",
  "items": {
    "Building": {
      "label": "Construcción",
      "description": "Una estructura física de construcción."
    }
  }
}
```

## Directory Structure

The wip and release versions of localizations files must be in respective `Locales` directory which must be created (if not already exists) on the same level where the actual schema is present. For example:

```shell
\Domains\4-Application\{DomainGroupName}\{Domain1}\Locales\{SchemaName}.{locale}.json
\Domains\4-Application\{DomainGroupName}\{Domain1}\Released\Locales\{SchemaName}.{version}.{locale}.json
```

After creating the localization files and placing them accoding to the described structure update the inventory.

## Localization Validation

To validate the localization file locally for any potential issues, run following command:

```shell
npm run validateLocalizations
```

For details on how our localization API works, see [documentation](https://github.com/iTwin/itwinjs-core/blob/master/docs/learning/metadata/SchemaLocalization.md)