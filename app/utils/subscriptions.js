
const { models } = require('../apollo/models');
const { CHANNEL_CONSTANTS } = require('../apollo/models/const');


const _ = require('lodash');

const getSubscriptionDetails = async(orgId, matchingSubscriptions, cluster) => {
  const matchingChannels = await models.Channel.find({
    org_id: orgId,
    name: { $in: _.map(matchingSubscriptions, 'channelName') },
  });

  const matchingChannelsByName = _.keyBy(matchingChannels, 'name');

  const kubeOwnerIds = _.uniq(_.map(matchingSubscriptions, 'kubeOwnerId'));
  let kubeOwnerIdsToNames = {};
  if(cluster.registration.location){
    kubeOwnerIdsToNames = await models.User.buildKubeOwnerIdToNameMapping(kubeOwnerIds);
  }

  let subs = await Promise.all( matchingSubscriptions.map(async (subscription) => {
    const channel = matchingChannelsByName[subscription.channelName];

    const sub = {
      subscriptionName: subscription.name,
      subscriptionChannel: subscription.channelName,
      subscriptionVersion: subscription.version,
      subscriptionUuid: subscription.uuid,
    };

    // Handle url (UPLOADED channels) or remote settings (REMOTE channels)
    if( !channel.contentType || channel.contentType === CHANNEL_CONSTANTS.CONTENTTYPES.UPLOADED ) {
      // URL built from channel name and version uuid (avoid using deprecated/ignored `versions` attribute on the channel)
      sub.url = `api/v1/channels/${subscription.channelName}/${subscription.version_uuid}`;
    }
    else if( channel.contentType === CHANNEL_CONSTANTS.CONTENTTYPES.REMOTE ) {
      sub.remote = {
        remoteType: channel.remote.remoteType,
        parameters: channel.remote.parameters || [],
      };
      // Find version (avoid using deprecated/ignored `versions` attribute on the channel)
      const version = await models.DeployableVersion.findOne( { org_id: orgId, uuid: subscription.version_uuid } );
      // Combine channel and version remote params
      if( version && version.content.remote.parameters ) {
        version.content.remote.parameters.forEach( vp => {
          const sp = sub.remote.parameters.find( p => p.key == vp.key );
          if( sp ) {
            sp.value = vp.value;  // Override the channel param with the value from the version param
          }
          else {
            sub.remote.parameters.push( vp ); // Add the version param
          }
        } );
      }
    }

    // Handle owner
    let kubeOwnerName = null;
    if(cluster.registration.location){
      kubeOwnerName = kubeOwnerIdsToNames[subscription.kubeOwnerId] || null;
      if(!kubeOwnerName){
        // for now, falls back to sub.kubeOwnerName if kubeOwnerId wasnt set (i.e. for old db objs that havent been migrated yet)
        // todo: delete this if-statement once we're done migrating
        kubeOwnerName = subscription.kubeOwnerName;
      }
    }
    if(kubeOwnerName){
      // forces iam usernames to be lowercase
      const iamMatch = kubeOwnerName.match(/^(IAM#)(.*)$/);
      if(iamMatch){
        kubeOwnerName = `${iamMatch[1]}${iamMatch[2].toLowerCase()}`;
      }
    }
    sub.kubeOwnerName = kubeOwnerName;

    return sub;
  }));
  subs = subs.filter(Boolean);
  return subs;
};

module.exports = {
  getSubscriptionDetails,
};
