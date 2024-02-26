/*
 * Copyright 2022-2024 Aion Technology LLC
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

import {Component, Input} from '@angular/core';
import {UserLoginService} from '@implementation/security/user-login.service';
import {MenuStateService} from '@implementation/services/menu-state.service';
import {TableCache} from '@implementation/table-cache/table-cache';

@Component({
  selector: 'ms-list-view-header',
  templateUrl: './list-view-header.component.html',
  styleUrls: ['./list-view-header.component.scss']
})
export class ListViewHeaderComponent {

  @Input() tableCache: TableCache<any>
  @Input() label: String

  constructor(
    public userLoginService: UserLoginService,
    public menuState: MenuStateService,
  ) {}

}
