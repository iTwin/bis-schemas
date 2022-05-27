---
noEditThisPage: true
remarksTarget: SpatialComposition.ecschema.md
---

# SpatialComposition

This schema contains classes for modeling the Spatial Structure of infrastructure. BIS generally follows IFC's "spatial structure" concepts described by [IfcSpatialStructureElement](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifcspatialstructureelement.htm)

We aim for a 1:1 bi-directional instance mapping (not *class* mapping!) with IFC.  Round-trip transformations may result in changes that provide an *equivalent*, but not *identical* IFC model.

The hierarchy of [SpatialStructureElements](#spatialstructureelement) is built using the [SpatialStructureElementAggregatesElements](#spatialstructureelementaggregateselements) relationship, similar to [IfcRelAggregates](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifckernel/lexical/ifcrelaggregates.htm). The "source" Element of the relationship is an "Aggregator" that aggregates parts that are essentially a different representation of the aggregator, but at a finer granularity.

A Spatial Structure can define as many levels of hierarchy as needed.

The hierarchy can be thought of as a spatially-oriented "breakdown structure" used to organize `bis:PhysicalElements`s (and other `bis:SpatialElement`s) in named spatial "buckets" (the [SpatialStructureElements](#spatialstructureelement)). The mix-in class [ISpatialOrganizer](#ispatialorganizer) mixed-in by [SpatialStructureElement](#spatialstructureelement) expresses its role in forming a breakdown structure. The [`SpatialOrganizerHoldsSpatialElements`](#spatialorganizerholdsspatialelements) relationship assigns the `bis:SpatialElement`s into those "buckets".

Sometimes there are `bis:SpatialElements` that (for various reasons) need to be associated with a "bucket" in the Spatial Structure, though they are "held" by some other "bucket". The [`SpatialOrganizerReferencesSpatialElements`](#spatialorganizerreferencesspatialelements) allows these secondary associations to be made, although the precise meaning of the association is up to the author of the data.

The SpatialComposition schema also defines abstract base classes for standard discipline-agnostic spatial structure concepts.
These classes are [`Region`](#region), [`Site`](#site), [`Facility`](#facility), [`FacilityPart`](#facilitypart), and [`Space`](#space).
All but Region map to the like-named concepts in IFC.
Region was added to better represent Cities and other geographic concepts.
As `bis:SpatialLocationElements`, these classes represent the "spatial location perspective" on physical entities of region, site, facility, etc.
To use a facility as an example, a `spcomp:Facility` is not directly modeling the physicality of a facility, but only the spatial volume that it occupies.
There could theoretically be a corresponding `physical:Facility` related to the `spcomp:Facility`, but (in practice), we find that applications tend not to create a single `physical:Facility` element to represent the facility as a whole, but only physically model it at a finer granularity.
The spatial structure is used to structure the physical elements in the absence of an explicit physical structure.
The spatial structure organizes elements in the physical perspective through the "holds" and "references" relationships.

Generally, the levels of a Spatial Structure will follow the order: Region, Site, Facility, FacilityPart, Space, but there are no ironclad restrictions on what can aggregate what. There may be a small Building located in a FacilityPart of a Bridge. A Space may belong to a Site. Discipline-specific "spatial breakdown rules" may be defined in the future, but are unlikely to be defined in the schema, since they may be project-specific.

[Zones](#zone) are not part of the primary spatial structure, but they are organized by it. `Zone`s mix-in [ISpatialOrganizer](#ispatialorganizer) and thus can serve as a way of organizing `bis:SpatialElements` along some other "dimension" (indicated by their [ZoneType](#zonetype)).

BIS does not have a direct equivalent of IFC's controversial "CompositionType" attribute, which indicates that a given instance of IfcSpatialStructureElement represents a 'complex', an 'element' (a discrete individual), or a "part" (a portion of) for a given entity. BIS allows nesting of Regions within Regions, Sites within Sites, Facilities within Facilities, etc. to cover use-cases like a "building complex" or a "sub-building".

## SpatialStructureElementAggregatesElements

Equivalent to [IfcRelAggregates](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifckernel/lexical/ifcrelaggregates.htm).

Forms a strict hierarchy (A Spatial Structure Element can only be aggregated by a single 'aggregator')

See [Schema Overview](#spatialcomposition) for more information.

## SpatialStructureElement

Equivalent to [IfcSpatialStructureElement](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifcspatialstructureelement.htm).

See [Schema Overview](#spatialcomposition) for more information.

## SpatialStructureElementType

These types allow projects in different localities to define the types of Spatial Structure Elements that are relevant to them.

## ISpatialOrganizer

The organization could be according to any "criteria" or "dimension".

Currently only used by [SpatialStructureElement](#spatialstructureelement) and [Zone](#zone), `ISpatialOrganizer` is the "source" end of [holds](#spatialorganizerholdsspatialelements) and [references](#spatialorganizerreferencesspatialelements) relationships for organizing `bis:SpatialElement`s.

See [Schema Overview](#spatialcomposition) for more context.

## SpatialOrganizerHoldsSpatialElements

The "holds" relationship is used to organize `bis:SpatialElement`s into strict categories, such that a given `bis:SpatialElement` is only "held" by no more than one ["organizer"](#ispatialorganizer).

The scope of the "organization" (the scope within which the one-SpatialElement-per-Organizer rule can be checked) will vary depending on the class mixing-in [ISpatialOrganizer](#ispatialorganizer).

As used by [SpatialStructureElement](#spatialstructureelement) and [Zone](#zone), `SpatialOrganizerHoldsSpatialElements` is equivalent to [IfcRelContainedInSpatialStructure](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifcrelcontainedinspatialstructure.htm) (navigated in reverse).

In that context, in both IFC and BIS, "holds" does *not* mean geometric spatial containment, though `bis:SpatialElement`s that are spatially contained within a given "Spatial Structure Element" are *likely* to be "held" by that "Spatial Structure Element" *unless* they have been assigned (for logical reasons) to some other "Spatial Structure Element" that is deeper in the hierarchy. For example, an ElevatorShaft might be spatially contained only by the entire Building, but assigned to be "held" by the "Basement" Storey.  Generally, if a `bis:SpatialElement` is completely contained within a `Space`, it will be "held" by that `Space`, but Elements outside of the `Space` (like the "outdoor" half of a split-system Air Conditioner) for a `Space` might also be "held" by that `Space`.

See [Schema Overview](#spatialcomposition) for more context.

## SpatialOrganizerReferencesSpatialElements

The "references" relationship is used by ["organizers"](#ispatialorganizer) that wish to organize `bis:SpatialElement`s loosely, such that a given `bis:SpatialElement` can be "referenced" by more than one "organizer".

As used by [SpatialStructureElement](#spatialstructureelement) and [Zone](#zone), `SpatialOrganizerReferencesSpatialElements` is equivalent to [IfcRelReferencedInSpatialStructure](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifcrelreferencedinspatialstructure.htm) (navigated in reverse.)

In that context, in both IFC and BIS, the precise meaning of the association is up to the author of the data. It may or may not correlate with geometric spatial intersection.

For example, an ElevatorShaft Element may be "referenced by" all of the Storeys that it *serves*, even though it may *not* be referenced by a floor that it intersects but does not serve.  

See [Schema Overview](#spatialcomposition) for more context.

## Region

Has no direct equivalent in IFC, but can be represented as a large [IfcSite](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifcsite.htm).

Anticipated to use [RegionType](#regiontype) to distinguish highly variable types of Regions, e.g. city, district, municipality, county, state, Land, provence, country, etc.

## Site

Equivalent to [IfcSite](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifcsite.htm).

See [SiteType](#sitetype).

## Facility

Equivalent to [IfcFacility](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifcfacility.htm).

See [FacilityType](#facilitytype).

## FacilityPart

Equivalent to [IfcFacilityPart](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifcfacilitypart.htm).

See [FacilityPartType](#facilityparttype).

## Space

Equivalent to [IfcSpace](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifcspace.htm).

See [SpaceType](#spacetype).

## Zone

Equivalent to [IfcSpatialZone](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifcspatialzone.htm) but also maps to [IfcZone](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifczone.htm). In the latter case, its GeometryStream will be null. Our understanding is that IFC originally used `IfcZone` for this concept, but then realized that zones sometimes need geometry of their own, and so introduced IfcSpatialZone. We map instances of both IFC classes to `spcomp:Zone`.

An [IfcZone](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifczone.htm) is a subclass of [IfcSystem](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifcsystem.htm), and thus can "service" [IfcSpatialStructureElements](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifcspatialstructureelement.htm). In BIS, this would map to the `spcomp:Zone` being "held" or "referenced" by `spcomp:SpatialStructureElement`s.

A `Zone` (as a `bis:SpatialLocationElement`) has its own geometry for expressing a spatial region and (as an [ISpatialOrganizer](#ispatialorganizer)) can organize other `bis:SpatialElements` for any purpose.
Examples include a lighting zone, construction zone, loading area, circulation zone, tenancy zone, security zone, etc.

As a [ISpatialOrganizer](#ispatialorganizer), a `Zone` represents a category for organizing spatial elements. The [ZoneType](#zonetype) defines the "criteria" or "dimension" for organizing.
In general, a `Zone` will only use the [`SpatialOrganizerReferencesSpatialElements`](#spatialorganizerreferencesspatialelements) relationship, but the "holds" relationship is also available for special cases.

## ZoneType

Used with [Zone](#zone) to define a criteria to use for organizing `bis:SpatialElement`s that is "orthogonal" to the primary spatial breakdown structure.

For example, `Zones` of `ZoneType` "Tenancy" carve up the space according to which tenant has leased which area.

## CompositeElement

Deprecated.

Instead, use the [SpatialStructureElement](#spatialstructureelement) class that is a subclass of this class for backwards compatibility.

## ICompositeBoundary

Deprecated.

Mixin used to indicate that the element is of Boundary type which is most commonly a set of curved geometry.
Often the original data is in the form of points on the map, a metes and bounds string, or similar.

`ICompositeBoundary` is a mixin class and does not have a mapping to or from IFC.

## ICompositeVolume

Deprecated.

Mixin used to indicate that the element is of volumetric type which is most commonly an extrusion geometry.

`ICompositeVolume` is a mixin class and does not have a mapping to or from IFC.

## CompositeOverlapsSpatialElements

Deprecated.

Use the [SpatialOrganizerHoldsSpatialElements](#spatialorganizerholdsspatialelements) or [SpatialOrganizerReferencesSpatialElements](#spatialorganizerreferencesspatialelements) relationships instead.
