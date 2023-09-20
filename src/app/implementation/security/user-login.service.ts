/*
 * Copyright 2023 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Injectable} from '@angular/core';
import {AuthenticationDetails, CognitoUser, CognitoUserSession} from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import {CognitoCallback, CognitoService} from './cognito.service';

export interface LoggedInCallback {
  isLoggedIn(message: string, loggedIn: boolean): void
}

@Injectable()
export class UserLoginService {
  static SCHOOL_KEY = 'SchoolInstanceCache'

  constructor(
    private cognitoService: CognitoService,
  ) {}

  get isAuthenticated(): boolean {
    return this.cognitoService.getCurrentUser() != null
  }

  get isProgramAdmin(): boolean {
    return this.accessToken.decodePayload()?.['cognito:groups'][0] === 'PROGRAM_ADMIN'
  }

  get isSystemAdmin(): boolean {
    return this.accessToken.decodePayload()?.['cognito:groups'][0] === 'SYSTEM_ADMIN'
  }

  get schoolUUID(): string {
    return this.idToken.decodePayload()?.['custom:school_uuid']
  }

  get accessTokenJwt() {
    return this.accessToken?.getJwtToken()
  }

  private get accessToken() {
    let token = null
    this.cognitoService.getCurrentUser()?.getSession((error, session) => {
      token = session?.getAccessToken()
    })
    return token
  }

  private get idToken() {
    let token = null
    this.cognitoService.getCurrentUser().getSession((error, session) => {
      token = session.getIdToken()
    })
    return token
  }

  login(username: string, password: string, remember: boolean, callback: CognitoCallback) {
    console.log('UserLoginService: Starting login')

    const authenticationData = {
      Username: username,
      Password: password
    }
    const authenticationDetails = new AuthenticationDetails(authenticationData)
    const userData = {
      Username: username,
      Pool: this.cognitoService.userPool
    }
    console.log('UserLoginService: Params set. Authenticating the user')
    const cognitoUser = new CognitoUser(userData)

    cognitoUser.authenticateUser(authenticationDetails, {
      newPasswordRequired: (userAttributes, requiredAttributes) => callback.cognitoCallback('User must set password.', null),
      onSuccess: result => this.onLoginSuccess(callback, result),
      onFailure: error => this.onLoginFailure(callback, error),
      mfaRequired: (challengeName, challengeParameters) => { console.error('MFA not supported')}
    })
  }

  logout() {
    console.log('UserLoginService: Logging out')
    localStorage.removeItem(UserLoginService.SCHOOL_KEY)
    this.cognitoService.getCurrentUser().signOut()
  }

  forgotPassword(username: string, callback: CognitoCallback) {
    const userData = {
      Username: username,
      Pool: this.cognitoService.userPool
    }
    const cognitoUser = new CognitoUser(userData)
    cognitoUser.forgotPassword({
      onSuccess: function() {
      },
      onFailure: function(error) {
        callback.cognitoCallback(error.message, null)
      },
      inputVerificationCode() {
        callback.cognitoCallback(null, null)
      }
    })
  }

  confirmNewPassword(email: string, password: string, verificationCode: string, callback: CognitoCallback) {
    const userData = {
      Username: email,
      Pool: this.cognitoService.userPool
    }
    const cognitoUser = new CognitoUser(userData)
    cognitoUser.confirmPassword(verificationCode, password, {
      onSuccess: function() {
        callback.cognitoCallback(null, null)
      },
      onFailure: function(error) {
        callback.cognitoCallback(error.message, null)
      }
    })
  }

  setNewPassword(email: string, newPassword: string) {
    const userData = {
      Username: email,
      Pool: this.cognitoService.userPool
    }
    const cognitoUser = new CognitoUser(userData)
  }

  checkAuthenticated(callback: LoggedInCallback) {
    if (!callback) {
      throw('UserLoginService: Callback in isAuthenticated() cannot be null')
    }

    const cognitoUser = this.cognitoService.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession(function(error, session) {
        if (error) {
          console.error(`UserLoginService: Couldn't get the session: ${error}`, error.stack)
          callback.isLoggedIn(error, false)
        } else {
          console.log(`UserLoginService: Session is ${session.isValid()}`)
          callback.isLoggedIn(error, session.isValid())
        }
      })
    } else {
      console.log('UserLoginService: Can\'t retrieve the current user')
      callback.isLoggedIn('Can\'t retrieve the current user', false)
    }
  }

  private onLoginSuccess = (callback: CognitoCallback, session: CognitoUserSession) => {
    console.log('UserLoginService: Login succeeded')
    AWS.config.credentials = this.cognitoService.buildCognitoCredentials(session.getIdToken().getJwtToken())
    callback.cognitoCallback(null, session)
  }

  private onLoginFailure = (callback: CognitoCallback, error) => {
    console.error('UserLoginService: Login failed')
    callback.cognitoCallback(error.message, null)
  }
}
