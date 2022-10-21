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

import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {School} from 'src/app/implementation/models/school/school';
import {NavigationService} from 'src/app/implementation/route/navigation.service';
import {MenuStateService} from 'src/app/implementation/services/menu-state.service';
import {UserSessionService} from 'src/app/implementation/services/user-session.service';
import {Command} from '../../../../implementation/command/command';
import {AbstractDetailComponent} from '../../../../implementation/component/abstract-detail-component';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {SchoolRouteWatcher} from '../../../../implementation/route/school-route-watcher';
import {SCHOOL_INSTANCE_CACHE, SCHOOL_ROUTE_WATCHER} from '../../../../providers/global-school-providers-factory';
import {SCHOOL_DETAIL_MENU} from '../../school-manager.module';
import {SchoolSessionDialogComponent} from '../school-session-dialog/school-session-dialog.component';
import {setState} from './menu-state-manager';

@Component({
  selector: 'ms-school-detail',
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent extends AbstractDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    // public
    public userSession: UserSessionService,
    // for super
    menuState: MenuStateService,
    @Inject(SCHOOL_DETAIL_MENU) menuCommands: { name: string, factory: (isAdminOnly: boolean) => Command }[],
    route: ActivatedRoute,
    @Inject(SCHOOL_ROUTE_WATCHER) schoolRouteWatcher: SchoolRouteWatcher,
    // other
    private dialog: MatDialog,
    private navigation: NavigationService,
    @Inject(SCHOOL_INSTANCE_CACHE) public schoolCache: SingleItemCache<School>,
  ) {
    super(menuState, menuCommands, route, schoolRouteWatcher)
  }

  ngOnInit(): void {
    this.init()
  }

  ngAfterViewInit(): void {
    this.onTabChange(0);
  }

  ngOnDestroy(): void {
    this.destroy()
    this.navigation.clearRoute();
  }

  createNewSession(): void {
    const that = this;
    const school = this.schoolCache.item
    const dialogRef = this.dialog.open(SchoolSessionDialogComponent, {
      width: '700px',
      disableClose: true,
      data: {schoolId: that.schoolCache.item.id}
    }).afterClosed().subscribe(schoolSession => school.currentSession = schoolSession);
  }

  protected override doTabChange(index: number, menuState: MenuStateService) {
    setState(index, menuState, this.userSession);
  }

  protected registerMenus(menuState: MenuStateService, menuCommands: { name: string; factory: (isAdminOnly: boolean) => Command }[]) {
    menuCommands.forEach(command => {
      switch (command.name) {
        case 'delete':
          menuState.add(command.factory(true))
          break
        default:
          menuState.add(command.factory(false))
          break;
      }
    })
  }

}

