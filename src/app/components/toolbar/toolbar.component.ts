/*
 * Copyright 2020-2022 Aion Technology LLC
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

import { Component, Input } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'ms-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  @Input() isHandset$: Observable<boolean>;
  @Input() drawer: MatDrawer;

  constructor(public menuState: MenuStateService,
              public userSession: UserSessionService,
              public navigationService: NavigationService) { }

}
