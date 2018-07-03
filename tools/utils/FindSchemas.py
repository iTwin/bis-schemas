#!Python
#--------------------------------------------------------------------------------------
#
#     $Source: tools/utils/FindSchemas.py $
#
#  $Copyright: (c) 2018 Bentley Systems, Incorporated. All rights reserved. $
#
#--------------------------------------------------------------------------------------
import os
from shutil import copy
import sys
from BisConstants import SCHEMA_EXTENSION, RELEASED_SCHEMA_EXTENSION_REGEX

# Return a string of last directory in a given path
def getLastDirInPath(path):
    return os.path.basename(os.path.normpath(path))

# Searches the given directory recursively to build a list of paths to directories containing schema files
# Returns a pair of lists: directoryList, releasedDirectoryList
# directoryList contains all non-release directories
# releaseDirectoryList contains all release directories
def generateSchemaDirectoryLists(schemaDirectory):
    directoryList = []
    releasedDirectoryList = []
    for root, dirs, files in os.walk(schemaDirectory):
        if any(file.endswith(SCHEMA_EXTENSION) for file in files):
            if getLastDirInPath(root) == 'Released':
                releasedDirectoryList.append(os.path.abspath(root))
            else:
                directoryList.append(os.path.abspath(root))
    return directoryList, releasedDirectoryList

# Returns a tuple containing all the non-release xml
# schemas that are contained in the a directory or any
# directories within that directory
def findAllNonReleaseSchemaPaths(schemaDirRoot):
  # Recursively find all the directories that contain schemas
  schemaDirectories = generateSchemaDirectoryLists(schemaDirRoot)

  # Just grab the non-release schemas
  schemaDirectories = schemaDirectories[0]

  schemaFiles = []

  # Loop through each file in each directory, if a file ends with ecschema.xml, add it to the schemas tuple
  for schemaDir in schemaDirectories:
    for schemaFile in os.listdir(schemaDir):
      if schemaFile.endswith(SCHEMA_EXTENSION):
        schemaFiles.append(schemaDir + "\\" + schemaFile)
  return schemaFiles

# Given a directory containing schemas and an output
# directory, copies all the xml schemas within the root
# or directories in the root to the output directory
def __collectAllNonReleaseSchemaFiles(schemaDirRoot, outDir):
  # Copy the files
  for schemaFile in findAllNonReleaseSchemaPaths(schemaDirRoot):
    copy(schemaFile, outDir)

# Copies all non-release xml schemas into the specified
# output directory
def collectAllNonReleaseSchemaFiles(outDir):
  __collectAllNonReleaseSchemaFiles(schemaDirRoot="..\\..\\", outDir=outDir)