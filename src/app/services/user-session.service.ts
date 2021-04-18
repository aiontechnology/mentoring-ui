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

import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

  private static ID_TOKEN = 'id_token';
  private static ACCESS_TOKEN = 'access_token';

  private helper: JwtHelperService;

  constructor() {
    this.helper = new JwtHelperService();
  }

  handleLogin(params: URLSearchParams): void {
    this.addToStorage(UserSessionService.ID_TOKEN, params.get(UserSessionService.ID_TOKEN));
    this.addToStorage(UserSessionService.ACCESS_TOKEN, params.get(UserSessionService.ACCESS_TOKEN));
  }

  handleLogout(): void {
    console.log('logging out');
    localStorage.removeItem(UserSessionService.ID_TOKEN);
    localStorage.removeItem(UserSessionService.ACCESS_TOKEN);
  }

  isLoggedIn(): boolean {
    const idToken = localStorage.getItem(UserSessionService.ID_TOKEN);
    const loggedIn = idToken !== undefined && idToken !== 'null' && idToken !== null;
    return loggedIn;
  }

  get idToken(): any {
    if (this.isLoggedIn()) {
      return localStorage.getItem(UserSessionService.ID_TOKEN);
    }
    return null;
  }

  get accessToken(): any {
    if (this.isLoggedIn()) {
      return localStorage.getItem(UserSessionService.ACCESS_TOKEN);
    }
    return null;
  }

  get givenName(): string {
    const decoded = this.decodeToken(this.idToken);
    return decoded?.given_name;
  }

  get schoolUUID(): string {
    const decoded = this.decodeToken(this.idToken);
    return decoded?.['custom:school_uuid'];
  }

  get isSysAdmin(): boolean {
    return this.group === 'SYSTEM_ADMIN';
  }

  get isProgAdmin(): boolean {
    return this.group === 'PROGRAM_ADMIN';
  }

  private get group(): string {
    const decoded = this.decodeToken(this.accessToken);
    return decoded?.['cognito:groups'][0];
  }

  private decodeToken(token: any): any {
    return this.helper.decodeToken(token);
  }

  private addToStorage(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

}
