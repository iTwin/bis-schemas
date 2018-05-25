/*--------------------------------------------------------------------------------------+
|
|     $Source: tools/signoff/src/SchemaSignoffTool.h $
|
|  $Copyright: (c) 2018 Bentley Systems, Incorporated. All rights reserved. $
|
+--------------------------------------------------------------------------------------*/

#include <DgnPlatform/DesktopTools/KnownDesktopLocationsAdmin.h>
#include <ECObjects/ECObjectsAPI.h>
#include <WebServices/Configuration/UrlProvider.h>
#include <WebServices/iModelHub/Common.h>
#include <WebServices/iModelHub/Client/Client.h>
#include <WebServices/iModelHub/Client/ClientHelper.h>

USING_NAMESPACE_BENTLEY_IMODELHUB
USING_NAMESPACE_BENTLEY_SQLITE
USING_NAMESPACE_BENTLEY_WEBSERVICES

/*---------------------------------------------------------------------------------**//**
* @bsimethod                                    Abeesh.Basheer                  09/2016
+---------------+---------------+---------------+---------------+---------------+------*/
    struct ServiceLocalState : public IJsonLocalState
    {
    private:
        Json::Value m_map;

    public:
        JsonValueR GetStubMap()
            {
            return m_map;
            }
        //! Saves the Utf8String value in the local state.
        //! @note The nameSpace and key pair must be unique.
        void _SaveValue(Utf8CP nameSpace, Utf8CP key, Utf8StringCR value) override
            {
            Utf8PrintfString identifier("%s/%s", nameSpace, key);

            if (value == "null")
                {
                m_map.removeMember(identifier);
                }
            else
                {
                m_map[identifier] = value;
                }
            };
        //! Returns a stored Utf8String from the local state.
        //! @note The nameSpace and key pair uniquely identifies the value.
        Utf8String _GetValue(Utf8CP nameSpace, Utf8CP key) const override
            {
            Utf8PrintfString identifier("%s/%s", nameSpace, key);
            return m_map.isMember(identifier) ? m_map[identifier].asCString() : "null";
            };
    };

struct BimDumper
{
protected:
    DgnDbPtr   m_dgndb;
    Utf8String m_fileName;
    bool       m_listSchemas;
    bool       m_hashSchemas;
    bool       m_dumpSchemas;
    Utf8String m_schemaToDump;
    Utf8String m_schemaToHash;

    void ParseCommandLineArg(int iarg, int argc, char** argv);
public:
    BimDumper ();
    BentleyStatus Run(int argc,  char** argv);
    static void Usage();
 
    BentleyStatus ListSchemas(bool hash);
    BentleyStatus DumpSchemas();
    BentleyStatus DumpSchema(ECSchemaCP pSchema);
};

struct HubManager 
{
protected:
    DgnDbPtr   m_dgndb;
    Utf8String m_fileName;

    Utf8String m_hubPassWord;
    Utf8String m_hubUserName;
    Utf8String m_hubProjectId;
    Utf8String m_briefcasePath;

    WebServices::UrlProvider::Environment m_environment;
    void ParseCommandLineArg (int iarg, int argc, char** argv);

    ClientPtr authenticate(WebServices::UrlProvider::Environment environment, BeFileNameCR assetFolder, Utf8CP pUserName, Utf8CP pPassWord);
    ServiceLocalState* getLocalState();
    WebServices::ClientInfoPtr getClientInfo();
public:
    BentleyStatus Run(int argc, char** argv);
    static void Usage();

    BentleyStatus acquireBriefcase(ClientCP clientPtr, Utf8CP pFilename, Utf8CP projectId, Utf8CP pLocalBriefcasePath);
};
