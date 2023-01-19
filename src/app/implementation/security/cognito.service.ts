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

import {Injectable} from '@angular/core'
import {CognitoUserPool} from 'amazon-cognito-identity-js'
import {CognitoIdentity} from 'aws-sdk';
import * as AWS from 'aws-sdk/global'
import * as awsservice from 'aws-sdk/lib/service'
import {environment} from '../../../environments/environment'

export interface CognitoCallback {
  cognitoCallback(message: string, result: any): void
}

@Injectable()
export class CognitoService {
  public static POOL_DATA: any = {
    UserPoolId: environment.cognitoPoolId,
    ClientId: environment.cognitoClientId,
  }
  private cognitoCreds: AWS.CognitoIdentityCredentials

  get userPool(): CognitoUserPool {
    return new CognitoUserPool(CognitoService.POOL_DATA)
  }

  getCurrentUser() {
    return this.userPool.getCurrentUser()
  }

  buildCognitoCredentials(idJwtToken: string): AWS.CognitoIdentityCredentials {
    const url = 'congnito-idp.' + environment.region.toLowerCase() + '.amazonaws.com/' + environment.cognitoPoolId
    const logins: CognitoIdentity.LoginsMap = {}
    logins[url] = idJwtToken
    const params = {
      IdentityPoolId: environment.cognitoPoolId,
      Logins: logins
    }
    const serviceConfigs = <awsservice.ServiceConfigurationOptions> {}
    const credentials = new AWS.CognitoIdentityCredentials(params, serviceConfigs)
    this.cognitoCreds = credentials
    return credentials
  }

}
