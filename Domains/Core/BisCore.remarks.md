# BisCore.01.00.00
Contains the core classes which define the structure of the BIS model that all domain schemas conform to.  

The BisCore schema also defines the database structure for an iModel.  Other schemas may not add to the db schema without explicit permission from BisCore.

## PhysicalPortion
Using this as an example because I want to get a better definition written down.

Abstract base used to represent a part of a larger Element that can be broken down in more detail in a sub Model.  Division of the larger Element into partitions is arbitry, defined by convention in a domain or by a user and individual portions are not viable outside the larger Element. 
