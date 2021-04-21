/**
 * Copyright 2020 - 2021 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(window) {
    window["env"] = window["env"] || {};

    window["env"]["production"] = false;
    window["env"]["apiUri"] = "http://localhost:8080";
    window["env"]["lpgUri"] = "http://localhost:8090";
    window["env"]["tokenRedirect"] = "http://localhost:4200/receiveToken";
    window["env"]["logoutRedirect"] = "http://localhost:4200/handleLogout";
    window["env"]["cognitoBaseUrl"] = "mentorsuccess-localhost.auth.us-west-2.amazoncognito.com";
    window["env"]["cognitoClientId"] = "2j1eb0o8qfsbrpaqsftd879c79";
})(this);
