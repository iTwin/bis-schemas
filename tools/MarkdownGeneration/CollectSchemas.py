import sys, os, shutil
from time import sleep
from threading import Thread
from distutils.version import StrictVersion
sys.path.append(os.path.abspath(os.path.join('..','SchemaDifference')))
from SchemaDifferenceRunner import getSchemaVersionFromFile, versionCompare
sys.path.append(os.path.abspath(os.path.join('..','utils')))
from FindSchemas import generateSchemaDirectoryLists
from BisConstants import SCHEMA_EXTENSION, RELEASED_SCHEMA_EXTENSION_REGEX

# Takes a list of schema files and returns the one that has the latest version
def getLatestVersionSchema(schemaList, schemaName):
  _schemaList = []

  # Collect all the release schemas from the list that match the name
  for schema in schemaList:
    # If the schema begins with the specified schema name and it's format matches a release schema, add it to the list
    if os.path.split(schema)[-1].split('.')[0] == schemaName and len(os.path.split(schema)[-1].split('.')) == 6:
      _schemaList.append(schema)

  if len(_schemaList) == 0:
    raise KeyError(schemaName, " not found in list")

  # Find the schema with the latest version
  latestSchema = _schemaList[0]
  latestVersion = getSchemaVersionFromFile(latestSchema)

  for nextSchema in _schemaList:
      nextVersion = getSchemaVersionFromFile(nextSchema)
      if versionCompare(nextVersion, latestVersion) > 0:
          latestSchema = nextSchema
          latestVersion = getSchemaVersionFromFile(latestSchema)

  return latestSchema

# Returns a tuple containing all the non-release and/or release xml schemas that are contained in the a directory or any directories within that directory
# pass true to collectRelease to collect Release schemas
# pass true to collectNonRelease to collect NonRelease schemas
def findAllSchemaPaths(collectRelease, collectNonRelease):
  # Recursively find all the directories that contain schemas
  AllSchemaDirectories = generateSchemaDirectoryLists(os.path.join('..','..'))

  schemaDirectories = []

  # Grab non-release schemas if told to
  if collectNonRelease:
    schemaDirectories += AllSchemaDirectories[0]

  # Grab release schemas if told to
  if collectRelease:
    schemaDirectories += AllSchemaDirectories[1]
  schemaFiles = []

  # Loop through each file in each directory, if a file ends with ecschema.xml, add it to the schemas tuple
  for schemaDir in schemaDirectories:
    for schemaFile in os.listdir(schemaDir):
      if schemaFile.endswith(SCHEMA_EXTENSION):
        schemaFiles.append(schemaDir + "\\" + schemaFile)

  return schemaFiles

# Given a directory containing schemas and an output directory, recursively copies all the xml schemas within the root the output directory
def collectSchemaFiles(filterList, outDir, collectRelease, collectNonRelease):
  # Get the paths to all requested schemas
  allSchemaPaths = findAllSchemaPaths(collectRelease=collectRelease, collectNonRelease=collectNonRelease)

  # If collect release is specified, copy over the latest version of each schema in the list
  if collectRelease:
    for schema in filterList:
      try:
        latestSchemaPath = getLatestVersionSchema(allSchemaPaths, schema)
        shutil.copy(latestSchemaPath, outDir)
      except KeyError:
        pass

  # If collect non-release is specified
  if collectNonRelease:
    for schema in allSchemaPaths:
      # Only copy a schema if it's in the list and it is a non-release schema
      schemaName = (os.path.split(schema)[-1].split('.'))[0]
      if schemaName in filterList and len(os.path.split(schema)[-1].split('.')) == 3:
        shutil.copy(schema, outDir)


if __name__ == '__main__':
  releaseSwitch = False
  nonReleaseSwitch = False
  allSwitch = False
  cleanSwitch = False

  if '-h' in sys.argv[1:] or '--help' in sys.argv[1:]:
    print("ptyhon CollectSchemas.py 'schemas to look for' [options]")
    print('\nOptions:')
    print('\t"--release" to collect release schemas')
    print('\t"--nonrelease" to collect nonrelease schemas')
    print('\t"--all" to collect nonrelease schemas and release schemas')
    print('\t"--clean" to clean the directories before running')
    exit()
  if '--release' in sys.argv[1:]:
    releaseSwitch = True
    sys.argv.remove('--release')
  elif '--nonrelease' in sys.argv[1:]:
    nonReleaseSwitch = True
    sys.argv.remove('--nonrelease')
  elif '--all' in sys.argv[1:]:
    allSwitch = True
    sys.argv.remove('--all')

  if '--clean' in sys.argv[1:]:
    cleanSwitch = True
    sys.argv.remove('--clean')

  filterList = sys.argv[1].split(' ')

  tempPath = os.path.join('.', 'temp')
  schemaXmlPath = os.path.join('.', 'temp', 'SchemaXml')
  schemaJsonPath = os.path.join('.', 'temp', 'SchemaJson')
  MarkdownPath = os.path.join('.', 'temp', 'Markdown')

  # If temp exists and cleanSwitch is set, get rid of it recursively
  if cleanSwitch and os.path.exists(tempPath):
    shutil.rmtree(tempPath)

    # Create directory structure:
    os.makedirs(tempPath)
    os.makedirs(schemaXmlPath)
    os.makedirs(schemaJsonPath)
    os.makedirs(MarkdownPath)

  else:
    if not os.path.exists(tempPath):
      os.makedirs(tempPath)
    if not os.path.exists(schemaXmlPath):
      os.makedirs(schemaXmlPath)
    if not os.path.exists(schemaJsonPath):
      os.makedirs(schemaJsonPath)
    if not os.path.exists(MarkdownPath):
      os.makedirs(MarkdownPath)

  if releaseSwitch:
    collectSchemaFiles(filterList=filterList, outDir=schemaXmlPath, collectRelease=True, collectNonRelease=False)
  elif nonReleaseSwitch:
    collectSchemaFiles(filterList=filterList, outDir=schemaXmlPath, collectRelease=False, collectNonRelease=True)
  elif allSwitch:
    collectSchemaFiles(filterList=filterList, outDir=schemaXmlPath, collectRelease=True, collectNonRelease=True)