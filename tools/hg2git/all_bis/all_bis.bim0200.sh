#!/bin/bash
# If running on *nix, you may need to add root as a trusted group in your .hgrc
#```
#[trusted]
#users = root
#```
set -e
start=$SECONDS
DIR_ROOT=$(pwd)

# OVERRIDE
if [ -n "$TEST" ] && [ $TEST -eq 1 ]; then
    DIR_GIT="${DIR_ROOT}/test"
else
    TEST=0
fi

if [ "$DIR_GIT" == "" ]; then
    echo "error: must define DIR_GIT"
    exit 1
elif [ "$DIR_BIM0200" == "" ]; then
    echo "error: must define DIR_BIM0200"
    exit 1
fi
# OVERRIDE

DIR_BIM0200_SRC="${DIR_BIM0200}/src"
DIR_ALL_BIS="${DIR_ROOT}/all_bis"
DIR_ALL_BIS_FILEMAPS="${DIR_ALL_BIS}/filemaps"
DIRS_HG=(
    "${DIR_BIM0200_SRC}/DgnDomains/AecUnits"
    "${DIR_BIM0200_SRC}/DgnDomains/BridgeStructuralPhysical"
    "${DIR_BIM0200_SRC}/DgnDomains/Building"
    "${DIR_BIM0200_SRC}/DgnDomains/BuildingSpacePlanning"
    "${DIR_BIM0200_SRC}/ConstructionSchema"
    "${DIR_BIM0200_SRC}/DgnDomains/Costing"
    "${DIR_BIM0200_SRC}/DgnDomains/Egress"
    "${DIR_BIM0200_SRC}/DgnDomains/Electrical"
    "${DIR_BIM0200_SRC}/DgnDomains/Forms"
    "${DIR_BIM0200_SRC}/DgnDomains/LinearReferencing"
    "${DIR_BIM0200_SRC}/DgnDomains/Planning"
    "${DIR_BIM0200_SRC}/DgnDomains/Plant"
    "${DIR_BIM0200_SRC}/DgnDomains/Site"
    "${DIR_BIM0200_SRC}/DgnDomains/Structural"
    "${DIR_BIM0200_SRC}/ecstandards"
)
MAPS_HG=(
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/AecUnits.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/BridgeStructuralPhysical.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/Building.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/BuildingSpacePlanning.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/ConstructionPlanning.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/Costing.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/Egress.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/Electrical.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/Forms.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/LinearReferencing.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/Planning.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/Plant.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/Site.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/DgnDomains/Structural.filemap"
    "${DIR_ALL_BIS_FILEMAPS}/ECStandards.filemap"
)

ANSI_ESC="\033["
ANSI_ESC_DEFAULT="${ANSI_ESC}0m"
ANSI_ESC_BOLD="${ANSI_ESC}1m"
ANSI_ESC_UNDERLINE="${ANSI_ESC}4m"
ANSI_ESC_FG_RED="${ANSI_ESC}1;31m"
ANSI_ESC_FG_YELLOW="${ANSI_ESC}1;33m"
ANSI_ESC_FG_MAGENTA="${ANSI_ESC}1;35m"
ANSI_ESC_FG_CYAN="${ANSI_ESC}1;36m"

HEADER1="${ANSI_ESC_FG_YELLOW}${ANSI_ESC_BOLD}${ANSI_ESC_UNDERLINE}"
HEADER2="${ANSI_ESC_FG_MAGENTA}${ANSI_ESC_UNDERLINE}"

function cecho {
    if [ -t 1 ]; then # test isatty
        echo -e "${1}${2}${ANSI_ESC_DEFAULT}"
    else
        echo "${2}"
    fi
}

function advanced_engineering_strategy_to_prevent_random_failures {
    sleep 1
}

################################################################################

cecho $ANSI_ESC_FG_CYAN "GIT REPO:"
echo -e ">> $DIR_GIT"
cecho $ANSI_ESC_FG_CYAN "HG REPOS:"
for r in ${DIRS_HG}; do
    echo -e ">> ${r}"
done

## Setup example git repo.
if [ $TEST -ne 0 ]; then
    set -x
    rm -rf $DIR_GIT
    mkdir -p $DIR_GIT

    cecho ${HEADER1} "SETTING UP GIT REPO"
    cd $DIR_GIT
    git init
    echo "This git repo is #monolit." > README.txt
    git add .
    git commit -m "init commit"

    cecho ${HEADER2} "GIT REPO AFTER SETUP"
    tree $DIR_GIT -n
    set +x
fi

## Create new branch
if [ $TEST -ne 0 ]; then
    GIT_BRANCH="test_branch"
else
    GIT_BRANCH="bim0200dev_merge_$(date +%Y-%m-%d)"
fi
cd $DIR_GIT
set +e
CURR_BRANCH=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
git checkout -b $GIT_BRANCH
if [ $? -ne 0 ]; then
    echo "BRANCH ALREADY EXISTS"
    git checkout $GIT_BRANCH
fi
set -e


## Conversion/Merge.
set +e
i=0
while [ $i -lt ${#DIRS_HG[@]} ]; do
    cecho ${ANSI_ESC_FG_YELLOW} "${DIRS_HG[$i]}"
    OUT_STR=$(python ${DIR_ROOT}/hg2git.py convert ${DIRS_HG[$i]} $DIR_GIT ${MAPS_HG[$i]})
    STATUS=$?
    echo "$OUT_STR"
    echo "STATUS: ${STATUS}"
    if [ $STATUS -ne 0 ]; then
        # vv grep returns zero if found so this "bool" actually has inverted meaning.
        FAILED_BECUASE_NO_CHANGES=$(echo "${OUT_STR}" | grep "no changes found")
        if [ -z "$FAILED_BECUASE_NO_CHANGES" ]; then
            cecho ${ANSI_ESC_FG_RED} "NON-ZERO EXIT STATUS RETURNED DURING CONVERT"
            cecho ${ANSI_ESC_FG_RED} "MERGE ON ${DIRS_HG[$i]} WILL NOT BE PERFORMED"
        else
            cecho ${ANSI_ESC_FG_YELLOW} "NO CHANGES FOUND"
        fi
    fi
    advanced_engineering_strategy_to_prevent_random_failures

    if [ $STATUS -eq 0 ]; then # Only merge is convert succeded.
        OUT_STR=$(python ${DIR_ROOT}/hg2git.py merge ${DIRS_HG[$i]} $DIR_GIT $GIT_BRANCH)
        echo "$OUT_STR"
        STATUS=$?
        echo "STATUS: ${STATUS}"
        if [ $STATUS -ne 0 ]; then
            cecho ${ANSI_ESC_FG_RED} "FAILURE DURING MERGE"
        fi
        advanced_engineering_strategy_to_prevent_random_failures
    fi

    echo "================================================================"
    i=$(expr ${i} + 1)
done
set -e

duration=$(( $SECONDS - start ))
echo "TOTAL ELAPSED TIME: ${duration} seconds"
git checkout $CURR_BRANCH
exit 0
