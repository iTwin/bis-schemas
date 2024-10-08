# Connector

Schema used by all iModel connectors.

## Rules

### RuleDefinitions

A connector "rule" is a condition or standard that a connector imposes on external entities. For example, all connectors impose the rule that physical elements should be located within the iModel's project extents.

A rule is documented by a `RuleDefinition` element in the iModel. The code value of the RuleDefinition element is the unique name of the rule. The definition also has human-readable properties that explain the meaning of the rule and how the user may be able to solve a violation. The logic for how a rule is checked is part of the connector itself.

There is no fixed set of rules. Different connectors define the rules that apply to their domain or file format. A given connector may add new rules over time. The RuleDefinition elements that are stored in an iModel document the rules that may be checked by the connectors that write to that iModel. RuleDefinitions are meant to be self-documenting. A tool that displays rules and/or sets preferences for rule-checking must use an ECSql query to find the RuleDefinitions in the iModel and must display the properties of the RuleDefinition elements.

The unique name of a RuleDefinition is used as its CodeValue. The CodeValue must be unique across all connectors within an iModel. (The codes of all RuleDefinition elements created by all connectors use the same CodeSpec and are generally stored in the same model. Therefore, CodeValues must be unique.) A connector that defines new rules should use a prefix to make the CodeValues unique, using the format `${domain}/${name}`. The names of the rules defined by the Connector base class have no domain prefix.

### RuleViolations

A connector creates a `RuleViolation` element when it detects that an external entity violates a rule. For example, the connector stores a RuleViolation element that refers to the "withinProjectExtents" rule when it detects a physical element that is outside the iModel's project extents.

#### Violations Refer to External Entities

A rule violation refers to an external entity; it does not refer to an element in the iModel. Why is that? First, a rule violation is caused by an external entity, and the usual way to solve a violation is to go back to the external source and change the entity. Second, the external entity may not correspond to an element in the iModel.

The external entity that is involved in a rule violation may not be represented by any entity in the iModel. This will happen when a violation is treated as an error. (For most rules, severity is configurable. Some rules, such as conversionFailure, are always treated as errors.) In this case, when it detects a violation, the connector will not convert the external entity. It will record and store a record of the violation in the iModel.

Even if the external entity that is involved in a rule violation is represented by element(s) in the model, the mapping may not be unique. There may be 1:many, many:1, or even many:many mappings from external sources to iModel elements.

In some cases, even if the mapping is 1:1, the element in the iModel may not have an ExternalSourceAspect. Many definitions, for example, are based on matching the name and store no other provenance.

To cover all of these cases and to provide a uniform way to find the source of the problem, the RuleViolation element itself identifies the external entity explicitly.

A rule violation identifies the external entity by `Repository`, `Kind`, and `Identifier`.

The violation may also have a `Source` property, identifying a specific external source within the external repository. Source is optional, because an external entity is not always specific to any one external source within an external repository. That is the case for most definition elements, for example. It is up to the connector to consistently supply a Source for violations of a source-specific rule and not to supply a Source for violations or rules that are repository-specific.

#### RuleViolation Identity and Queries

A violation of a source-specific rule is uniquely identified by Repository, Source, Kind, Identifier, and RuleId.

A violation of a repository-specific rule is uniquely identified by Repository, Kind, Identifier, and RuleId.

The following criteria are most commonly used to query violations:

- Repository, Kind
- Repository, Kind, Identifier
- Repository, Kind, Identifier, RuleId

There is an index on RuleViolation to cover these queries.

For source-specific rule violations, the query should also specify the Source to narrow the query.

Queries are often qualified by UpdateId.

#### RuleViolations, Updates, and Resolution

The `UpdateId` property of a violation identifies the update in which it occurred most recently. If the same violation is detected again, its UpdateId property is updated. Thus, you can query violations that occurred in a specific update.

### Role Labels

Here is an example of how rule-related role labels read in a sentence, forward and backward. In this example, an element with code "Trash Pump" is outside the project extents.

|Element|ElementViolatesRules|RuleViolation|RuleViolationRefersToDefinition|    RuleDefintion|
|-------|--------------------|-------------|-------------------------------|-------------|
|Trash Pump|causes|a violation|of rule|must be within project extents|

|RuleDefinition|RuleViolationRefersToDefinition|RuleViolation|ElementViolatesRules|Element|
|--------------|-------------------------------|-------------|--------------------|-------|
|must be within project extents|has|a violation|caused by|Trash Pump|

|RuleViolation|RuleViolationRefersToDefinition|RuleDefinition|ElementViolatesRules|Element|
|-------------|-------------------------------|--------------|--------------------|-------|
|a violation|of rule|must be within project extents|caused by|Trash Pump|
