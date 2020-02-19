#!Python
#--------------------------------------------------------------------------------------
#
#     $Source: tools/SchemaBuildReporter.py $
#
#  $Copyright: (c) 2019 Bentley Systems, Incorporated. All rights reserved. $
#
#--------------------------------------------------------------------------------------

import os
import sys

#-------------------------------------------------------------------------------------------
# Function to find out the latest released version of a schema
# bsimethod                 Naveed.Khan             02/2020
#-------------------------------------------------------------------------------------------

def findLastestReleasedVersion(inputSchema, schemaDir):
    allFiles = os.listdir(schemaDir)
    schemaVersions = []
    for filename in allFiles:
        schemaFound = filename.split(".")[0].lower()
        if inputSchema == schemaFound:
            version = filename.lower().split(inputSchema+".")[1].split(".ecschema.xml")[0]
            schemaVersions.append(version)

    if not schemaVersions:
        print "No schema found similar to the schema name provided in input argument."
        exit(1)

    latest = schemaVersions[0]
    for version in range(1, len(schemaVersions)):
        if schemaVersions[version] > latest:
            latest = schemaVersions[version]
    print latest

#-------------------------------------------------------------------------------------------
# bsimethod                 Naveed.Khan             02/2020
#-------------------------------------------------------------------------------------------
def main():
    if (len (sys.argv) > 3):
        print "Please check the command arguments."
        exit(1)
    inputSchema = sys.argv[1].lower()
    schemaDir = sys.argv[2]
        
    schemaDir = schemaDir + "Released"
    isExist = os.path.exists(schemaDir)
    if isExist:
        findLastestReleasedVersion(inputSchema, schemaDir)

if __name__ == "__main__":
    main()
