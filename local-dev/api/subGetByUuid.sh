#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

RAZEE_SUB_UUID=${1:-${RAZEE_SUB_UUID:-pSubUuid}}
RAZEE_ORG_ID=${2:-${RAZEE_ORG_ID:-pOrgId}}

RAZEE_QUERY='query($orgId: String! $uuid: String!) { subscription(orgId: $orgId, uuid: $uuid) { name, orgId, groups, satcluster: clusterId, channelName, channelUuid, version, versionUuid, versionObj { name, remote { parameters { key, value } } }, owner { id name }, uuid, created, rolloutStatus { successCount, errorCount }, remoteResources { cluster { clusterId, name }, searchableData, lastModified }, groupObjs { uuid, name, clusterCount, clusters { clusterId, syncedIdentities { id, syncStatus } } } } }'
RAZEE_VARIABLES='{"orgId":"'"${RAZEE_ORG_ID}"'", "uuid":"'"${RAZEE_SUB_UUID}"'"}'

echo "" && echo "GET subscription"
${SCRIPT_DIR}/graphqlPost.sh "${RAZEE_QUERY}" "${RAZEE_VARIABLES}" | jq --color-output
echo "Result: $?"
