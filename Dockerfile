#
# Copyright 2020-2024 Aion Technology LLC
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
FROM node:iron-alpine3.18 as build-stage

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm install -g @angular/cli@17.1.1
RUN npm run build

# stage 2
FROM nginx:alpine as prod-stage
RUN apk update
RUN apk add jq
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist/mentorsuccess-ui /usr/share/nginx/html
EXPOSE 80
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
