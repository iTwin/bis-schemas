#--------------------------------------------------------------------------------------
#
#     $Source: tools\packages\packageSchemas.py $
#
#  $Copyright: (c) 2019 Bentley Systems, Incorporated. All rights reserved. $
#
#--------------------------------------------------------------------------------------

# This program creates a directory that looks like an npm package, naming it
# with the specified name, and copying the schemas that are defined in the
# specified domain folder into it.

import os
import sys
import re
import shutil
import subprocess

def removeLeadingZeroes(version):
    # Strip the leading zeroes from the version string
    versionArray = ['0', '0', '0']
    vArray = version.split('.')

    if len(vArray) == 2:
        vArray.insert(1, '0')

    for i in range(0, len(vArray)):
        versionArray[i] = str(int(vArray[i]))

    return ".".join(versionArray)

def getSchemaVersionFromFile(schemaFile):
    # Check if the version is in the file version first.
    versionMatch = re.search("\d{2}\.\d{2}\.\d{2}", schemaFile)

    if versionMatch is not None:
        return removeLeadingZeroes(versionMatch.group(0))

    # If it's not in the 
    with open(schemaFile, 'r') as f:
        contents = f.read()
        match = re.search(r'<ECSchema\s.*version=\"(\d{1,2}\.\d{1,2}(\.\d{1,2})?)', contents)
        if match is None:
            print 'Failed to get the version of Schema: ' + schemaFile
            exit(1)
        version = removeLeadingZeroes(match.group(1))

        if version is None:
            print 'Failed to get the version of Schema: ' + schemaFile
            exit(1)

    return version

# Check the npm registry to get a map of all the versions of a specific package.
def getExistingVersions(packageName):
    cmd = "npm view " + packageName + " versions"
    try:
        origlist = subprocess.check_output(cmd, stderr=subprocess.STDOUT, shell=True)
        origlist = origlist.strip('\n[] ').split(',')
        vlist = map(lambda x: x.strip("' "), origlist)
    except subprocess.CalledProcessError as exc:
        # Handle a package being missing from the registry differntly than any other error.  This means there are
        # no existing versions and we can return an empty list.
        if "Package not found" in exc.output:
            return dict()
        print("Status : FAIL", exc.returncode, exc.output)
        print "Failed to check if the package " + packageName + " has existing versions in the registry"
        exit(1)
    except:
        print "Failed to check if the package " + packageName + " has existing versions in the registry"
        exit(1)

    return vlist

# Replace ${macros} with values in specified file
# @param pkgDir         The directory of the package in the output folder
# @param domainName     The name of the domain this package will represent.
def populatePackageJson(packagedir, domainName, version, isPrerelease = False):
    packagefile = os.path.join(packagedir, 'package.json')
    packageName = "@bentley/bis-" + domainName.lower()

    vlist = getExistingVersions(packageName)

    if isPrerelease:
        betaVersion = version + "-beta"
        versionList = filter(lambda x: betaVersion in x, vlist)
        if versionList:
            betanum = int(versionList[len(versionList)-1].rsplit('-beta.', 1)[1]) + 1
            version = betaVersion + "." + str(betanum)
        else:  # There are no existing pre-release versions.  Start it at -beta.0
            version = betaVersion + ".0"

    reader = ""
    with open(packagefile, 'r') as pf:
        reader = pf.read()

    with open(packagefile, 'w') as pf:
        reader = reader.replace(r'${PACKAGE_NAME}', packageName)
        reader = reader.replace(r'${DOMAIN_NAME}', domainName)
        reader = reader.replace(r'${PACKAGE_VERSION}', version)
        pf.write(reader)

# Creates the directory that represents the BIS Schemas package by placing all files in the correct output directory.
#   All schemas within a domain folder are currently added to the package.
# @param outdir         The path to the output package's parent directory
# @param domainPath     The path to the domain that will be packaged, i.e. %SrcRoot%\bis-schemas\Domains.
# @param templateFile   The location of the package template file
# @param prerelease      Whether to package up the latest release version of the schema to release.
def generatePackage(outDir, domainPath, templateFile, prerelease = False):
    os.makedirs(outDir)

    # Copy schemas into place without modifying them.
    filesToCopy = []
    for root, dirnames, filenames in os.walk(domainPath):
        for file in filenames:
            if 'Released' in root:
                # TODO this is where the support for creating a "real" release version is needed.
                continue
            elif file.endswith('ecschema.xml'):
                filesToCopy.append(os.path.join(root, file))

    version = None
    for fileToCopy in filesToCopy:
        shutil.copyfile(fileToCopy, os.path.join(outDir, os.path.basename(fileToCopy)))
        # TODO: Not the best solution but right now we determine the package version by the last schema to be copied
        # into the package.  This needs work...
        version = getSchemaVersionFromFile(fileToCopy)

    # Copy the template package.json file
    dstpackagefile = os.path.join(outDir, 'package.json')
    shutil.copyfile(templateFile, dstpackagefile)

    return version

# @param outDir  The output directory for the package folder
# @param domain  The name of the domain folder to use
# @param sourceDir  The root folder where 
# @param templateFile  The template package.json file to use when generating the new package json.
# @param isPrerelease  Boolean flag to determine whether to add where the package should use a pre-release flag or not.
if __name__ == '__main__':
    if len(sys.argv) < 6:
        print "Syntax: ", sys.argv[0], " outputDir domain sourceDir templateFile isPrerelease"
        exit(1)

    outDir = os.path.normpath(sys.argv[1])
    domain = sys.argv[2]
    sourceDir = os.path.normpath(sys.argv[3])
    templateFile = sys.argv[4]
    if not os.path.exists(templateFile):
        print "Missing template package.json file, " + templateFile
        exit(1)

    prerelease = (sys.argv[5].lower() == 'true')
    if not prerelease:
        print "Packaging released versions is not yet supported."
        exit(1)

    if outDir.endswith ('/') or outDir.endswith ('\\'):
        outDir = outDir[0:len(outDir)-1]

    pkgdir = os.path.join(outDir, domain)

    if os.path.exists(pkgdir):
        print "*** " + pkgdir + " already exists. Remove output directory before calling this script."
        exit(1)

    # Generates the package direction in the path provided and returns the version of the package it just created.
    domainDir = os.path.join(sourceDir, domain)
    version = generatePackage(pkgdir, domainDir, templateFile, prerelease)
    if version is None:
        print "Failed to get the version the package should be."
        exit(1)

    # Populate the template package.json file
    populatePackageJson(pkgdir, domain, version, prerelease)
