/**
 * Copyright 2020 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const axios = require('axios');

const clusterFunc = grahqlUrl => {
  const byClusterID = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          query($orgId: String! $clusterId: String! $resourceLimit: Int = 500 $groupLimit : Int) {
            clusterByClusterId(orgId: $orgId clusterId: $clusterId, resourceLimit: $resourceLimit, groupLimit: $groupLimit) {
              id
              orgId
              clusterId
              status
              regState
              groups {
                uuid
                name
              }
              groupObjs {
                uuid
                name
              }
              lastOrgKey {
                uuid
                name
              }
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  const byClusterName = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          query($orgId: String! $clusterName: String! $resourceLimit: Int = 500) {
            clusterByName(orgId: $orgId clusterName: $clusterName, resourceLimit: $resourceLimit) {
              id
              orgId
              status
              clusterId
              lastOrgKey {
                uuid
                name
              }
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  const byClusterIDDistributed = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          query($orgId: String! $clusterId: String!) {
            clusterDistributedByClusterId(orgId: $orgId clusterId: $clusterId) {
              id
              orgId
              clusterId
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  const byOrgID = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          query($orgId: String!,  $limit: Int, $skip: Int, $startingAfter: String, $groupLimit : Int) {
            clustersByOrgId(orgId: $orgId, limit: $limit, skip: $skip, startingAfter: $startingAfter, groupLimit : $groupLimit) {
              id
              orgId
              clusterId
              status
              resources{
                selfLink
              }
              groups {
                uuid
                name
              }
              groupObjs {
                uuid
                name
              }
              lastOrgKey {
                uuid
                name
              }
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  const byOrgIDDistributed = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          query($orgId: String $limit: Int) {
            clustersDistributedByOrgId(orgId: $orgId limit: $limit) {
              id
              orgId
              clusterId
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  const search = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          query($orgId: String! $filter: String $limit: Int, $groupLimit: Int) {
            clusterSearch(orgId: $orgId filter: $filter limit: $limit, groupLimit: $groupLimit) {
              id
              orgId
              status
              clusterId
              groups {
                uuid
                name
              }
              groupObjs {
                uuid
                name
              }
              lastOrgKey {
                uuid
                name
              }
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  const searchDistributed = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          query($orgId: String! $filter: String $limit: Int) {
            clusterDistributedSearch(orgId: $orgId filter: $filter limit: $limit) {
              id
              orgId
              clusterId
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  const kubeVersionCount = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          query($orgId: String!) {
            clusterCountByKubeVersion(orgId: $orgId)  {
              id {
                major
                minor
              }
              count
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  const kubeVersionCountDistributed = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          query($orgId: String!) {
            clusterDistributedCountByKubeVersion(orgId: $orgId)  {
              id {
                major
                minor
              }
              count
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  const inactiveClusters = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          query($orgId: String! $limit: Int, $groupLimit: Int) {
            inactiveClusters(orgId: $orgId limit: $limit groupLimit: $groupLimit) {
              id
              orgId
              clusterId
              updated
              groups {
                uuid
                name
              }
              groupObjs {
                uuid
                name
              }
              lastOrgKey {
                uuid
                name
              }
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  const zombiesDistributed = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          query($orgId: String! $limit: Int) {
            clusterDistributedZombies(orgId: $orgId limit: $limit) {
              id
              orgId
              clusterId
              updated
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  const deleteClusterByClusterId = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          mutation($orgId: String! $clusterId: String!) {
            deleteClusterByClusterId(orgId: $orgId clusterId: $clusterId) {
              deletedClusterCount
              deletedResourceCount
              deletedResourceYamlHistCount
              deletedServiceSubscriptionCount
              url
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  const deleteClusters = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          mutation($orgId: String!) {
            deleteClusters(orgId: $orgId) {
              deletedClusterCount
              deletedResourceCount
              deletedResourceYamlHistCount
              deletedServiceSubscriptionCount
              url
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  const registerCluster = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          mutation($orgId: String!, $registration: JSON!, $idempotent: Boolean) {
            registerCluster(orgId: $orgId, registration: $registration, idempotent: $idempotent) {
              url
          }
        }
    `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  const enableRegistrationUrl = async (token, variables) =>
    axios.post(
      grahqlUrl,
      {
        query: `
          mutation($orgId: String!,$clusterId: String!) {
            enableRegistrationUrl(orgId: $orgId clusterId: $clusterId) {
              url
          }
        }
      `,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

  return {
    byClusterID,
    byClusterName,
    byClusterIDDistributed,
    byOrgID,
    byOrgIDDistributed,
    search,
    searchDistributed,
    kubeVersionCount,
    kubeVersionCountDistributed,
    inactiveClusters,
    zombiesDistributed,
    deleteClusterByClusterId,
    deleteClusters,
    registerCluster,
    enableRegistrationUrl
  };
};

module.exports = clusterFunc;
