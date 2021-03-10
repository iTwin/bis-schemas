---
noEditThisPage: true
remarksTarget: BisCore.ecschema.md
---

# BisCore

BisCore contains the core classes that define the [fundamental building-blocks of BIS](../intro/fabric-of-the-universe/) (e.g. Models, Elements, and ElementAspects) and which specialize them to establish domain-neutral base-classes for modeling the real world from multiple Modeling Perspectives.

BisCore also contains some less-fundamental classes related to infrastructure engineering visualization and documentation in general, such as drawings, views, etc.

The core classes are decorated by ECCustomAttributes that effectively define the database schema mapping for an iModel, but which can be ignored for other kinds of BIS Repositories.  Other schemas cannot alter the underlying database schema mapping without explicit permission from BisCore.

The classes of BisCore are used as base classes for all classes in other BIS Domain schemas.

See [Base Infrastructure Schemas](https://imodeljs.github.io/iModelJs-docs-output//bis/)

## Entity Classes

### ClassHasHandler

Applied to an ECClass to indicate that a C++ subclass of DgnDomain::Handler will supply behavior for it at run-time.
This custom attribute may only be used by BisCore or other core schemas. Other schemas should use the SchemaHasBehavior instead.
It must be applied to any ECClass if the application/domain registers a Handler for that ECClass.
It should not be applied to any other ECClass.
It is an error to call RegisterHandler() with a handler for an ECClass that lacks this custom attribute.

### ISubModeledElement

Sub-modeling is also sometimes described as "breaking down", i.e. a sub-modeled Element can be "broken down into" a finer-grained (sub) Model.  
See also [IParentElement](#iparentelement).

### IParentElement

Only subclasses of bis:Element can implement the IParentElement interface

Parent-child modeling differs from sub-modeling in that the parent Element and child Elements are to be considered together in the context of a single Model, whereas a sub-modeled Element is considered independently of its sub-Model. For example, and application would view a parent Element and its child Elements together, but would *either* view a sub-modeled Element *or* exclude that Element and instead view the Elements of its sub-Model.

See also [ISubModeledElement](#isubmodeledelement).

### InformationPartitionElement

An InformationPartitionElement partitions the information in a BIS Repository into non-overlapping hierarchies of Models and Elements, each with a distinct Modeling Perspective. In some cases it further-partitions information into distinct subsets within a Modeling Perspective, based on a specific domain.

A bis:Subject mentions a real-world Object. BIS *sees* the Object as one-or-more Entities, where each Entity considers the Object from a particular Modeling Perspective. A specialization of a bis:InformationPartitionElement establishes a Perspective for modeling the Object to which the Subject refers. The top-Model sub-models the Partition. The actual modeling of the Entity with one-or-more Elements of the appropriate Modeling Perspective begins in the top-Model.

See [Top of the World](../intro/top-of-the-world/)

### DefinitionPartition

The 'Definition' Modeling Perspective is for modeling definitions of things that are shared by multiple particular Entities.

### DocumentPartition

The 'Document' Modeling Perspective is a subset of the 'Information' Modeling Perspective. It holds Elements which describes Entities using Documents and is used to create primary documents such as Drawings.

### GroupInformationPartition

The 'GroupInformation' Modeling Perspective is a subset of the 'Information' Modeling Perspective. It is used primarily to hold `generic:Group` Elements generated from DgnV8 'Named Groups'.

### InformationRecordPartition

The 'InformationRecord' Modeling Perspective is a subset of the 'Information' Modeling Perspective. It can hold a broad array of information records describing Entities.

### LinkPartition

The 'Link' Modeling Perspective is a subset of the 'Information' Modeling Perspective. It is used to hold links to external repositories, e.g. in the form of `bis:RepositoryLink` elements.

### LinkElement

The link is generally to some resource, e.g. the subclass `UrlLink` points to an external resource while `EmbeddedFileLink` points to files embedded in an iModel.

### PhysicalPartition

The 'Physical' Perspective is for modeling physical Entities (which have mass) and for spatial location Entities (which are generally either defined-by physical Entities or are used-to-define physical Entities).

### SpatialLocationPartition

The “Spatial Location” perspective is a strict subset of the “Physical” perspective. Spatial locations are massless, but they manifest in the real physical world:

- They may be defined in relation to physical entities, e.g. the air gap between two conductors, the space around an access panel, the volume occupied by a physical Entity, or a surface demarcating a region on the surface of a physical entity.
- They may be used to guide positioning of physical Entities, e.g. grid lines that may be manifested physically on a construction site via chalk lines or laser beams.
- They may be abstractions of physical consequence, like property or political boundaries that are often demarcated in the physical world via markers, signs, or natural boundaries.

The 'Spatial Location' perspective is used by SpatialLocationModel and SpatialLocationElement in order to segregate certain kinds of elements.

In retrospect, the complexity added by introducing a distinct "Spatial Location" perspective may have not been worth the benefit. Our current recommendation is to not instantiate a SpatialLocationPartition, but instead organize spatial locations in the context of the 'physical backbone', i.e. the Physical model hierarchy.

### Model

See [Model Fundamentals](../intro/model-fundamentals/).

### ModelOwnsSubModel

See [Model.ParentModel](#model) ECNavigationProperty.

### ModelContainsElements

See [Element.Model](#element) ECNavigationProperty.

### ModelModelsElement

See [Model.ModeledElement](#model) ECNavigationProperty.

A more accurate name for this relationship would have been 'ModelSubModelsElement', but the existing name cannot be changed in this generation of BIS.

### DrawingModelBreaksDownDrawing

A more consistent name for this relationship would have been 'DrawingModelSubModelsDrawing', but the existing name cannot be changed in this generation of BIS. At times, we use "breaks down" as a synonym for "sub-models", but we are standardizing on "sub-models", reserving "breakdown" for use with various engineering breakdown structures.

### SheetModelBreaksDownSheet

A more consistent name for this relationship would have been 'SheetModelSubModelsSheet', but the existing name cannot be changed in this generation of BIS. At times, we use "breaks down" as a synonym for "sub-models", but we are standardizing on "sub-models", reserving "breakdown" for use with various engineering breakdown structures.

### Element

See [Element Fundamentals](../intro/element-fundamentals/).

### ElementDrivesElement

In iModels, a change-propagation system calls handlers that allow the driven Element to be affected by the driving Element.
See [DriverBundleElement](#driverbundleelement).

### DriverBundleElement

Used when multiple inputs for a "driving" relationship cannot be considered in isolation.

See [ElementDrivesElement](#elementdriveselement).

### TypeDefinitionElement

A `TypeDefinitionElement` is an implementation of a data normalization strategy and is meant to hold properties that vary per *type* instead of varying per `Element` instance.
Rather than storing the same set of *type-specific* properties on every `Element` instance, each `Element` instance will have a set of *instance-specific* properties (as specified by the `Element` class) and a set of related *type-specific* properties found by joining to the `TypeDefinitionElement` instance.

See relationships such as [PhysicalElementIsOfType](#physicalelementisoftype).

### PhysicalElementIsOfType

### PhysicalType

A `PhysicalType` is particularly useful in cases where a physical item can be ordered from a *catalog*.
Each type of item will have the same set of *type-specific* properties.
For example: manufacturer name, model number, maintenance intervals, etc.

### RepositoryModel

### Subject

`Subject` elements only exist in the [RepositoryModel](#repositorymodel) singleton at the root of a BIS Repository. There will be one "root" instance of `Subject` that does not have a parent `Subject`. Child `Subject` elements reference "parts" of the real-world Object referenced by their parent `Subject` element.

The hierarchy of `Subject`s is not meant to model the root Object's structure, but is a way to express high-level structure that has not been modeled explicitly. `Subjects` do not "model" or "represent" or "describe" the Object that they reference. All modeling happens using Elements in the other bis:Models in the BIS Repository.

### Category

Categories should be standardized by domain groups where possible. They generally correlate with groups of BIS Element classes, or a single base class.

See [Categories Introduction](../intro/categories/).

Also see the [ClassificationSystems](https://imodeljs.github.io/iModelJs-docs-output/bis/domains/classificationsystems.ecschema/) domain schema.
In retrospect, the complexity added by introducing a distinct 'Spatial Location' perspective may have not been worth the benefit. Our current recommendation is to not instantiate a SpatialLocationPartition, but instead to organize spatial locations in the context of the PhysicalModel hierarchy.

### AutoHandledPropertyStatementType

Restrictions that may be applied to an AutoHandledProperty. Must match the ECSqlClassParams::StatementType enum

### CodeSpecSpecifiesCode

See [Element.CodeSpec](#element) ECNavigationProperty.

### ElementScopesCode

See [Element.CodeScope](#element) ECNavigationProperty.

### TypeDefinitionHasRecipe

See [TypeDefinitionElement.Recipe ECNavigationProperty](#TypeDefinitionElement) ECNavigationProperty

### GeometricElement2dHasTypeDefinition

See [GeometricElement2d.TypeDefinition ECNavigationProperty](#GeometricElement2d) ECNavigationProperty

### GeometricElement3dHasTypeDefinition

See [GeometricElement3d.TypeDefinition ECNavigationProperty](#GeometricElement3d) ECNavigationProperty

### SheetHasSheetTemplate

See [Sheet.SheetTemplate ECNavigationProperty](#Sheet) ECNavigationProperty

### SheetTemplateHasSheetBorder

See [SheetTemplate.Border ECNavigationProperty](#SheetTemplate) ECNavigationProperty

### SheetBorderHasSheetBorderTemplate

See [SheetBorder.BorderTemplate ECNavigationProperty](#SheetBorder) ECNavigationProperty

### ViewIsAttached

See [ViewAttachment.View ECNavigationProperty](#ViewAttachment) ECNavigationProperty

### ElementOwnsChildElements

See [Element.Parent ECNavigationProperty](#Element) ECNavigationProperty
Should be treated as abstract, but was not made abstract because of legacy usages that were already released.

### Source

Source constraint should logically be IParentElement, but that mixin was invented later, and tightening the constraint could invalidate existing iModels

### ElementOwnsUniqueAspect

See [ElementUniqueAspect.Element ECNavigationProperty](#ElementUniqueAspect) ECNavigationProperty

### ElementOwnsMultiAspects

See [ElementMultiAspect.Element ECNavigationProperty](#ElementMultiAspect) ECNavigationProperty

### GeometricElement2dIsInCategory" strength="referencing

See [GeometricElement2d.Category ECNavigationProperty](#GeometricElement2d) ECNavigationProperty

### GeometricElement3dIsInCategory" strength="referencing

See [GeometricElement3d.Category ECNavigationProperty](#GeometricElement3d) ECNavigationProperty

### ColorBook

Individual colors are stored in JsonProperties

### RenderMaterial

Marked as "Sealed" because JsonProperties will be used to persist data. This allows a single instance to "morph" between a DgnV8 render material and a future PBR material.

### RenderTimeline

This information used to be stored within the `DisplayStyle` but was refactored out as a separate element for efficiency and reuse purposes.

### SectionLocationUsesCategorySelector

See [SectionLocation.CategorySelector ECNavigationProperty](#SectionLocation) ECNavigationProperty

### BaseModelForView2d

See [ViewDefinition2d.BaseModel ECNavigationProperty](#ViewDefinition2d) ECNavigationProperty

### SpatialViewDefinitionUsesModelSelector

See [SpatialViewDefinition.ModelSelector ECNavigationProperty](#SpatialViewDefinition) ECNavigationProperty

### ViewDefinitionUsesCategorySelector

See [ViewDefinition.CategorySelector ECNavigationProperty](#ViewDefinition) ECNavigationProperty

### ViewDefinitionUsesDisplayStyle

See [ViewDefinition.DisplayStyle ECNavigationProperty](#ViewDefinition) ECNavigationProperty

### CustomHandledProperty

See [CustomHandledPropertyStatementType](#CustomHandledPropertyStatementType).

### ChannelRootAspect

An *iModel Bridge* uses the `ChannelRootAspect` to indicate ownership of a *channel*.
A *channel* is a portion of the iModel's hierarchy that begins at the specified Element and recursively descends down through `ElementOwnsChildElements` and `ModelModelsElement` relationships to include all of the child elements and sub-models.

### DefinitionSet

`DefinitionSet` represents a set of `DefinitionElement`s. The set may be exclusive (`DefinitionContainer` owns its `DefinitionElement`s) or may be non-exclusive (`DefinitionGroup` does not own its `DefinitionElement`s). `DefinitionSet` should *only* be *directly* subclassed by `DefinitionGroup` and `DefinitionContainer`. `DefinitionGroup` and `DefinitionContainer` may be further subclassed.

References to `DefinitionSet`s will generally treat the `DefinitionSet`s recursively. If *`DefinitionSet` A* contains *`DefinitionSet` B* and *`DefinitionSet` C*, the members of *`DefinitionSet` B* and *`DefinitionSet` C* will be considered to be first class members of *`DefinitionSet` A* (effectively they will be considered as peers of the `DefinitionElement`s that are directly contained in *`DefinitionSet` A*). This recursive interpretation extends through the full depth of nested `DefinitionSet`s.

### DefinitionGroup

`DefinitionGroup` is intended for defining non-exclusive sets of `DefinitionElement`s (a `DefinitionElement` may be in multiple `DefinitionGroup`s). `DefinitionGroup` holds its `DefinitionElement`s through the `DefinitionGroupGroupsDefinitions` relationship. The referenced `DefinitionElement`s may be contained in the same `DefinitionModel` as the `DefinitionGroup` or may be contained in other `DefinitionModel`s.

See `DefinitionSet` documentation for recursive interpretations of `DefinitionSet`s  containing `DefinitionSet`s.

Care must be taken to avoid circular references.  Note that even a single `DefinitionGroup` can create circular references in two cases:

- The `DefinitionGroup` directly contains itself.
- The `DefinitionGroup` contains a `DefinitionContainer` that directly or indirectly contains the `DefinitionGroup`.

### DefinitionContainer

`DefinitionContainer` represents a `DefinitionSet` that exclusively owns its `DefinitionElement`s. The exclusivity is only effective relative to other `DefinitionContainer`s (or similar `DefinitionElement`s that have sub-models); the `DefinitionElement`s that are contained in a `DefinitionContainer` may also be in one or more `DefinitionGroup`s.

See `DefinitionSet` documentation for recursive interpretations of `DefinitionSet`s containing `DefinitionSet`s.

A `DefinitionContainer` can conceptually be thought of as a *folder of definitions*.
A `DefinitionContainer` is recommended when there is a standard set of domain-specific definitions that must be known to domain software applications.
In this case, the `DefinitionContainer` should be contained by the `DictionaryModel` and found by the software via a known `Code`.

### DefinitionGroupGroupsDefinitions

A `DefinitionGroup` may not be both the source and the target of the same relationship instance.

### PhysicalSystem

A non-exclusive set of `SpatialElements` grouped using the `PhysicalSystemGroupsMembers` relationship. A `SpatialElement` can be a member of multiple `PhysicalSystems`.

The primary contents of the `PhysicalSystem` are `PhysicalElements`, but `SpatialLocationElements` can be included, as well.

### SynchronizationConfigLink

A Link to the Configuration for a Synchronization Job.  By convention, a unique Id for the SynchronizationConfigLink such as a job Id should be set in the CodeValue property and a name should be set in in the UserLabel property.

### ExternalSourceGroup

If the `ExternalSourceGroup` has a *primary* repository than it should be persisted in the `Repository` property from its base class.
If the group does not have a *primary* repository than that property should be left as `NULL`.
