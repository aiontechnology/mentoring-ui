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

import { AfterViewInit, Component } from '@angular/core';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'ms-handle-logout',
  templateUrl: './handle-logout.component.html',
  styleUrls: ['./handle-logout.component.scss']
})
export class HandleLogoutComponent implements AfterViewInit {

  constructor(private userSession: UserSessionService) { }

  ngAfterViewInit(): void {
    this.userSession.handleLogout();
  }

}
