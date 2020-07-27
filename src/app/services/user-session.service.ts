/**
 * Copyright 2020 Aion Technology LLC
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

import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

  private static ID_TOKEN = 'id_token';

  constructor() { }

  static handleLogin(params: URLSearchParams): void {
    this.addToStorage(UserSessionService.ID_TOKEN, params.get(UserSessionService.ID_TOKEN));
    this.addToStorage('access_token', params.get('access_token'));
  }

  private static addToStorage(key: string, value: any): void {
    console.log('adding to storage', key, value);
    localStorage.setItem(key, value);
  }

  handleLogout(): void {
    console.log('logging out');
    localStorage.removeItem('id_token');
  }

  isLoggedIn(): boolean {
    const idToken = localStorage.getItem(UserSessionService.ID_TOKEN);
    const loggedIn = idToken !== undefined && idToken !== null;
    return loggedIn;
  }

  get givenName(): string {
    if (!this.isLoggedIn()) {
      return null;
    }
    const token: any = localStorage.getItem(UserSessionService.ID_TOKEN);
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token);
    console.log('name', decoded.given_name);
    return decoded.given_name;
  }

}
