/*--------------------------------------------------------------------------------------+
|
|     $Source: tools/signoff/src/SchemaSignoffTool.h $
|
|  $Copyright: (c) 2018 Bentley Systems, Incorporated. All rights reserved. $
|
+--------------------------------------------------------------------------------------*/

#include <DgnPlatform/DesktopTools/KnownDesktopLocationsAdmin.h>
#include <WebServices/Configuration/UrlProvider.h>

USING_NAMESPACE_BENTLEY_DGN

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

    BentleyB0200::WebServices::UrlProvider::Environment m_environment;
    void ParseCommandLineArg (int iarg, int argc, char** argv);
public:
    BentleyStatus Run(int argc, char** argv);
    static void Usage();
};
