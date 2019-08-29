---
noEditThisPage: true
remarksTarget: BisCore.ecschema.md
---

# BisCore

BisCore contains the core classes that define the fundamental building-blocks of BIS (e.g. Models, Elements, and ElementAspects) and which specialize them to establish domain-neutral base-classes for modeling the real world from multiple Modeling Perspectives.

BisCore also contains some less-fundamental classes related to infrastructure engineering visualization and documentation in general, such as drawings, views, etc.

The core classes are decorated by ECCustomAttributes that effectively define the database schema mapping for an iModel, but which can be ignored for other kinds of BIS Repositories.  Other schemas cannot alter the underlying database schema mapping without explicit permission from BisCore.

The classes of BisCore are used as base classes for all classes in other BIS Domain schemas.

## Entity Classes

### InformationPartitionElement

An InformationPartitionElement partitions the information in a BIS Repository into non-overlapping hierarchies of Models and Elements, each with a distinct Modeling Perspective. In some cases it further-partitions information into distinct subsets within a Modeling Perspective, based on a specific domain.

A bis:Subject mentions a real-world Object. BIS *sees* the Object as one-or-more Entities, where each Entity considers the Object from a particular Modeling Perspective. A specialization of a bis:InformationPartitionElement establishes a Perspective for modeling the Object to which the Subject refers. The top-Model sub-models the Partition. The actual modeling of the Entity with one-or-more Elements of the appropriate Modeling Perspective begins in the top-Model.

See [Top of the World](../intro/top-of-the-world.md)

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

### PhysicalPartition

The 'Physical' Perspective is for modeling physical Entities (which have mass) and for spatial location Entities (which are generally either defined-by physical Entities or are used-to-define physical Entities).

### SpatialLocationPartition

The “Spatial Location” perspective is a strict subset of the “Physical” perspective. Spatial locations are massless, but they manifest in the real physical world:

- They may be defined in relation to physical entities, e.g. the air gap between two conductors, the space around an access panel, the volume occupied by a physical Entity, or a surface demarcating a region on the surface of a physical entity.
- They may be used to guide positioning of physical Entities, e.g. grid lines that may be manifested physically on a construction site via chalk lines or laser beams.
- They may be abstractions of physical consequence, like property or political boundaries that are often demarcated in the physical world via markers, signs, or natural boundaries.

The 'Spatial Location' perspective is used by SpatialLocationModel and SpatialLocationElement in order to segregate certain kinds of elements.

In retrospect, the complexity added by introducing a distinct 'Spatial Location' perspective may have not been worth the benefit. Our current recommendation is to not instantiate a SpatialLocationPartition, but instead to organize spatial locations in the context of the PhysicalModel hierarchy.
