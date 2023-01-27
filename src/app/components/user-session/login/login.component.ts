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

import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CognitoCallback} from '../../../implementation/security/cognito.service';
import {LoggedInCallback, UserLoginService} from '../../../implementation/security/user-login.service';
import {MultiItemCache} from '../../../implementation/state-management/multi-item-cache';
import {SingleItemCacheUpdater} from '../../../implementation/state-management/single-item-cache-updater';
import {School} from '../../../models/school/school';
import {SCHOOL_COLLECTION_CACHE, SCHOOL_INSTANCE_CACHE_UPDATER} from '../../../providers/global/global-school-providers-factory';

@Component({
  selector: 'ms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements LoggedInCallback, CognitoCallback, OnInit {
  email: string
  password: string
  errorMessage: string
  remember: boolean

  constructor(
    private router: Router,
    private userLoginService: UserLoginService,
    @Inject(SCHOOL_INSTANCE_CACHE_UPDATER) private schoolInstanceCacheUpdater: SingleItemCacheUpdater<School>,
    @Inject(SCHOOL_COLLECTION_CACHE) private schoolCollectionCache: MultiItemCache<School>,
  ) {}

  ngOnInit(): void {
    this.userLoginService.checkAuthenticated(this)
  }

  onLogin() {
    if (this.email == null || this.password == null) {
      this.errorMessage = 'All fields are required'
      return
    }
    this.errorMessage = null
    this.userLoginService.login(this.email, this.password, this.remember, this)
  }

  isLoggedIn(message: string, isLoggedIn: boolean): void {
    if (isLoggedIn) {
      this.router.navigate(['/home'])
    }
  }

  cognitoCallback(message: string, result: any): void {
    console.log('Login attempt result', message)
    if (message != null) {
      this.errorMessage = message
      if(message === 'User must set password.') {
        this.router.navigate(['/change-password'])
      }
    } else {
      console.log(`LoginComponent: Cognito callback ${message}, ${result}`)
      if(this.userLoginService.schoolUUID) {
        this.schoolInstanceCacheUpdater.fromId(this.userLoginService.schoolUUID)
          .then(school => console.log('Set school', school))
      } else {
        this.schoolCollectionCache.load()
      }
      this.router.navigate(['/home'])
    }
  }

}
