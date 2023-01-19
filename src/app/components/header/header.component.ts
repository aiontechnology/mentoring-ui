/*
 * Copyright 2022-2023 Aion Technology LLC
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

import {Component, Inject} from '@angular/core';
import {NavigationService} from '../../implementation/route/navigation.service';
import {UserLoginService} from '../../implementation/security/user-login.service';
import {MenuStateService} from '../../implementation/services/menu-state.service';
import {SingleItemCache} from '../../implementation/state-management/single-item-cache';
import {School} from '../../models/school/school';
import {SCHOOL_INSTANCE_CACHE} from '../../providers/global/global-school-providers-factory';

@Component({
  selector: 'ms-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    public userLoginService: UserLoginService,
    public menuState: MenuStateService,
    public navService: NavigationService,
    @Inject(SCHOOL_INSTANCE_CACHE) public schoolInstanceCache: SingleItemCache<School>,
  ) {}
}
