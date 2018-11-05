#--------------------------------------------------------------------------------------
#
#     $Source: tools\packages\packageSchemas.py $
#
#  $Copyright: (c) 2018 Bentley Systems, Incorporated. All rights reserved. $
#
#--------------------------------------------------------------------------------------

# This program creates a directory that looks like an npm package, naming it
# with the specified name, and copying into it the imodeljs node addons that are defined in the
# specified product.

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
        return True
    return False

# publish a package
def publishPackage(packagedir, doPublish):

    if not doPublish:
        print packagedir;
        return;

    pubcmd = 'npm publish '
    pubcmd += '--@bentley:registry=https://bentley.jfrog.io/bentley/api/npm/staging/ '
    pubcmd += packagedir
    pubcmd += ' --dry-run'

    if 0 != os.system(pubcmd):
        exit(1);

# Replace ${macros} with values in specified file
def setMacros(packagedir, domainName, PACKAGE_VERSION = None, IS_BETA = False):
    packagefile = os.path.join(packagedir, 'package.json')
    version = PACKAGE_VERSION.lower()
    packageName = 'bis-' + domainName.lower();
    if IS_BETA:
        cmd = 'npm view @bentley/' + packageName + ' versions'
        try:
            list = subprocess.check_output(cmd, shell=False)
            betaversionlist = filter(lambda x: 'beta' in x, list)
            if not betaversionlist:
                raise Exception('go to beta.1')
            betanum = float(betaversionlist[len(betaversionlist)].rsplit('.', 1)[1]) + 1
            version = version + '-beta.' + str(betanum)
        except:
            version = version + '-beta.1'
    
    str = ''
    with open(packagefile, 'r') as pf:
        str = pf.read()

    with open(packagefile, 'w') as pf:
        str = str.replace(r'${PACKAGE_NAME}', packageName)
        str = str.replace(r'${DOMAIN_NAME}', domainName)
        if (PACKAGE_VERSION):
            str = str.replace(r'${PACKAGE_VERSION}', version)
        pf.write(str)

# Generate BIS Schemas packages
# @param outdirParent The path to the output package's parent directory
# @param parentSourceDir The source directory, i.e., %SrcRoot%Domains
# @param domain The domain to be packaged
# @param templateFile The location of the package template file
def generate_schema_package(outputpackagedir, parentSourceDir, domain, templateFile):

    version = '1.0.0'
    schemaSourceDir = os.path.join(parentSourceDir, domain)

    os.makedirs(outputpackagedir);

    # Copy schemas into place without modifying them.
    filesToCopy = []
    for root, dirnames, filenames in os.walk(schemaSourceDir):
        for file in filenames:
            if 'Released' in root and file.endswith('ecschema.xml'):
                fileversion = file.split('.', 1)[1].replace('.ecschema.xml', '')
                if isNewer(version, fileversion):
                    version = fileversion
            elif file.endswith('ecschema.xml'):
                filesToCopy.append(os.path.join(root, file))

    for fileToCopy in filesToCopy:
        shutil.copyfile(fileToCopy, os.path.join(outputpackagedir, os.path.basename(fileToCopy)))

    # Generate the package.json file
    dstpackagefile = os.path.join(outputpackagedir, 'package.json')
    shutil.copyfile(templateFile, dstpackagefile);

    return version
#
#   main
#
if __name__ == '__main__':
    if len(sys.argv) < 6:
        print "Syntax: ", sys.argv[0], " outputpackageparentdir domain sourceDir templateFile {publish|print} isBeta"
        exit(1)
    
    outdirParent = sys.argv[1]
    domain = sys.argv[2]
    sourceDir = sys.argv[3]
    templateFile = sys.argv[4]
    doPublish = (sys.argv[5].lower() == 'publish');
    beta = (sys.argv[6].lower() == 'true')

    if outdirParent.endswith ('/') or outdirParent.endswith ('\\'):
        outdirParent = outdirParent[0:len(outdirParent)-1]
    
    pkgdir = os.path.join(outdirParent, domain)

    if os.path.exists(pkgdir):
        print '*** ' + pkgdir + ' already exists. Remove output directory before calling this script';
        exit(1)

    setMacros(pkgdir, domain, generate_schema_package(pkgdir, sourceDir, domain, templateFile), beta)
    publishPackage(pkgdir, doPublish)

    exit(0)