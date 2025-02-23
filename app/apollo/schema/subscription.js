/**
 * Copyright 2020, 2022 IBM Corp. All Rights Reserved.
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

const { gql } = require('apollo-server-express');

const subscriptionSchema = gql`
  input VersionRemoteInput {
    parameters: [ParameterInput]
  }
  input VersionInput {
    name: String!
    description: String
    type: String!
    content: String
    file: Upload
    remote: VersionRemoteInput
  },
  type BasicUser {
    id: String!
    name: String!
  }
  type RolloutStatus {
    successCount: Int
    errorCount: Int
  }
  type IdentitySyncStatus {
    syncedCount: Int
    pendingCount: Int
    failedCount: Int
    unknownCount: Int
  }
  type BasicChannelSubscription {
    uuid: String!
    orgId: String!
    name: String!
    groups: [String!]
    channelUuid: String!
    channelName: String!
    version: String!
    versionUuid: String!
    created: Date!
    updated: Date!
    custom: JSON
  }
  type ChannelSubscription {
    uuid: String!
    orgId: String!
    name: String!
    groups: [String!]
    clusterId: String
    cluster: BasicCluster
    channelUuid: String!
    channelName: String!
    channel: Channel
    version: String!
    versionUuid: String!
    versionObj: DeployableVersion
    owner: BasicUser!
    kubeOwnerName: String
    resources: [Resource!]
    created: Date!
    updated: Date!
    remoteResources: [Resource!]
    rolloutStatus: RolloutStatus
    identitySyncStatus: IdentitySyncStatus!
    groupObjs: [GroupDetail!]
    custom: JSON
  }
  type RemoveChannelSubscriptionReply {
    uuid: String!
    success: Boolean
  }
  type EditChannelSubscriptionReply {
    uuid: String!
    success: Boolean
  }
  type SetSubscriptionReply {
    uuid: String!
    success: Boolean
  }
  type AddChannelSubscriptionReply {
    uuid: String!
  }
  type ParameterTuple {
    key: String!
    value: String!
  }
  type RemoteSource {
    remoteType: String!
    parameters: [ParameterTuple]
  }
  type UpdatedSubscription {
    subscriptionName: String!,
    subscriptionChannel: String!,
    subscriptionVersion: String!,
    subscriptionUuid: String!,
    url: String,
    remote: RemoteSource,
    kubeOwnerName: String
  }
  type SubscriptionUpdated {
    hasUpdates: Boolean
  }

  extend type Query {
     """
     Gets all subscriptions for orgId
     """
     subscriptions(orgId: String! @sv): [ChannelSubscription]
     """
     Get a single subscription
     """
     subscription(orgId: String! @sv, uuid: String! @sv): ChannelSubscription
     """
     Get a single subscription by name
     """
     subscriptionByName(orgId: String! @sv, name: String! @sv): ChannelSubscription

     """
     Agent-facing API. Gets all subscriptions for a cluster.
     """
     subscriptionsByClusterId(clusterId: String! @sv): [UpdatedSubscription]
     """
     Get subscriptions by clusterId
     """
     subscriptionsForCluster(orgId: String! @sv, clusterId: String! @sv): [ChannelSubscription]
     """
     Get subscriptions by clusterName
     """
     subscriptionsForClusterByName(orgId: String! @sv, clusterName: String! @sv): [BasicChannelSubscription]
  }
  extend type Mutation {
     """
     Adds a subscription
     """
     addSubscription(orgId: String! @sv, name: String! @sv, groups: [String!] @sv, channelUuid: String! @sv, versionUuid: String @sv, version: VersionInput, clusterId: String @sv, custom: JSON): AddChannelSubscriptionReply!

     """
     Edits a subscription
     """
     editSubscription(orgId: String! @sv, uuid: String! @sv, name: String! @sv, groups: [String!]! @sv, channelUuid: String! @sv, versionUuid: String, version: VersionInput, clusterId: String @sv, updateClusterIdentity: Boolean, custom: JSON): EditChannelSubscriptionReply!

     """
     Set a configurationVersion
     """
     setSubscription(orgId: String! @sv, uuid: String! @sv, versionUuid: String! @sv ): SetSubscriptionReply!

     """
     Removes a subscription
     """
     removeSubscription(orgId: String! @sv, uuid: String! @sv, deleteVersion: Boolean ): RemoveChannelSubscriptionReply
  }
  extend type Subscription {
    subscriptionUpdated: SubscriptionUpdated!
  }
`;

module.exports = subscriptionSchema;
