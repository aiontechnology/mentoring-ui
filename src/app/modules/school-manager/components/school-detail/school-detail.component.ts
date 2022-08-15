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

import {Component, AfterViewInit, OnDestroy} from '@angular/core';
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
import {Subscription} from 'rxjs';
import {UserSessionService} from 'src/app/services/user-session.service';
import {NavigationService} from 'src/app/services/navigation.service';
import {SchoolSessionDialogComponent} from '../school-session-dialog/school-session-dialog.component';

@Component({
  selector: 'ms-school-detail',
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent implements AfterViewInit, OnDestroy {

  private subscriptions$: Subscription;

  school: School;
  schoolId: string;

  constructor(route: ActivatedRoute,
              public userSession: UserSessionService,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private schoolService: SchoolRepositoryService,
              private snackBar: MatSnackBar,
              private router: Router,
              private navigation: NavigationService) {

    this.subscriptions$ = new Subscription();

    const subscription1$ = route.paramMap.subscribe(
      params => {
        this.schoolId = params.get('id');
      }
    );

    if (userSession.isSysAdmin) {
      this.schoolService.readAllSchools();
      this.navigation.routeParams = ['schoolsmanager'];
    } else {
      this.schoolService.readOneSchool(this.schoolId);
    }

    const subscription2$ = this.schoolService.schools.subscribe(() => {
      this.menuState.removeGroup('school');
      this.school = this.schoolService.getSchoolById(this.schoolId);
      if (userSession.isSysAdmin) {
        console.log('Adding school detail menus');
        SchoolDetailMenuManager.addMenus(this.school, this.menuState, this.router, this.dialog, this.snackBar, this.schoolService);
      }
    });

    this.subscriptions$.add(subscription1$);
    this.subscriptions$.add(subscription2$);

  }

  ngAfterViewInit(): void {
    this.onIndexChange(0);
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
    this.navigation.clearRoute();
    this.menuState.clear();
  }

  onIndexChange(index: number): void {
    console.log('Tab change', index, this.menuState.activeMenus);
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

  createNewSession() {
    const dialogRef = this.dialog.open(SchoolSessionDialogComponent, {
      width: '700px',
      disableClose: true,
      data: {schoolId: this.school.id}
    }).afterClosed().subscribe(schoolSession => this.school.currentSession = schoolSession);
  }

}

class SchoolDetailMenuManager {

  static addMenus(school: School,
                  menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  schoolService: SchoolRepositoryService) {
    menuState.add(new EditDialogCommand(
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
      () => true));
    menuState.add(new DeleteDialogCommand(
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
      () => true));
  }

}
