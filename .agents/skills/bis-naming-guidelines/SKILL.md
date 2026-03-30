# BIS Naming Guidelines Skill

Guide contributors developing BIS schemas to follow proper naming conventions and best practices for the iTwin/bis-schemas repository.

## When to Use This Skill

Use this skill when:
- Creating new BIS schema files (`.ecschema.xml`)
- Naming ECSchemas, ECClasses, ECProperties, ECRelationships, or ECEnumerations
- Reviewing or validating schema naming conventions
- Working with pull requests on the iTwin/bis-schemas repository
- Contributors ask about BIS naming rules, conventions, or best practices
- Debugging naming-related schema validation errors

## Repository Context

- **Repository**: https://github.com/iTwin/bis-schemas
- **Purpose**: Single-source-of-truth (SSOT) for all Base Infrastructure Schemas (BIS)
- **Schema Language**: EC (Entity-Relationship modeling using Bentley's ECObjects)
- **Documentation**: https://www.itwinjs.org/bis/

## Core Naming Principles

BIS naming conventions are deliberately more restrictive than EC naming rules. All BIS names must be valid EC names, but not all EC names are valid BIS names.

### Universal Rules (MUST Follow)

1. **Only alphanumeric characters** - No special characters allowed
2. **No underscores** - Even for readability (use `OrderLineItem` not `Order_LineItem`)
3. **Cannot start with numbers** - `3dGeometry` is invalid
4. **Case-insensitive uniqueness** - Cannot have both `PriceList` and `Pricelist`
5. **PascalCase only** - Concatenate words with first letter capitalized
6. **US spelling** - Use `Organization` not `Organisation`
7. **No New, Old, Tmp, or Temp** - These become outdated quickly

### Schema and Domain Names

**Rules:**
- All ECSchema/BIS Domain names must be registered with BIS workgroup to avoid conflicts
- Schema aliases must be **lowercase**
- Schema aliases must be **less than 7 characters**
- Examples: `BisCore` (schema) with alias `bis`

**Verification:** Check [BIS Schemas list](https://www.itwinjs.org/bis/domains/) before creating new schemas.

---

## Naming Guidelines by Element Type

### 1. ECClass Names

**Rules:**
- Use **singular form** (e.g., `File` not `Files`)
- Combine terms in **increasing order of significance** (e.g., `CableCar`, `AnalogWaterMeter`)
  - Exception: 2d and 3d come first since names can't start with numerals

**Recommendations:**
- Use the most widely accepted and descriptive name possible
- Prefer a single word (e.g., `Person` rather than `HumanBeing`)
- Don't add superfluous terms (use `Vehicle` not `TransportationVehicle`)
- Avoid unnecessary prefixes/suffixes like `Object`, `Instance`, `Entity`, `Property`
- Keep words under 30 characters
- Don't use prepositions (Of, With, On, An, In, From)

**Special Terms:**

| Term | Rule | Example |
|------|------|---------|
| **Model** | Must suffix with `Model` | `FunctionalModel`, `PhysicalModel` |
| | Exception | `GeometricModel2d`, `GeometricModel3d` |
| **Element** | Only in abstract classes | Drop `Element` suffix in concrete user-facing classes |
| **Aspect** | Suffix for ElementAspects | `UniqueAspect`, `MultiAspect` |
| **Type** | Use for real-world types | `FunctionalType` (not `FunctionalClass` or `FunctionalKind`) |
| **RoleElement** | Don't suffix with `Role` | Use `Resource` or `Asset` not `ResourceRole` |

**Common Mistakes:**
- ❌ `Order_LineItem` → ✅ `OrderLineItem`
- ❌ `TransportationVehicle` → ✅ `Vehicle`
- ❌ `NoteEntity` → ✅ `Note`
- ❌ `DocumentProperty` → ✅ `Document`
- ❌ `RasterBaseModel` → ✅ `RasterModel`

---

### 2. ECProperty Names

**Rules:**
- **Plural for collections**, singular otherwise
  - Example: `Document.AddedBy` (single person) vs `Document.Notes` (many notes)
- **Match underlying type name** when possible
  - Example: `Document.Lock` is of type `Lock`
  - Exception: When entity has multiple attributes of same type or for readability
- **Don't include primitive datatype** in name
  - Exception: Dates (e.g., `DateAdded` is acceptable)
- **Don't include owner name** in property name
  - ❌ `Document.DocumentId` → ✅ `Document.Id`
  - ❌ `Person.PersonName` → ✅ `Person.Name`
- **Boolean properties** must be prefixed with: `Is`, `Has`, `Can`, `May`
  - Examples: `IsUnderChange`, `HasOtherRevision`, `MayChange`
- **Bit masks** use plural form
  - Examples: `StateHints`, `HasFlags`
- **NavigationProperties** should prefer the name of the related ECClass
  - If qualification needed, consider prefixing words from the role label

**Common Mistakes:**
- ❌ `Document.NoteList` → ✅ `Document.Notes`
- ❌ `Document.NoteBlob` → ✅ `Document.Note`
- ❌ `Person.PersonName` → ✅ `Person.Name`
- ❌ `IsChangeable` → ✅ `CanChange` or `MayChange`

---

### 3. ECRelationshipClass Names

Relationship naming balances clarity with brevity. Format: **Source-Verb-Target**

**Rules:**
1. **Fully specify source constraint**
   - Use full class name of source
   - Can drop suffix if it doesn't help understanding
   - Example: `PhysicalElementIsOfType`, `PhysicalSystemServicesElements`

2. **Use specific action-oriented verbs**
   - Prefer: `aggregates`, `holds`, `groups`, `represents`, `services`
   - Avoid: passive verbs like `has` or `relates to`
   - Examples: `DrawingGraphicRepresentsElement`, `PhysicalElementServicesElements`

3. **Verbs must match relationship strength**
   - **Embedding**: `Owns`, `Contains`, `Aggregates`
   - **Referencing**: `Represents`, `Groups`, `Has`, `References`, `RefersTo`
   - **Type relationship**: `IsOf`

4. **Shorten target portion**
   - Use role or shortened form of target constraint
   - Example: `PhysicalElementIsOfType` (not `PhysicalElementIsOfPhysicalType`)

5. **Name indicates multiplicity**
   - Source is always singular
   - Target indicates multiplicity
   - Examples: 
     - `ElementOwnsChildElements` (1:N)
     - `ElementHasLinks` (N:N)
     - `PhysicalElementIsOfType` (N:1)

6. **Don't use conjunctions**
   - ❌ `Marriage` or `ManAndWoman`
   - ✅ `PersonIsMarriedToPerson`

**Standard Relationship Strength Names:**

| Verb(s) | Meaning | Strength |
|---------|---------|----------|
| `Owns`, `Contains`, `Aggregates` | Parent owns child | Embedding |
| `Has`, `References`, `RefersTo` | Pointing to related entity | Referencing |
| `Represents`, `Groups` | Logical grouping/representation | Referencing |
| `IsOf` | Instance of type | Referencing (Type) |

**Common Mistakes:**
- ❌ `ElementHasChildElement` → ✅ `ElementOwnsChildElements` (shows 1:N)
- ❌ `PhysicalElementIsOfPhysicalType` → ✅ `PhysicalElementIsOfType` (redundant)
- ❌ `ElementRelatedToElement` → ✅ Use specific verb like `ElementRepresentsElement`

---

### 4. ECEnumeration Names

**Recommendation:**
- Use descriptive names with no postfix
- Examples: `SurfaceVariation`, `CoordinateSystem`, `ExternalSourceAttachmentRole`

---

## Abbreviations and Acronyms

**General Rule:** Use only where common, expected, and completely unambiguous. Consistency is key.

### Accepted Abbreviations

| Abbreviation | Word |
|--------------|------|
| `Db` | Database (one compound word, not two words) |
| `Id` | Identifier |

### Accepted Acronyms

| Acronym | Phrase | Note |
|---------|--------|------|
| `1d`, `2d`, `3d` | One/Two/Three-Dimensional | Lowercase 'd', only after another term |
| `Html` | HyperText Markup Language | 3+ letter acronyms: first letter capital |
| `EC` | Engineering Content | |
| `IO` | Input/Output | Both letters capitalized (two words) |
| `UI` | User Interface | Both letters capitalized (two words) |
| `Uri` | Universal Resource Identifier | Prefer over Url/Urn |
| `I18N` | Internationalization | Numeronym |
| `L10N` | Localization | Numeronym |

**Acronym Rules:**
- **2-letter acronyms**: Both letters capitalized if each represents different word
  - `UI`, `IO` ✅
  - `Db` ✅ (one compound word)
- **3+ letter acronyms**: Only first letter capitalized
  - `Html`, `Guid` ✅

### Don't Use These

| ❌ Don't Use | ✅ Use Instead |
|--------------|----------------|
| `Desc` | `Description` |
| `Geo`, `Geom` | `Geometry` |
| `Uuid` | `Guid` |
| `Mngt`, `Mgmt` | `Management` |
| `Url`, `Urn` | `Uri` |
| `Def` | `Definition` |
| `Ref` | `Reference` |

---

## Special Cases and Exceptions

### 1d, 2d, 3d Usage

**Special Rules:**
- Only use **after** another term (can't start names with numbers)
- Always **lowercase 'd'**
- Examples: ✅ `Spatial1d`, `Model2d`, `Geometry3d`
- Never use: ❌ `OneDimensional`, `TwoDimensional`, `ThreeDimensional`

**Why:** 
- Can't start with number: ❌ `2dDrawing`
- Should be after term: ✅ `Drawing2d`
- Lowercase for consistency

### Numbers in Names

**Recommendation:** Avoid names like `One21` and `Door2Door`
Exception: 1d, 2d, 3d dimensional terms (see above)

---

## What to Avoid

**Terms/Patterns to Avoid:**

| ❌ Avoid | Reason | ✅ Alternative |
|---------|--------|----------------|
| Organization name | Prefer domain over org | Use `TransportElement` not `ExorElement` |
| Product names | Product-specific | Avoid `eB`, `OpenPlant`, `STAAD`, `Dgn` prefixes |
| Domain names in term | Redundant | Avoid `PlanningElement`, `ConceptualElement` |
| Version numbers | Becomes outdated | Avoid `V8iFile` |
| `Base` in class names | Vague | Use `RasterModel` not `RasterBaseModel` |

---

## Quick Reference Checklist

When naming BIS elements, verify:

- [ ] Uses only alphanumeric characters (no underscores, no special chars)
- [ ] Doesn't start with a number
- [ ] Uses PascalCase
- [ ] Uses US spelling
- [ ] Is unique (case-insensitive)
- [ ] Doesn't use New, Old, Tmp, Temp
- [ ] Class: singular form
- [ ] Class: terms in increasing significance order
- [ ] Property: plural only if collection
- [ ] Property: Boolean prefixed with Is/Has/Can/May
- [ ] Property: Doesn't duplicate owner name
- [ ] Relationship: Source-Verb-Target format
- [ ] Relationship: Verb matches strength
- [ ] Relationship: Indicates multiplicity
- [ ] Abbreviations/acronyms only if widely accepted
- [ ] Special terms (Model, Aspect, Type) used correctly
- [ ] No organization/product/version names

---

## Common Validation Errors

### Underscores in Names
```xml
<!-- ❌ Wrong -->
<ECEntityClass typeName="Order_LineItem" />

<!-- ✅ Correct -->
<ECEntityClass typeName="OrderLineItem" />
```

### Class Name Not Singular
```xml
<!-- ❌ Wrong -->
<ECEntityClass typeName="Documents" />

<!-- ✅ Correct -->
<ECEntityClass typeName="Document" />
```

### Property Includes Owner Name
```xml
<!-- ❌ Wrong -->
<ECProperty propertyName="DocumentId" typeName="long" />

<!-- ✅ Correct -->
<ECProperty propertyName="Id" typeName="long" />
```

### Relationship Missing Multiplicity Indicator
```xml
<!-- ❌ Wrong: Target "Child" is singular but relationship is 1:N -->
<ECRelationshipClass typeName="ElementOwnsChild" />

<!-- ✅ Correct: Shows 1:N relationship -->
<ECRelationshipClass typeName="ElementOwnsChildElements" />
```

### Boolean Property Without Is/Has/Can/May
```xml
<!-- ❌ Wrong -->
<ECProperty propertyName="Editable" typeName="boolean" />

<!-- ✅ Correct -->
<ECProperty propertyName="IsEditable" typeName="boolean" />
<!-- or -->
<ECProperty propertyName="CanEdit" typeName="boolean" />
```

---

## Examples from BIS Core

### Well-Named Classes
```xml
<ECEntityClass typeName="Element" />
<ECEntityClass typeName="PhysicalElement" />
<ECEntityClass typeName="GeometricElement3d" />
<ECEntityClass typeName="AnalogSensor" />
```

### Well-Named Properties
```xml
<ECProperty propertyName="UserLabel" typeName="string" />
<ECProperty propertyName="IsHidden" typeName="boolean" />
<ECProperty propertyName="HasSubCategories" typeName="boolean" />
<ECArrayProperty propertyName="Tags" typeName="string" />
```

### Well-Named Relationships
```xml
<ECRelationshipClass typeName="ElementOwnsChildElements" />
<ECRelationshipClass typeName="ElementOwnsUniqueAspect" />
<ECRelationshipClass typeName="PhysicalElementIsOfType" />
<ECRelationshipClass typeName="GraphicalElement3dRepresentsElement" />
```

---

## Integration with PR Workflow

When reviewing pull requests:

1. **Check schema file naming**: Follows domain group structure
2. **Validate ECSchema name**: Registered and follows conventions
3. **Review all ECClass names**: Singular, PascalCase, no underscores
4. **Review ECProperty names**: Correct singular/plural, Boolean prefixes
5. **Review ECRelationshipClass names**: Source-Verb-Target, multiplicity
6. **Check abbreviations**: Only use accepted ones
7. **Verify special terms**: Model, Aspect, Type used correctly

---

## References

- [BIS Overview](https://www.itwinjs.org/bis/guide/intro/overview/)
- [BIS Naming Guidelines - Rules and Recommendations](https://www.itwinjs.org/bis/guide/naming-guidelines/rules-and-recommendations/)
- [BIS Naming Guidelines - Special Terms](https://www.itwinjs.org/bis/guide/naming-guidelines/special-terms/)
- [BIS Naming Guidelines - Summary of Exceptions](https://www.itwinjs.org/bis/guide/naming-guidelines/summary-of-exceptions/)
- [BIS Naming Guidelines - Standard Abbreviations and Acronyms](https://www.itwinjs.org/bis/guide/naming-guidelines/standard-abbreviations-and-acronyms/)
- [BIS Naming Guidelines - Standard Relationship Strengths](https://www.itwinjs.org/bis/guide/naming-guidelines/standard-relationship-strengths-names/)

---

## Workflow Integration

This skill should be invoked when:
1. User creates or modifies `.ecschema.xml` files
2. User asks about naming conventions, rules, or guidelines
3. PR review identifies potential naming issues
4. Schema validation fails with naming-related errors
5. User requests help with ECClass, ECProperty, or ECRelationship names

The skill provides:
- Validation of proposed names against BIS rules
- Suggestions for corrections
- Examples of proper usage
- Quick reference for common patterns
- Link to official documentation for deep dives
