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

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {Command} from '../../../../../implementation/command/command';
import {DetailComponent} from '../../../../../implementation/component/detail-component';
import {CommandArray} from '../../../../../implementation/component/menu-registering-component';
import {School} from '../../../../../implementation/models/school/school';
import {NavigationService} from '../../../../../implementation/route/navigation.service';
import {SingleItemCache} from '../../../../../implementation/state-management/single-item-cache';
import {SCHOOL_INSTANCE_CACHE} from '../../../../../providers/global-school-providers-factory';
import {SCHOOL_DETAIL_MENU} from '../../../school-manager.module';

@Component({
  selector: 'ms-school-detail',
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent extends DetailComponent implements OnInit, OnDestroy {
  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(SCHOOL_DETAIL_MENU) menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    route: ActivatedRoute,
    navService: NavigationService,
    // other
    @Inject(SCHOOL_INSTANCE_CACHE) public schoolInstanceCache: SingleItemCache<School>,
  ) {
    super(menuState, menuCommands, route, navService)
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected doHandleBackButton = (navService: NavigationService): void =>
    navService.push({routeSpec: ['/schoolsmanager'], fragment: undefined})

  protected override registerMenus(menuState: MenuStateService, menuCommands: CommandArray) {
    menuCommands.forEach(command => {
      menuState.add(command.factory(true))
    })
  }

}

