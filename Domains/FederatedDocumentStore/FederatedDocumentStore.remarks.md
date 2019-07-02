---
noEditThisPage: true
remarksTarget: FederatedDocumentStore.ecschema.md
---
# FederatedDocumentStore

The purpose of this schema is to facilitate document referencing scenarios. It introduces the concept of being able to link out to the documents in various Document Management Systems.

The linking from iModel to the external document will support various scenarios: document can be bridged in from ProjectWise Design Integration or it can be any ancillary document associated with elements in iModel - specifications, Excel spreadsheets, Word documents and etc.

The intended workflow is to access external documents via Bentley's Documents Service API - an aggregation API that can access any document in the CONNECTed Project through federated connections. 

## ExternalRepositoryLink

*RepositoryType* property defines the type of an external repository. 

Document Service API supports following repository types:
- PROJECTSHARE - for CONNECTed project Project Share service;
- PWDI - for federated connections to ProjectWise Design Integration;
- SHAREPOINT - for federated connections to SharePoint.

Sample *RepositoryLocation* and *ExternalId* values per different repository types: 

| RepositoryType  |RepositoryLocation | ExternalId    | 
| --------- | --------- | --------- | --------- |
| PROJECTSHARE | fc40a95a-90a8-4e8b-9231-0f2a4238638 |p32b9a20-cf41-4f8e-a68c-e4779618b256 | 
| PWDI | https://myserver.com/ws/v2.8/repositories/Bentley.PW--myserver.com~3APW10.00.03.140_PW_Web_WRE/PW_WSG/Project/6epldfb8-4125-4094-bf7b-fb4f2db4d683 | 67a49766-2b2b-47fd-a84e-e95aec07c366 |
| SHAREPOINT|b!Xz28CjAsz0GqXbZhj9aCl9wzRT5TM5NFhZFJPhA8k1U8X2sZJ4rCR5kEpQSLmkph|01WA72LBZOYEIKBKKFGRFKIYLVT4M7G7DV|
