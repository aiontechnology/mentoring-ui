/*
 * Copyright 2021-2022 Aion Technology LLC
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
import {CommandArray} from '../../../../../implementation/component/menu-registering-component';
import {SchoolWatchingDetailComponent} from '../../../../../implementation/component/school-watching-detail-component';
import {DataSource} from '../../../../../implementation/data/data-source';
import {School} from '../../../../../implementation/models/school/school';
import {SchoolSession} from '../../../../../implementation/models/school/schoolsession';
import {SingleItemCache} from '../../../../../implementation/state-management/single-item-cache';
import {ProgramAdmin} from '../../../../../implementation/models/program-admin/program-admin';
import {PROGRAM_ADMIN_DATA_SOURCE, PROGRAM_ADMIN_INSTANCE_CACHE} from '../../../../../providers/global-program-admin-providers-factory';
import {SCHOOL_INSTANCE_CACHE} from '../../../../../providers/global-school-providers-factory';
import {SCHOOL_SESSION_INSTANCE_CACHE} from '../../../../../providers/global-school-session-providers-factory';
import {PROGRAM_ADMIN_MENU} from '../../../school-manager.module';

@Component({
  selector: 'ms-program-admin-detail',
  templateUrl: './program-admin-detail.component.html',
  styleUrls: ['./program-admin-detail.component.scss']
})
export class ProgramAdminDetailComponent extends SchoolWatchingDetailComponent implements OnInit, OnDestroy {
  constructor(
    // for super
    menuState: MenuStateService,
    @Inject(PROGRAM_ADMIN_MENU) menuCommands: CommandArray,
    route: ActivatedRoute,
    @Inject(SCHOOL_INSTANCE_CACHE) schoolInstanceCache: SingleItemCache<School>,
    @Inject(SCHOOL_SESSION_INSTANCE_CACHE) schoolSessionInstanceCache: SingleItemCache<SchoolSession>,
    // other
    @Inject(PROGRAM_ADMIN_DATA_SOURCE) private programAdminDataSource: DataSource<ProgramAdmin>,
    @Inject(PROGRAM_ADMIN_INSTANCE_CACHE) public programAdminCache: SingleItemCache<ProgramAdmin>,
  ) {
    super(menuState, menuCommands, route, schoolInstanceCache, schoolSessionInstanceCache)
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  protected onSchoolChange(school: School) {
    this.programAdminDataSource.allValues()
      .then(admin => {
        this.programAdminCache.item = admin[0];
      });
  }
}
