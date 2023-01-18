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
import {AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js';
import {NewPasswordUser} from '../../components/user-session/change-password/change-password.component';
import {CognitoCallback, CognitoService} from './cognito.service';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  constructor(
    private cognitoService: CognitoService,
  ) {}

  newPassword(newPasswordUser: NewPasswordUser, callback: CognitoCallback) {
    const authenticationData = {
      Username: newPasswordUser.username,
      Password: newPasswordUser.existingPassword
    }
    const authenticationDetails = new AuthenticationDetails(authenticationData)
    const userData = {
      Username: newPasswordUser.username,
      Pool: this.cognitoService.userPool
    }
    const cognitoUser = new CognitoUser(userData)
    cognitoUser.authenticateUser(authenticationDetails, {
      newPasswordRequired: function(userAttributes, requiredAttributes) {
        delete userAttributes.email_verified
        cognitoUser.completeNewPasswordChallenge(newPasswordUser.password, requiredAttributes, {
          onSuccess: function(result) {
            callback.cognitoCallback(null, userAttributes)
          },
          onFailure(error) {
            callback.cognitoCallback(error, null)
          }
        })
      },
      onSuccess: function(result) {
        callback.cognitoCallback(null, result)
      },
      onFailure: function(error) {
        callback.cognitoCallback(error, null)
      }
    })
  }
}
