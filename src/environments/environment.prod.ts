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
  production: true,
  apiUri: 'https://ve17iw2h0g.execute-api.us-west-2.amazonaws.com/prod',
  tokenRedirect: 'http://prod.mentorsuccess.aiontechnology.io/receiveToken',
  logoutRedirect: 'http://prod.mentorsuccess.aiontechnology.io/handleLogout'
};
