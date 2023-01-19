/*
 * Copyright 2020-2023 Aion Technology LLC
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

import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {UserLoginService} from '../../implementation/security/user-login.service';
import {LogoutNotificationComponent} from '../user-session/logout-notification/logout-notification.component';

@Component({
  selector: 'ms-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  constructor(
    public userLoginService: UserLoginService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) {
    if (this.userLoginService.isAuthenticated) {
      this.router.navigate(['home']);
    } else {
      route.queryParamMap.pipe(
        map(params => params.get('logout')),
      ).subscribe(logout => {
        if (logout) {
          snackbar.openFromComponent(LogoutNotificationComponent, {
            panelClass: 'logout-snackbar',
            verticalPosition: 'top',
            duration: 5000
          })
        }
      })
    }
  }

}
