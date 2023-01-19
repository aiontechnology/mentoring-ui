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

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CognitoCallback} from '../../../implementation/security/cognito.service';
import {LoggedInCallback, UserLoginService} from '../../../implementation/security/user-login.service';
import {UserRegistrationService} from '../../../implementation/security/user-registration.service';

export class NewPasswordUser {
  username: string;
  existingPassword: string;
  password: string;
}

@Component({
  selector: 'ms-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements LoggedInCallback, CognitoCallback, OnInit {
  registrationUser: NewPasswordUser = new NewPasswordUser()

  constructor(
    private userRegistrationService: UserRegistrationService,
    private userLoginService: UserLoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userLoginService.checkAuthenticated(this)
  }

  onChangePassword() {
    this.userRegistrationService.newPassword(this.registrationUser, this)
  }

  cognitoCallback(message: string, result: any): void {
    if (message != null) {
      console.error('Error changing password', message)
    } else {
      this.router.navigate(['/home'])
    }
  }

  isLoggedIn(message: string, loggedIn: boolean): void {
    if (loggedIn) {
      this.router.navigate(['/home'])
    }
  }
}
