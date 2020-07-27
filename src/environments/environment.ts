/**
 * Copyright 2020 Aion Technology LLC
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

export const environment = {
  production: false,
  apiUri: 'http://localhost:8080',
  tokenRedirect: 'http://localhost:4200/receiveToken',
  logoutRedirect: 'http://localhost:4200/handleLogout',
  cognitoBaseUrl: 'mentorsuccess-localhost.auth.us-west-2.amazoncognito.com',
  cognitoClientId: '76on3r6c055h1pp2h99uc6jmbd'
};

import 'zone.js/dist/zone-error';
