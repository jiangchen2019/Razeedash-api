################################################################################
# Copyright 2019 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
################################################################################
#######################################
# Build the preliminary image
#######################################
FROM registry.access.redhat.com/ubi8/nodejs-16 as buildImg

# USER root
# RUN dnf -y update
# RUN dnf -y install python2 make g++

USER 1001:0
WORKDIR /home/app

COPY --chown=1001:0 . /home/app
RUN npm install --production --loglevel=warn --legacy-peer-deps


#######################################
# Build the production image
#######################################
FROM registry.access.redhat.com/ubi8/nodejs-16-minimal

USER 1001:0
WORKDIR /home/app

RUN export BUILD_TIME=`date '+%Y-%m-%d %H:%M:%S'`
ARG BUILD_TIME
ENV BUILD_TIME=${BUILD_TIME}
ARG BUILD_ID
ENV BUILD_ID=${BUILD_ID}

COPY --chown=1001:0 --from=buildImg /home/app /home/app

EXPOSE 3333
CMD ["npm", "start"]
