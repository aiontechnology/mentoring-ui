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
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {DeleteDialogCommand} from 'src/app/implementation/command/delete-dialog-command';
import {EditDialogCommand} from 'src/app/implementation/command/edit-dialog-command';
import {ConfimationDialogComponent} from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import {School} from 'src/app/modules/shared/models/school/school';
import {SchoolRepositoryService} from 'src/app/modules/shared/services/school/school-repository.service';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {SchoolDialogComponent} from '../school-dialog/school-dialog.component';
import {UserSessionService} from 'src/app/services/user-session.service';
import {NavigationService} from 'src/app/services/navigation.service';
import {SchoolSessionDialogComponent} from '../school-session-dialog/school-session-dialog.component';
import {RouteWatchingService} from '../../../../services/route-watching.service';
import {SCHOOL_DATA_SOURCE} from '../../../shared/shared.module';
import {DataSource} from '../../../../implementation/data/data-source';

@Component({
  selector: 'ms-school-detail',
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss'],
  providers: [RouteWatchingService]
})
export class SchoolDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  school: School;

  constructor(public userSession: UserSessionService,
              @Inject(SCHOOL_DATA_SOURCE) private schoolDataSource: DataSource<School>,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private schoolService: SchoolRepositoryService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router,
              private routeWatcher: RouteWatchingService,
              private navigation: NavigationService) {
  }

  get schoolId() {
    return this.routeWatcher.schoolId;
  }

  ngOnInit(): void {
    this.routeWatcher.open(this.route)
      .subscribe(params => {
        this.menuState.removeGroup('school');
        if (this.userSession.isSysAdmin) {
          this.routeWatcher.school
            .then(school => {
                this.school = school;
                this.menuState.add(editDialogCommandFactory(school, this.router, this.dialog, this.snackBar));
                this.menuState.add(deleteDialogCommandFactory(school, this.schoolService, this.router, this.dialog, this.snackBar));
              }
            );
        }
      });
  }

  ngAfterViewInit(): void {
    this.onIndexChange(0);
  }

  ngOnDestroy(): void {
    this.navigation.clearRoute();
    this.menuState.clear();
  }

  onIndexChange(index: number): void {
    this.menuState.makeAllVisible();
    if (this.userSession.isSysAdmin) {
      switch (index) {
        case 0:
          this.menuState.makeGroupInvisible('teacher');
          this.menuState.makeGroupInvisible('program-admin');
          this.menuState.makeGroupInvisible('personnel');
          this.menuState.makeGroupInvisible('school-book');
          this.menuState.makeGroupInvisible('school-game');
          break;
        case 1:
          this.menuState.makeGroupInvisible('school');
          this.menuState.makeGroupInvisible('teacher');
          this.menuState.makeGroupInvisible('personnel');
          this.menuState.makeGroupInvisible('school-book');
          this.menuState.makeGroupInvisible('school-game');
          break;
        case 2:
          this.menuState.makeGroupInvisible('school');
          this.menuState.makeGroupInvisible('program-admin');
          this.menuState.makeGroupInvisible('personnel');
          this.menuState.makeGroupInvisible('school-book');
          this.menuState.makeGroupInvisible('school-game');
          break;
        case 3:
          this.menuState.makeGroupInvisible('school');
          this.menuState.makeGroupInvisible('program-admin');
          this.menuState.makeGroupInvisible('teacher');
          this.menuState.makeGroupInvisible('school-book');
          this.menuState.makeGroupInvisible('school-game');
          break;
        case 4:
          this.menuState.makeGroupInvisible('school');
          this.menuState.makeGroupInvisible('program-admin');
          this.menuState.makeGroupInvisible('personnel');
          this.menuState.makeGroupInvisible('teacher');
          this.menuState.makeGroupInvisible('school-game');
          break;
        case 5:
          this.menuState.makeGroupInvisible('school');
          this.menuState.makeGroupInvisible('program-admin');
          this.menuState.makeGroupInvisible('personnel');
          this.menuState.makeGroupInvisible('teacher');
          this.menuState.makeGroupInvisible('school-book');
          break;
      }
    } else {
      switch (index) {
        case 0:
          this.menuState.makeGroupInvisible('teacher');
          this.menuState.makeGroupInvisible('program-admin');
          this.menuState.makeGroupInvisible('personnel');
          this.menuState.makeGroupInvisible('school-book');
          this.menuState.makeGroupInvisible('school-game');
          break;
        case 1:
          this.menuState.makeGroupInvisible('personnel');
          this.menuState.makeGroupInvisible('school-book');
          this.menuState.makeGroupInvisible('school-game');
          break;
        case 2:
          this.menuState.makeGroupInvisible('teacher');
          this.menuState.makeGroupInvisible('school-book');
          this.menuState.makeGroupInvisible('school-game');
          break;
        case 3:
          this.menuState.makeGroupInvisible('teacher');
          this.menuState.makeGroupInvisible('personnel');
          this.menuState.makeGroupInvisible('school-game');
          break;
        case 4:
          this.menuState.makeGroupInvisible('teacher');
          this.menuState.makeGroupInvisible('personnel');
          this.menuState.makeGroupInvisible('school-book');
          break;
      }
    }
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

const editDialogCommandFactory = (school: School, router: Router, dialog: MatDialog, snackBar: MatSnackBar): EditDialogCommand<School> =>
  new EditDialogCommand<School>(
    'Edit School',
    'school',
    SchoolDialogComponent,
    'School updated',
    null,
    router,
    dialog,
    snackBar,
    () => ({model: school}),
    () => {
    },
    () => true);

const deleteDialogCommandFactory = (school: School, schoolService: SchoolRepositoryService, router: Router, dialog: MatDialog,
                                    snackBar: MatSnackBar): DeleteDialogCommand<School> =>
  new DeleteDialogCommand(
    'Remove School',
    'school',
    ConfimationDialogComponent,
    'School(s) removed',
    'school',
    'schools',
    router,
    dialog,
    snackBar,
    '/schoolsmanager',
    () => 1,
    () => schoolService.deleteSchools([school]),
    () => true);
