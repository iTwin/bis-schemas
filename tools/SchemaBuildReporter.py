#!Python
#--------------------------------------------------------------------------------------
#
#     $Source: tools/SchemaBuildReporter.py $
#
#  $Copyright: (c) 2019 Bentley Systems, Incorporated. All rights reserved. $
#
#--------------------------------------------------------------------------------------

import os, sys, argparse, re

# Return a string separated by semicolons into a list 
def semiColonSeparatedToList(s):
    return s.split(';')

def getMatchingLogFile(logDir, schemaName):
    for root, dirs, files in os.walk(logDir):
        for file in files:
            if file.startswith(schemaName):
                return os.path.join(os.path.abspath(root), file)

    return None


if __name__ == "__main__":
    argParser = argparse.ArgumentParser()
    argParser.add_argument("schemaName", type=str, help="The name of the schema to report")
    argParser.add_argument("logDir", type=str, help="The path to root directory of the log files")

    args = argParser.parse_args()

    logFile = getMatchingLogFile(args.logDir, args.schemaName)

    if not logFile:
        print("No log file found for schema '%s'" % args.schemaName)
        sys.exit(1)

    print("==========================================================================================")
    print("Log File: %s" % logFile)
    print("==========================================================================================")

    success = False
    regex = re.compile("^The schema '%s.ecschema.xml' SUCCEEDED.* validation.$" % args.schemaName)
    with open(logFile, 'r') as log:
        for line in log:
            print(line.rstrip('\n'))
            if regex.match(line):
                success = True
            
    if success:
        sys.exit(0)
    else:
        sys.exit(1)

    