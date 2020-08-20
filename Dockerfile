# 
# Copyright 2020 Aion Technology LLC
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

# stage 1
FROM node:latest as build-stage

ARG TOKEN_REDIRECT
ARG LOGOUT_TOKEN_REDIRECT
ARG API_URL
ARG COGNITO_CLIENT_ID
ARG COGNITO_BASE_URL

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
COPY docker/run.sh .
RUN npm install -g @angular/cli@9.1.12
RUN sh run.sh

# stage 2
FROM nginx:alpine as prod-stage
RUN apk update
RUN apk add jq
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist/mentorsuccess-ui /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
