#!Python
#--------------------------------------------------------------------------------------
#
#  $Source: tools/SchemaBuildReporter.py $
#
#  $Copyright: (c) 2019 Bentley Systems, Incorporated. All rights reserved. $
#
#--------------------------------------------------------------------------------------

import os
import sys
import glob

#-------------------------------------------------------------------------------------------
#  Function to find out the latest released version of a schema
#  bsimethod                 Naveed.Khan             02/2020
#-------------------------------------------------------------------------------------------

def findLastestReleasedVersion(inputSchema, schemaDir):
  schemaFiles = [os.path.basename(filename) for filename in glob.glob(schemaDir + '/'+ inputSchema +'.*.ecschema.xml')]
  schemaVersions = [ filename.lower().split(inputSchema+".")[1].split(".ecschema.xml")[0] for filename in schemaFiles ]

  if not schemaVersions:
    print "No schema found similar to the schema name provided in input argument."
    exit(1)

  schemaVersions.sort(reverse=True)
  latest = schemaVersions[0]
  print latest

#-------------------------------------------------------------------------------------------
#  bsimethod                 Naveed.Khan             02/2020
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
