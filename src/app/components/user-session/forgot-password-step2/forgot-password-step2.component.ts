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
import {MatLegacySnackBar as MatSnackBar, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition} from '@angular/material/legacy-snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {CognitoCallback} from '../../../implementation/security/cognito.service';
import {UserLoginService} from '../../../implementation/security/user-login.service';

@Component({
  selector: 'ms-forgot-password-step2',
  templateUrl: './forgot-password-step2.component.html',
  styleUrls: ['./forgot-password-step2.component.scss']
})
export class ForgotPasswordStep2Component implements CognitoCallback, OnInit {
  email: string
  password: string
  verificationCode: string
  errorMessage: string

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userLoginService: UserLoginService,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.email = params['email']
    })
  }

  onNext() {
    this.userLoginService.confirmNewPassword(this.email, this.password, this.verificationCode, this)
  }

  cognitoCallback(message: string, result: any): void {
    if (message != null) {
      this.errorMessage = message
    } else {

      this.router.navigate(['/login'])
        .then(() => this.snackbar.open('Password Successfully Changed \u2713. Please login.', '',
          {
            panelClass: 'normal-snackbar',
            verticalPosition: 'top' as MatSnackBarVerticalPosition,
            duration: 5000,
          }))
    }
  }

}
