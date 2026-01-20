---
remarksTarget: Profiles.ecschema.md
---

# Profiles

Profiles schema defines classes that represent two dimensional cross sections, used to define geometric shapes. Profiles may be used to extrude structural components like beams and columns.

Most often used Profiles are standard and defined by a specific [Standards Organization](#standardsorganization). Standard Profiles are always shared. Standard profiles should only be deleted in case a mistake was made when creating standard Profile.

<b>Standard Profiles</b>

Most often used Profiles are standard and defined in a catalog. This is defined by a Profile and Code hierarchy representing four components:

- `StandardsOrganization` - Name of the standards organization that defines the [Profile](#profile), e.g. "AISC"
- `Manufacturer` - Name of the manufacturer for the [Profile](#profile). This is usually a country code e.g. "US"
- `Revision` - Name of the edition or version of the standards organization, e.g. "14"
- `Name` - Name of the [Profile](#profile) (also called designation) e.g. "W16x40"

Applications will be able to use this information to query detailed properties and geometry of catalog (database) profile.

Applications that don't have access to catalogs will still be able to render the Profiles as they contain their own geometry constructed from available properties - this geometry may not match the detailed geometry from a catalog.

<b>Structural Components Hierarchy</b>

The following instance-diagram presents a simple example of the Structural Components Hierarchy explained next.

![Structural Components Hierarchy](./media/DeckClassificationSystems.png)

<u>Profiles Definition Catalog</u>

The top level Element to store Profiles definitions is defined as `DefinitionContainer`. This Element is expected to be stored in `DictionaryModel`. The Code value should be set to "prf:DomainDefinitions", scope is set to `Repository` Model id, spec set to "bis:DefinitionContainer". The Container is expected to store "Standard Organizations" and "Structural Components Catalog" `DefinitionContainers` which are defined in subsequent sections of this document.

<u>Standard Organizations and Structural Components Catalog</u>

Standard Organizations primary function is developing and maintaining manuals that specify technical standards for various structural components - Beam/Column Sections, Steel Decks, Joists, etc. Examples of standard organizations are - "AISC", "CEN", "VERCO". BIS repositories are not expected to contain Elements that represent Standard Organizations, only specific manuals are defined. 

<u>Standard Organizations Definition Container</u>

The top level Element of StandardOrganization structure is defined as a single sub-modeled instance of `DefinitionContainer`. This Element is expected to have a Code with value set to "Standard Organizations", scope set to `Model` Model id, spec set to "bis:DefinitionContainer". "Standard Organizations" Element is expected to be stored in the "prf:DomainDefinitions" sub-model.

<u>Classification Systems</u>

"Standard Organizations" `DefinitionContainer` is broken down to a model that stores Elements that represents manuals. Manuals are defined as `ClassificationSystem` Elements where each Element represents only a single revision/edition of a catalog released, maintained by Standard Organization. `Code` value of the Manual element is expected to be concatination of StandardOrganization name and the manual name itself, e.g. `ClassificationSystem` that represents Standard Organization "CEN"'s "EU 19-53" Profile catalog edition would have a Code with value "CEN EU 19-53". `CodeScope` is expected to be set to `DictionaryModel` id, `CodeSpec` to `clsf:ClassificationSystem`.

<u>Classification Table</u>

The Manuals are expected to have child Elements (`ClassificationTable`) that divide the manual into groups by use case. e.g. Same manual might define both Beam Profiles and Steel Decks. The CodeScope of each `ClassificationTable` should be set to `ParentElement`. CodeSpec to "bis:ClassificationTable". Code values depend on the `ClassificationTable`'s use case:

- Structural Profile Classifaction Table should have CodeValue set to "Structural Profiles"
- Steel Decks to "Structural Steel Decks"
- Joists to "Structural Joists"

Each `ClassificationTable` is then broken down by a model that stores separate `Classification`s that belong to that table.

<u>Classifications</u>

`Classification` Elements define the actual entries of any Standard Catalog, e.g. AISC 7th Edition Structural Profile Catalog entires would be defined as separate `Classification` containing all entries from that specific catalog edition.

Each `Classification` CodeScope would be set to `Model`, each CodeSpec to `clsf:Classification`. The value would be set as Designation of that entry. (e.g. "W44X335"). `Classification` Elements would not define any properties that are defined by the actual real world catalog entries. Instead, such properties would be defined by separate Elements that reference classification using `ElementHasClassifications` relationship.

<b>Structural Components Catalog Definition Container</b>

The Structural Components Catalog Hierarchy defines actual structural components - Profiles, Steel Decks, Joists, etc. The top level Element of the hierarchy is a `DefinitionContainer` that is stored in the "prf:DomainDefinitions" sub-model. The Code assigned to it consists of "Structural Components Catalog" value, `Model` scope, "bis:DefinitionContainer" spec. This container is broken down into case specific `DefinitionContainer` Elements - Profiles, Joists, Steel Decks, etc. Each container has a CodeScope set to "Structural Components Catalog" id, CodeSpec set to `bis:DefinitionContainer`. CodeValue depends on the container's use case:

- "Structural Profiles" code is used for Profiles
- "Structural Steel Joists" for Joists
- "Structural Steel Decks" for Steel Decks

Each container is then broken down further. Where each sub-model contains the actual definitions of Structural Components - Profiles, SteelDecks, etc. These Elements are expected to refer to at least one Classification that the component fulfills. `ElementHasClassifications` relationship is used to relate Component with its classification.

## Entity Classes

### Profile

Base class of all profile definitions.
Profile may be a [SinglePerimeterProfile](#singleperimeterprofile) or [CompositeProfile](#compositeprofile).

### StandardsOrganization

Defines standard [Profiles](#profile). This should always be sub-modeled by a model which stores all manufacturers that produce the actual structural members defined by profile rules of standard organization.

### Manufacturer

Produces structural members defined by a standard [Profile]. Manufacturer is always stored in a model that models [standards organization](#standardsorganization) whichs' rules are used to define profiles. Manufacturer is always sub-modeled and it's model contains revisions for profiles.

### Revision

Stores standard [profiles](#profile) that are used to produce structural members by some specific [manufacturer](#manufacturer).

### SinglePerimeterProfile

This profile subclass is used to denote a [Profile](#profile) that is composed out of a single perimeter (area). SinglePerimeterProfiles can be referenced by [CompositeProfile](#compositeprofile) to form a [Profile](#profile) with multiple disjoint areas.

### ParametricProfile

[Profile](#profile) whose geometry is defined by a set of properties such as ``Width``, ``Depth``, ``Thickness`` etc.
In addition, such Profiles have a bounding box which is centered at the center of the coordinate system i.e. (x: 0, y: 0).

### CShapeProfile
**Derivative properties:**
- `FlangeInnerEdgeLength` = `FlangeWidth` - `WebThickness`
- `FlangeSlopeHeight` = `FlangeInnerEdgeLength` * Tan(`FlangeSlope`)
- `WebInnerEdgeLength` = `Depth` - `FlangeThickness` * 2

**Constraints:**
- `FlangeWidth` must be greater than zero
- `Depth` must be greater than zero
- `FlangeThickness`:
  - must be greater than zero
  - must be less than half `Depth`
- `WebThickness`:
  - must be greater than zero
  - must be less than `FlangeWidth`
- `FilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half of `FlangeInnerEdgeLength`
  - must be less or equal to half of `WebInnerEdgeLength` minus `FlangeSlopeHeight`
- `FlangeEdgeRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half of `FlangeInnerEdgeLength`
  - must be less or equal to `FlangeThickness`
- `FlangeSlope` (if set):
  - must be greater or equal to zero
  - must be less than ninety degrees
  - `FlangeSlopeHeight` must be less or equal to `WebInnerEdgeLength`
  - `FlangeSlopeHeight` must be less or equal to double `FlangeThickness`

![CShape (only mandatory properties)](media/ProfilePictures/CShape1.png)
![CShape (all properties)](media/ProfilePictures/CShape2.png)

### AsymmetricIShapeProfile
**Derivative properties:**
- `WebEdgeLength` = `Depth` - `TopFlangeThickness` - `BottomFlangeThickness`
- `TopFlangeInnerEdgeLength` = (`TopFlangeWidth` - `WebThickness`) / 2
- `BottomFlangeInnerEdgeLength` = (`BottomFlangeWidth` - `WebThickness`) / 2
- `TopFlangeSlopeHeight` = `TopFlangeInnerEdgeLength` * Tan(`TopFlangeSlope`)
- `BottomFlangeSlopeHeight` = `BottomFlangeInnerEdgeLength` * Tan(`BottomFlangeSlope`)

**Constraints:**
- `TopFlangeWidth` must be greater than zero
- `BottomFlangeWidth` must be greater than zero
- `Depth` must be greater than zero
- `TopFlangeThickness`
  - must be greater than zero
  - `TopFlangeThickness` plus `BottomFlangeThickness` must be less than `Depth`
- `BottomFlangeThickness`
  - must be greater than zero
  - `TopFlangeThickness` plus `BottomFlangeThickness` must be less than `Depth`
- `WebThickness`
  - must be greater than zero
  - must be less than `TopFlangeWidth`
  - must be less than `BottomFlangeWidth`
- `TopFlangeFilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `WebEdgeLength` minus `TopFlangeSlopeHeight`
  - must be less or equal to half `TopFlangeInnerEdgeLength`
- `TopFlangeEdgeRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to `TopFlangeThickness`
  - must be less or equal to half `TopFlangeInnerEdgeLength`
- `TopFlangeSlope` (if set):
  - must be greater or equal to zero
  - must be less than ninety degrees
  - `TopFlangeSlopeHeight` must be less or equal to `WebEdgeLength`
  - `TopFlangeSlopeHeight` must be less or equal to double `TopFlangeThickness`
- `BottomFlangeFilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `WebEdgeLength` minus `BottomFlangeSlopeHeight`
  - must be less or equal to half `BottomFlangeInnerEdgeLength`
- `BottomFlangeEdgeRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to `BottomFlangeThickness`
  - must be less or equal to half `BottomFlangeInnerEdgeLength`
- `BottomFlangeSlope` (if set):
  - must be greater or equal to zero
  - must be less than ninety degrees
  - `BottomFlangeSlopeHeight` must be less or equal to `WebEdgeLength`
  - `BottomFlangeSlopeHeight` must be less or equal to double `BottomFlangeThickness`

![AsymmetricIShape (only mandatory properties)](media/ProfilePictures/AsymmetricIShape1.png)
![AsymmetricIShape (all properties)](media/ProfilePictures/AsymmetricIShape2.png)

### IShapeProfile
**Derivative properties:**
- `FlangeInnerEdgeLength` = (`FlangeWidth` - `WebThickness`) / 2
- `FlangeSlopeHeight` = `FlangeInnerEdgeLength` * Tan(`FlangeSlope`)
- `WebEdgeLength` = `Depth` - `FlangeThickness` * 2

**Constraints:**
- `FlangeWidth` must be greater than zero
- `Depth` must be greater than zero
- `FlangeThickness`:
  - must be greater than zero
  - must be less than half `Depth`
- `WebThickness`:
  - must be greater than zero
  - must be less than `FlangeWidth`
- `FilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `FlangeInnerEdgeLength`
  - must be less or equal to half `WebEdgeLength` minus `FlangeSlopeHeight`
- `FlangeEdgeRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `FlangeInnerEdgeLength`
  - must be less or equal to `FlangeThickness`
- `FlangeSlope` (if set):
  - must be greater or equal to zero
  - must be less than ninety degrees
  - `FlangeSlopeHeight` must be less or equal to `WebEdgeLength`
  - `FlangeSlopeHeight` must be less or equal to double `FlangeThickness`

![IShape (only mandatory properties)](media/ProfilePictures/IShape1.png)
![IShape (all properties)](media/ProfilePictures/IShape2.png)

### TShapeProfile
**Derivative properties:**
- `FlangeInnerEdgeLength` = (`FlangeWidth` - `WebThickness`) / 2
- `FlangeSlopeHeight` = `FlangeInnerEdgeLength` * Tan(`FlangeSlope`)
- `WebEdgeLength` = `Depth` - `FlangeThickness`
- `WebSlopeHeight` = `WebEdgeLength` * Tan(`WebSlope`)

**Constraints:**
- `FlangeWidth` must be greater than zero
- `Depth` must be greater than zero
- `FlangeThickness`
  - must be greater than zero
  - must be less than `Depth`
- `WebThickness`
  - must be greater than zero
  - must be less than `FlangeWidth`
- `FilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `FlangeInnerEdgeLength` minus `WebSlopeHeight`
  - must be less or equal to half `WebEdgeLength` minus `FlangeSlopeHeight`
- `FlangeEdgeRadius`
  - must be greater or equal to zero
  - must be less or equal to half `FlangeInnerEdgeLength`
  - must be less or equal to `FlangeThickness`
- `FlangeSlope` (if set):
  - must be greater or equal to zero
  - must be less than ninety degrees
  - `FlangeSlopeHeight` must be less or equal to `WebEdgeLength`
  - `FlangeSlopeHeight` must be less or equal to double `FlangeThickness`
- `WebEdgeRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `WebEdgeLength`
  - must be less or equal to half `WebThickness`
- `WebSlope` (if set):
  - must be greater or equal to zero
  - must be less than ninety degrees
  - `WebSlopeHeight` must be less or equal to `FlangeInnerEdgeLength`
  - `WebSlopeHeight` must be less or equal to `WebThickness`

![TShape (only mandatory properties)](media/ProfilePictures/TShape1.png)
![TShape (all properties)](media/ProfilePictures/TShape2.png)

### LShapeProfile
**Derivative properties:**
- `HorizontalLegInnerEdgeLength` = `Width` - `Thickness`
- `HorizontalLegSlopeHeight` = `HorizontalLegInnerEdgeLength` * Tan(`LegSlope`)
- `VerticalLegInnerEdgeLength` = `Depth` - `Thickness`
- `VerticalLegSlopeHeight` = `VerticalLegInnerEdgeLength` * Tan(`LegSlope`)

Note that `EdgeRadius` can be bigger than thickness.

**Constraints:**
- `Width` must be greater than zero
- `Depth` must be greater than zero
- `Thickness`
  - must be greater than zero
  - must be less than `Depth`
  - must be less than `Width`
- `FilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `HorizontalLegInnerEdgeLength` minus `VerticalLegSlopeHeight`
  - must be less or equal to half `VerticalLegInnerEdgeLength` minus `HorizontalLegSlopeHeight`
- `EdgeRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `HorizontalLegInnerEdgeLength` minus `VerticalLegSlopeHeight`
  - must be less or equal to half `VerticalLegInnerEdgeLength` minus `HorizontalLegSlopeHeight`
- `LegSlope` (if set):
  - must be greater or equal to zero
  - must be less than ninety degrees
  - `HorizontalLegSlopeHeight` must be less or equal to `VerticalLegInnerEdgeLength`
  - `VerticalLegSlopeHeight` must be less or equal to `HorizontalLegInnerEdgeLength`
  - `HorizontalLegSlopeHeight` must be less or equal to double `Thickness`
  - `VerticalLegSlopeHeight` must be less or equal to double `Thickness`

![LShape (only mandatory properties)](media/ProfilePictures/LShape1.png)
![LShape (all properties)](media/ProfilePictures/LShape2.png)

### TTShapeProfile
**Derivative properties:**
- `FlangeInnerFaceLength` = (`FlangeWidth` - 2 * `WebThickness` - `WebSpacing`) / 2
- `FlangeSlopeHeight` = `FlangeInnerFaceLength` * Tan(`FlangeSlope`)
- `WebOuterFaceLength` = `Depth` - `FlangeThickness` + `FlangeSlopeHeight` / 2
- `WebInnerFaceLength` = `Depth` - `FlangeThickness` - `FlangeSlopeHeight` / 2
- `WebOuterSlopeHeight` = `WebOuterFaceLength` * Tan(`WebSlope`)
- `WebInnerSlopeHeight` = `WebInnerFaceLength` * Tan(`WebSlope`)

**Constraints:**
- `FlangeWidth` must be greater than zero
- `Depth` must be greater than zero
- `FlangeThickness`
  - must be greater than zero
  - must be less than `Depth`
- `WebThickness`
  - must be greater than zero
  - two times `WebThickness` plus `WebSpacing` must be less than `FlangeWidth`
- `WebSpacing`
  - must be greater than zero
  - must be less than `FlangeWidth` minus two times `WebThickness`
- `FilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `FlangeInnerFaceLength` minus `WebOuterSlopeHeight`
  - must be less or equal to half `OuterFaceLength` minus `FlangeSlopeHeight`
- `FlangeEdgeRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to `FlangeThickness`
  - must be less or equal to half `FlangeInnerFaceLength`
- `FlangeSlope` (if set):
  - must be greater or equal to zero
  - must be less than ninety degrees
  - `FlangeSlopeHeight` must be less or equal to `WebOuterFaceLength`
  - `FlangeSlopeHeight` must be less or equal to double `FlangeThickness`
- `WebEdgeRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `WebThickness`
  - must be less or equal to half `WebOuterFaceLength`
- `WebSlope` (if set):
  - must be greater or equal to zero
  - must be less than ninety degrees
  - `WebOuterSlopeHeight` must be less or equal to `FlangeInnerFaceLength`
  - `WebOuterSlopeHeight` must be less or equal to `WebThickness`
  - `WebInnerSlopeHeight` must be less or equal to `WebSpacing`

![TTShape (only mandatory properties)](media/ProfilePictures/TTShape1.png)
![TTShape (all properties)](media/ProfilePictures/TTShape2.png)

### SchifflerizedLShapeProfile

Note that `EdgeRadius` can be bigger than thickness.

**Constraints:**
- `LegLength` must be greater than zero
- `Thickness`
  - must be greater than zero
  - must be less than `LegLength` divided by square root of three
- `LegBendOffset` (if set):
  - must be greater or equal to `Thickness`
  - must be less than `LegLength` minus `Thickness`
- `FilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to `LegBendOffset` minus `Thickness`
- `EdgeRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to `LegLength` minus `LegBendOffset` minus `Thickness` multiplied by the tangent of fifteen degrees

![Schifflerized (only mandatory properties)](media/ProfilePictures/Schifflerized1.png)
![Schifflerized (all properties)](media/ProfilePictures/Schifflerized2.png)

### ZShapeProfile
**Derivative properties:**
- `FlangeInnerEdgeLength` = (`FlangeWidth` - `WebThickness`) / 2
- `FlangeSlopeHeight` = `FlangeInnerEdgeLength` * Tan(`FlangeSlope`)
- `WebEdgeLength` = `Depth` - `FlangeThickness` * 2

**Constraints:**
- `FlangeWidth` must be greater than zero
- `Depth` must be greater than zero
- `FlangeThickness`
  - must be greater than zero
  - must be less than half `Depth`
- `WebThickness`
  - must be greater than zero
  - must be less than `FlangeWith`
- `FilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `FlangeInnerEdgeLength`
  - must be less or equal to half `WebEdgeLength` minus `FlangeSlopeHeight`
- `FlangeEdgeRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to `FlangeThickness`
  - must be less or equal to half `FlangeInnerEdgeLength`
- `FlangeSlope` (if set):
  - must be greater or equal to zero
  - must be less than ninety degrees
  - `FlangeSlopeHeight` must be less or equal to `WebEdgeLength`
  - `FlangeSlopeHeight` must be less or equal to double `FlangeThickness`

![ZShape (only mandatory properties)](media/ProfilePictures/ZShape2.png)
![ZShape (all properties)](media/ProfilePictures/ZShape1.png)

### DerivedProfile
[SinglePerimeterProfile](#singleperimeterprofile) that is based on another [SinglePerimeterProfile](#singleperimeterprofile) with applied standard transformations (scale, rotation, translation, mirror). This [Profile](#profile) is defined for compatibility reasons with [IFC](#https://standards.buildingsmart.org/IFC/RELEASE/IFC4/FINAL/HTML/) and its **usage is not recommended**.

Note that deletion of the referenced [SinglePerimeterProfile](#singleperimeterprofile) is prohibited if there are [DerivedProfiles](#derivedprofile) that reference it.

### CenterLineCShapeProfile
**Constraints:**
- `FlangeWidth` must be greater than zero
- `Depth` must be greater than zero
- `WallThickness`
  - must be greater than zero
  - must be less than half `FlangeWidth`
  - must be less than half `Depth`
- `FilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `FlangeWidth` minus `WallThickness`
  - must be less or equal to half `Depth` minus `WallThickness`
- `Girth` (if set):
  - must be greater or equal to `WallThickness` plus `FilletRadius`
  - must be less than half `Depth`

![CenterLineCShape (only mandatory properties)](media/ProfilePictures/CenterCShape1.png)
![CenterLineCShape (all properties)](media/ProfilePictures/CenterCShape2.png)

### CenterLineLShapeProfile
**Constraints:**
- `Width` must be greater than zero
- `Depth` must be greater than zero
- `WallThickness`
  - must be greater than zero
  - must be less than half `Width`
  - must be less than half `Depth`
- `FilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `Width` minus `WallThickness`
  - must be less or equal to half `Depth` minus `WallThickness`
- `Girth` (if set):
  - must be greater than `WallThickness` plus `FilletRadius`
  - must be less than `Depth` minus `WallThickness`

![CenterLineLShape (only mandatory properties)](media/ProfilePictures/CenterLShape1.png)
![CenterLineLShape (all properties)](media/ProfilePictures/CenterLShape2.png)

### CenterLineZShapeProfile
**Constraints:**
- `FlangeWidth` must be greater than zero
- `Depth` must be greater than zero
- `WallThickness`
  - must be greater than zero
  - must be less than half `Width`
  - must be less than half `Depth`
- `FilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `Depth` minus `WallThickness`
  - if `Girth` is set:
    - must be less or equal to half `FlangeWidth` minus `WallThickness`
    - must be less or equal to `Girth` minus `WallThickness`
  - if `Girth` is not set:
    - must be less or equal to `FlangeWidth` minus `WallThickness`
- `Girth` (if set):
  - must be greater than `WallThickness`

![CenterLineZShape (only mandatory properties)](media/ProfilePictures/CenterZShape1.png)
![CenterLineZShape (all properties)](media/ProfilePictures/CenterZShape2.png)

### AsymmetricCenterlineZShapeProfile
- `TopFlangeWidth` must be greater than zero
- `BottomFlangeWidth` must be greater than zero
- `Depth` must be greater than zero
- `WallThickness`
  - must be greater than zero
  - must be less than half `Width`
  - must be less than half `Depth`
- `FilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `Depth` minus `WallThickness`
  - if `Girth` is set:
    - must be less or equal to half `FlangeWidth` minus `WallThickness`
    - must be less or equal to `Girth` minus `WallThickness`
  - if `Girth` is not set:
    - must be less or equal to `FlangeWidth` minus `WallThickness`
- `Girth` (if set):
  - must be greater than `WallThickness`
- `Girth Slope` (if set):
  - must be greater than zero
  - must be less than or equal to ninety degrees

![AsymmetricCenterZShape (all properties)](media/ProfilePictures/AsymmetricCenterZShape.png)

### BentPlateProfile
**Derivative properties:**
- `MaximumWallThickness` = Min(`Width` - `BendOffset`, `BendOffset`) * Tan(`BendAngle` / 2) * 2

**Constraints:**
- `Width` must be greater than zero
- `WallThickness`
  - must be greater than zero
  - must be less than `MaximumWallThickness`
- `BendAngle`
  - must be greater than zero
  - must be less than one hundred eighty degrees
- `BendOffset`
  - must be greater than zero
  - must be less than `Width`
- `FilletRadius`
  - must be greater than zero
  - must be less or equal to half `MaximumWallThickness` minus half `WallThickness`

![BentPlate](media/ProfilePictures/BentPlate.png)

### CompositeProfile

Abstract [Profile](#profile) class that is comprised of multiple [SinglePerimeterProfiles](#singleperimeterprofile). See [ArbitraryCompositeProfile](#arbitrarycompositeprofile), [DoubleLShapeProfile](#doublelshapeprofile) and [DoubleCShapeProfile](#doublecshapeprofile) for instantiable composite [Profiles](#profile).

### ArbitraryCompositeProfile
Instantiable [CompositeProfile](#compositeprofile) that is used to define an arbitrary [Profile](#profile) with multiple areas.

This Profile is constructed by inserting [ArbitraryCompositeProfileAspects](#arbitrarycompositeprofileaspects) that reference and transform [SinglePerimeterProfiles](#singleperimeterprofile). [ArbitraryCompositeProfile](#arbitrarycompositeprofile) can reference the same [SinglePerimeterProfile](#singleperimeterprofile) multiple times, but apply different transformations.

**Examples:**
- An [ArbitraryCompositeProfile](#arbitrarycompositeprofile) that is made up of 2 [Profiles](#profile):
  - [IShapeProfile](#ishapeprofile) - referenced once with no transformation.
  - [RectangleProfile](#rectangleprofile) - referenced twice with different `Offset`.
  - ![ArbitraryComposite (cross)](media/ProfilePictures/ArbitraryComposite1.png)

### ArbitraryCompositeProfileAspect

Aspect that is used by [ArbitraryCompositeProfile](#arbitrarycompositeprofile) to reference [SinglePerimeterProfile](#singleperimeterprofile) from which it is composed.

This aspect also includes fields for transforming the referenced [SinglePerimeterProfile](#singleperimeterprofile) when creating the geometry of [ArbitraryCompositeProfile](#arbitrarycompositeprofile).

### DoubleLShapeProfile

Instantiable [CompositeProfile](#compositeprofile) that models a Double L shape profile where the single [LShapeProfiles](#lshapeprofile) are placed back to back with specified gap between them. This [Profile](#profile) references and requires a [LShapeProfile](#lshapeprofile) to exist in the BIS repository.

Note that deletion of the referenced [LShapeProfile](#lshapeprofile) is prohibited if there are [DoubleLShapeProfiles](#doublelshapeprofile) that reference it.

**Constraints:**
- `Spacing` must be equal or greater than zero

![DoubleLShape (DoubleLLongLegs)](media/ProfilePictures/DoubleLLongLegs.png)
![DoubleLShape (DoubleLShortLegs)](media/ProfilePictures/DoubleLShortLegs.png)

### DoubleCShapeProfile
Instantiable [CompositeProfile](#compositeprofile) that models a Double C shape profile where the single [CShapeProfiles](#cshapeprofile) are placed back to back with specified gap between them. This [Profile](#profile) references and requires a [CShapeProfile](#cshapeprofile) to exist in the BIS repository.

Note that deletion of the referenced [CShapeProfile](#cshapeprofile) is prohibited if there are [DoubleCShapeProfiles](#doublelshapeprofile) that reference it.

**Constraints:**
- `Spacing` must be equal or greater than zero

![DoubleCShape (DoubleLShortLegs)](media/ProfilePictures/DoubleCShape.png)

### ArbitraryShapeProfile

A [SinglePerimeterProfile](#singleperimeterprofile) whose geometry is defined by an arbitrary single perimeter. Geometry of [ArbitraryShapeProfile](#arbitraryshapeprofile) can have voids i.e. it
can be formed using a [ParityRegion](https://www.itwinjs.org/reference/core-geometry/curve/parityregion/) (see example of a Profile with a void).

**Constraints:**
- `Shape` (instance of [CurveCollection](https://www.itwinjs.org/reference/core-geometry/curve/curvecollection/) or [CurvePrimitive](https://www.itwinjs.org/reference/core-geometry/curve/curveprimitive/)
  - must be closed
  - must be of a single perimeter
  - must not self intersect
  - must be planar and lie on the XY plane

**Examples:**
- [ArbitraryShapeProfile](#arbitraryshapeprofile) whose `Shape` is a closed [LineString](https://www.itwinjs.org/reference/core-geometry/curve/linestring3d/).
  - ![ArbitraryShape (cross)](media/ProfilePictures/ArbitraryShape1.png)

- [ArbitraryShapeProfile](#arbitraryshapeprofile) whose `Shape` is a [ParityRegion](https://www.itwinjs.org/reference/core-geometry/curve/parityregion/) of a rectangle
([LineString](https://www.itwinjs.org/reference/core-geometry/curve/linestring3d/)) and the `Shape` of an [IShapeProfile](#ishapeprofile).
  - ![ArbitraryShape (IShapeProfile encasing)](media/ProfilePictures/ArbitraryShape2.png)

### ArbitraryCenterLineProfile

Extended [ArbitraryShapeProfile](#arbitraryshapeprofile) with an additional constraint that the defined single perimeter (area) must have a non self intersecting centerline. Geometry of such [Profile](#proflile) is created by applying a constant thickness to the centerline.

[ArbitraryCenterLineProfiles](#arbitrarycenterlineprofile) are often used to model cold-formed sections.

**Examples:**
- [ArbitraryCenterLineProfile](#arbitrarycenterlineprofile) that defines a "hat" shape profile.
  - ![ArbitraryCenterline (hat)](media/ProfilePictures/ArbitraryCenterline1.png)

**Constraints:**
- `WallThickness` must be greater than zero
- `Centerline`
  - must be continuous
  - must not self intersect
  - must be planar and lie on the XY plane

### EllipseProfile
**Constraints:**
- `XRadius` must be greater tan zero
- `YRadius` must be greater tan zero

![Ellipse](media/ProfilePictures/Ellipse.png)

### CircleProfile
**Constraints:**
- `Radius` must be greater tan zero

![Circle](media/ProfilePictures/Circle.png)

### HollowCircleProfile
**Constraints:**
- `Radius` must be greater than zero
- `WallThickness`
  - must be greater than zero
  - must be less than `Radius`

![HollowCircle](media/ProfilePictures/HollowCircle.png)

### RectangleProfile
**Constraints:**
- `Width` must be greater than zero
- `Depth` must be greater than zero

![Rectangle](media/ProfilePictures/Rectangle.png)

### RoundedRectangleProfile
**Constraints:**
- `Width` must be greater than zero
- `Depth` must be greater than zero
- `RoundingRadius`
  - must be greater than zero
  - must be less than half `Width`
  - must be less than half `Depth`

![RoundedRectangle](media/ProfilePictures/RoundedRectangle.png)

### HollowRectangleProfile
**Constraints:**
- `Width` must be greater than zero
- `Depth` must be greater than zero
- `WallThickness`
  - must be greater than zero
  - must be less than half `Width`
  - must be less than half `Depth`
- `InnerFilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `Width` minus `WallThickness`
  - must be less or equal to half `Depth` minus `WallThickness`
- `OuterFilletRadius` (if set):
  - must be greater or equal to zero
  - must be less or equal to half `Width`
  - must be less or equal to half `Depth`
  - must be greater than `InnerFilletRadius` plus `WallThickness` multiplied by `2 * Sqrt(2)`

![HollowRectangle (only mandatory properties)](media/ProfilePictures/HollowRectangle1.png)
![HollowRectangle (all properties)](media/ProfilePictures/HollowRectangle2.png)

### TrapezoidProfile
**Constraints:**
- `TopWidth` must be greater than zero
- `BottomWidth` must be greater than zero
- `Depth` must be greater than zero

![Trapezoid](media/ProfilePictures/Trapezoid.png)

### RegularPolygonProfile
**Constraints:**
- `SideCount` must be greater or equal to `3` and less or equal to `32`
- `SideLength` must be greater than zero

![RegularPolygon (all properties)](media/ProfilePictures/RegularPolygon.png)

### CapsuleProfile
**Constraints:**
- `Width` must be greater than zero
- `Depth` must be greater than zero

![Capsule](media/ProfilePictures/Capsule.png)

## Mixin Classes

### ICenterLineProfile

Mixin class used to define [Profiles](#profile) with a non self intersecting centerline and a constant thickness. These [Profiles](#profile) are often used to model cold-formed sections. See [CenterLineCShapeProfile](#centerlinecshapeprofile), [CenterLineLShapeProfile](#centerlinelshapeprofile), [CenterLineZShapeProfile](#centerlinezshapeprofile).

## Struct Classes

### CardinalPoint

All [Profiles](#profile) have an array of CardinalPoints containing 19 predefined standard cardinal points. In addition, users may define their own custom cardinal points and append them to the end of the array - in such case the name of the custom CardinalPoint must not clash with names of standard cardinal points.

Standard Cardinal points are:
- **BottomLeft** - Bottom left corner of the profiles bounding box
- **BottomCenter** - Middle point of bottom line of the profiles bounding box
- **BottomRight** - Bottom right corner of the profiles bounding box
- **MidDepthLeft** - Middle point of left line of the profiles bounding box
- **MidDepthCenter** - Center point of the profiles bounding box
- **MidDepthRight** - Middle point of right line of the profiles bounding box
- **TopLeft** - Top left corner of the profiles bounding box
- **TopCenter** - Middle point of top line of the profiles bounding box
- **TopRight** - Top right corner of the profiles bounding box
- **GeometricCentroid** - Geometric centroid of the profiles geometry
- **BottomInLineWithGeometricCentroid** - Most bottom point of the profiles geometry thats in-line with **GeometricCentroid**
- **LeftInLineWithGeometricCentroid** - Most left point of the profiles geometry thats in-line with **GeometricCentroid**
- **RightInLineWithGeometricCentroid** - Most right point of the profiles geometry thats in-line with **GeometricCentroid**
- **TopInLineWithGeometricCentroid** - Most top point of the profiles geometry thats in-line with **GeometricCentroid**
- **ShearCenter** - Shear center of the profiles geometry
- **BottomInLineWithShearCenter** - Most bottom point of the profiles geometry thats in-line with **ShearCenter**
- **LeftInLineWithShearCenter** - Most left point of the profiles geometry thats in-line with **ShearCenter**
- **RightInLineWithShearCenter** - Most right point of the profiles geometry thats in-line with **ShearCenter**
- **TopInLineWithShearCenter** - Most top point of the profiles geometry thats in-line with **ShearCenter**

## Enumerations

### DoubleLShapeProfileType

Enumeration used to specify how [DoubleLShapeProfiles](#doublelshapeprofile) geometry is created - which "legs" of the [LShapeProfile](#lshapeprofile) are placed back to back.