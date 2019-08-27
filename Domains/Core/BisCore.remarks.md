---
noEditThisPage: true
remarksTarget: BisCore.ecschema.md
---

# BisCore

BisCore contains the core classes that define the fundamental building-blocks of BIS (e.g. Models, Elements, and ElementAspects) and which specialize them to establish domain-neutral base-classes for modeling the real world from multiple Modeling Perspectives.

BisCore also contains some less-fundamental classes related to infrastructure engineering visualization and documentation in general, such as drawings, views, etc.

The core class are decorated by ECCustomAttributes that effectively define the database schema mapping for an iModel, but which can be ignored for other kinds of BIS Repositories.  Other schemas may not alter the underlying database schema mapping without explicit permission from BisCore.

The classes of BisCore are used as base classes for all classes in other BIS Domain schemas.

## Entity Classes

### InformationPartitionElement

An InformationPartitionElement partitions the information in a BIS Repository into non-overlapping hierarchies of Models and Elements, each with a distinct Modeling Perspective.

A bis:Subject mentions a real-world Object, which BIS *sees* as one-or-more Entities, where each Entity considers the Object from a particular Modeling Perspective. A specialization of a bis:InformationPartitionElement establishes a Perspective for modeling the Object to which the Subject refers. The top-Model sub-models the Partition and begins the actual modeling of the Entity with one-or-more Elements of the appropriate Modeling Perspective.

See [Top of the World](../intro/top-of-the-world.md)

### DefinitionPartition

The "Definition" Modeling Perspective is for modeling definitions of things that are shared by multiple particular Entities.

### DocumentPartition

The "Document" Modeling Perspective describes Entities using Documents and is used to creates primary documents such as Drawings.

### GroupInformationPartition

The "GroupInformation" Perspective is not a distinct Modeling Perspective, but is a somewhat arbitrary partitioning of a larger "Information Content" Perspective. This pattern of partitioning a larger perspective is not considered a best-practice, going forward.

### InformationRecordPartition

The "InformationRecord" Perspective is not a distinct Modeling Perspective, but is a somewhat arbitrary partitioning of a larger "Information Content" Perspective. This pattern of partitioning a larger perspective is not considered a best-practice, going forward.

### LinkPartition

The "Link" Perspective is not a distinct Modeling Perspective, but is a somewhat arbitrary partitioning of a larger "Information Content" Perspective. This pattern of partitioning a larger perspective is not considered a best-practice, going forward.

### PhysicalPartition

The "Physical" Perspective is for modeling physical Entities, which have mass and for spatial location Entities, which are generally either defined-by physical Entities are used-to-define physical Entities. See SpatialLocationPartition.

### SpatialLocationPartition

The “Spatial Location” perspective is a strict subset of the “Physical” perspective. Spatial locations are massless, but they manifest in the real physical world:

- They may be defined in relation to physical entities, e.g. the air gap between two conductors, the space around an access panel, the volume occupied by a physical Entity, or a surface demarcating a region on the surface of a physical entity.
- They may be used to guide positioning of physical Entities, e.g. grid lines that may be manifested physically on a construction site via chalk lines or laser beams.
- They may be abstractions of physical consequence, like property or political boundaries that are often demarcated in the physical world via markers, signs, or natural boundaries.

The "Spatial Location" perspective is used by SpatialLocationModel and SpatialLocationElement in order to segregate certain kinds of elements.

In retrospect, the complexity added by introducing a distinct "Spatial Location" perspective may have not been worth the benefit. Our current recommendation is to not instantiate a SpatialLocationPartition, but instead organize spatial locations in the context of the 'physical backbone', i.e. the Physical model hierarchy.
