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

import { Component } from '@angular/core';
import { MenuStateService } from 'src/app/implementation/services/menu-state.service';

@Component({
  selector: 'ms-school-manager',
  templateUrl: './school-manager.component.html',
  styleUrls: ['./school-manager.component.scss']
})
export class SchoolManagerComponent {

  constructor(private menuState: MenuStateService) {
    this.menuState.title = 'School Manager';
  }

}
