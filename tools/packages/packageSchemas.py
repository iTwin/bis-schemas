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

# determine if version2 is a newer version
def isNewer(version1, version2):
    v1 = [int(x) for x in version1.strip('.').split('.')]
    v2 = [int(x) for x in version2.strip('.').split('.')]
    if cmp(v1, v2) == -1:
        return str(v2[0]) + "." + str(v2[1]) + "." + str(v2[2])
    return str(v1[0]) + "." + str(v1[1]) + "." + str(v1[2])

# Replace ${macros} with values in specified file
def setMacros(packagedir, domainName, PACKAGE_VERSION = None, IS_BETA = False):
    packagefile = os.path.join(packagedir, 'package.json')
    version = PACKAGE_VERSION.lower()
    packageName = 'bis-' + domainName.lower()
    if IS_BETA:
        cmd = 'npm view @bentley/' + packageName + ' versions'
        try:
            origlist = subprocess.check_output(cmd, shell=True)
            origlist = origlist.strip('\n[] ').split(',')
            vlist = map(lambda x: x.strip("' "), origlist)
            betaversionlist = filter(lambda x: '-beta' in x, vlist)
            if not betaversionlist:
                raise Exception('go to -beta.1')
            betanum = int(betaversionlist[len(betaversionlist)-1].rsplit('-beta.', 1)[1]) + 1
            version = version + '-beta.' + str(betanum)
        except:
            version = version + '-beta.1'
    
    reader = ''
    with open(packagefile, 'r') as pf:
        reader = pf.read()

    with open(packagefile, 'w') as pf:
        reader = reader.replace(r'${PACKAGE_NAME}', packageName)
        reader = reader.replace(r'${DOMAIN_NAME}', domainName)
        if (PACKAGE_VERSION):
            reader = reader.replace(r'${PACKAGE_VERSION}', version)
        pf.write(reader)

# Generate BIS Schemas package 
# @param outdir The path to the output package's parent directory
# @param parentSourceDir The source directory, i.e., %SrcRoot%Domains
# @param domain The path to the domain that will be packaged.
# @param templateFile The location of the package template file
def generate_schema_package(outDir, parentSourceDir, domain, templateFile):
    version = '1.0.0'
    schemaSourceDir = os.path.join(parentSourceDir, domain)

    os.makedirs(outDir)

    # Copy schemas into place without modifying them.
    filesToCopy = []
    for root, dirnames, filenames in os.walk(schemaSourceDir):
        for file in filenames:
            if 'Released' in root and file.endswith('ecschema.xml'):
                fileversion = file.split('.', 1)[1].replace('.ecschema.xml', '')
                version = isNewer(version, fileversion)
            elif file.endswith('ecschema.xml'):
                filesToCopy.append(os.path.join(root, file))

    for fileToCopy in filesToCopy:
        shutil.copyfile(fileToCopy, os.path.join(outDir, os.path.basename(fileToCopy)))

    # Generate the package.json file
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

    outDir = sys.argv[1]
    domain = sys.argv[2]
    sourceDir = sys.argv[3]
    templateFile = sys.argv[4]
    prerelease = (sys.argv[6].lower() == 'true')

    if outDir.endswith ('/') or outDir.endswith ('\\'):
        outDir = outDir[0:len(outDir)-1]

    pkgdir = os.path.join(outDir, domain)

    if os.path.exists(pkgdir):
        print '*** ' + pkgdir + ' already exists. Remove output directory before calling this script'
        exit(1)

    # Generates the package direction in the path provided and returns the version of the package it just created.
    version = generate_schema_package(pkgdir, sourceDir, domain, templateFile)

    setMacros(pkgdir, domain, version, prerelease)
