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
import {School} from 'src/app/modules/shared/models/school/school';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {NavigationService} from 'src/app/services/navigation.service';
import {UserSessionService} from 'src/app/services/user-session.service';
import {Command} from '../../../../implementation/command/command';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {RouteWatchingService} from '../../../../services/route-watching.service';
import {SCHOOL_DETAIL_MENU, SCHOOL_INSTANCE_CACHE} from '../../school-manager.module';
import {SchoolSessionDialogComponent} from '../school-session-dialog/school-session-dialog.component';
import {setState} from './menu-state-manager';

@Component({
  selector: 'ms-school-detail',
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss'],
  providers: [RouteWatchingService]
})
export class SchoolDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(public userSession: UserSessionService,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private route: ActivatedRoute,
              private routeWatcher: RouteWatchingService,
              private navigation: NavigationService,
              @Inject(SCHOOL_INSTANCE_CACHE) private schoolCache: SingleItemCache<School>,
              @Inject(SCHOOL_DETAIL_MENU) private menuCommands: Command[]) {
  }

  get school() {
    return this.schoolCache.item;
  }

  set school(school: School) {
    this.schoolCache.item = school;
  }

  ngOnInit(): void {
    this.menuState
      .clear()
      .add(this.menuCommands)

    this.route.paramMap
      .subscribe(params => this.onIdChange(params.get('id')))
  }

  ngAfterViewInit(): void {
    this.onIndexChange(0);
  }

  ngOnDestroy(): void {
    this.navigation.clearRoute();
    this.menuState.clear();
  }

  onIdChange(id: string): void {
    this.schoolCache.fromId(id)
      .then(item => console.log('item loaded', item))
  }

  onIndexChange(index: number): void {
    setState(index, this.menuState, this.userSession);
  }

  createNewSession(): void {
    const that = this;
    this.routeWatcher.school
      .then((s: School) => {
        const dialogRef = this.dialog.open(SchoolSessionDialogComponent, {
          width: '700px',
          disableClose: true,
          data: {schoolId: that.routeWatcher.schoolId}
        }).afterClosed().subscribe(schoolSession => s.currentSession = schoolSession);
      });
  }

}

