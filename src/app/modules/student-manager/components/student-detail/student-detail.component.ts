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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {DeleteDialogCommand} from 'src/app/implementation/command/delete-dialog-command';
import {EditDialogCommand} from 'src/app/implementation/command/edit-dialog-command';
import {ConfimationDialogComponent} from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import {StudentInbound, StudentMentorInbound} from '../../models/student-inbound/student-inbound';
import {StudentRepositoryService} from '../../services/student/student-repository.service';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {StudentDialogComponent} from '../student-dialog/student-dialog.component';
import {Contact} from '../../models/contact/contact';
import {grades} from 'src/app/modules/shared/constants/grades';
import {Subscription} from 'rxjs';
import {LpgRepositoryService} from '../../services/lpg/lpg-repository.service';
import {UserSessionService} from 'src/app/services/user-session.service';
import {NavigationService} from 'src/app/services/navigation.service';
import {SchoolSessionCacheService} from 'src/app/modules/shared/services/school-session/school-session-cache.service';
import {RouteWatchingService} from '../../../../services/route-watching.service';

@Component({
  selector: 'ms-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss'],
  providers: [RouteWatchingService]
})
export class StudentDetailComponent implements OnInit, OnDestroy {

  isHistoric: boolean;
  student: StudentInbound;
  studentMentor: StudentMentorInbound;
  studentGrade: string;
  contacts: Contact[];
  parents: Contact[];
  emergencyContact: Contact;
  private subscriptions$: Subscription;
  private studentId: string;
  private schoolId: string;
  private sessionId: string;

  constructor(public lpgService: LpgRepositoryService,
              private route: ActivatedRoute,
              private routeWatcher: RouteWatchingService,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private studentService: StudentRepositoryService,
              private snackBar: MatSnackBar,
              private router: Router,
              private userSession: UserSessionService,
              private navigation: NavigationService,
              private schoolSessionCacheService: SchoolSessionCacheService) {

    this.subscriptions$ = new Subscription();

    let subscription1$: Subscription;
    if (this.userSession.isSysAdmin) {
      subscription1$ = this.route.paramMap.subscribe(params => {
        this.schoolId = params.get('schoolId');
        // schoolSessionCacheService.establishDatasource(this.schoolId);
        this.studentId = params.get('studentId');
        this.navigation.routeParams = ['/studentmanager', 'schools', this.schoolId];
      });
    } else {
      this.schoolId = this.userSession.schoolUUID;
      // schoolSessionCacheService.establishDatasource(this.schoolId);
      this.navigation.routeParams = ['/studentmanager'];
      subscription1$ = this.route.paramMap.subscribe(params => {
        this.studentId = params.get('studentId');
      });
    }

    const subscription2$ = this.route.queryParamMap.subscribe(params => {
      this.sessionId = params.get('session');
      this.isHistoric = params.get('historic').toLowerCase() === 'true';

      this.studentService.readOneStudent(this.schoolId, this.studentId, this.sessionId);
      const subscription3$ = this.studentService.students.subscribe(student => {

        // this.menuState.removeGroup('student');

        this.student = student[0];
        this.contacts = this.student?.contacts ? this.student?.contacts : [];
        this.parents = this.contacts.filter(contact => !contact.isEmergencyContact);
        this.emergencyContact = this.contacts.find(contact => contact.isEmergencyContact);
        this.studentGrade = grades.find(grade => grade.value === this.student?.grade.toString())?.valueView;
        this.studentMentor = this.student?.mentor;

        // StudentDetailMenuManager.addMenus(this.student,
        //   this.menuState,
        //   this.router,
        //   this.dialog,
        //   this.snackBar,
        //   this.studentService,
        //   this.schoolId,
        //   this.navigation.routeParams.join('/'),
        //   this.isHistoric);
        // this.subscriptions$.add(subscription3$);
      });
    });

    this.subscriptions$.add(subscription1$);
    this.subscriptions$.add(subscription2$);

  }

  get mentorFullName(): string {
    return this.studentMentor ? this.studentMentor?.mentor?.firstName + ' ' + this.studentMentor?.mentor?.lastName : '';
  }

  ngOnInit(): void {
    StudentDetailMenuManager.addMenus(this.student,
      this.menuState,
      this.router,
      this.dialog,
      this.snackBar,
      this.studentService,
      this.schoolId,
      this.navigation.routeParams.join('/'),
      this.isHistoric);

    this.routeWatcher.open(this.route)
      .subscribe(params => {

      });
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
    this.navigation.clearRoute();
    this.menuState.clear();
  }

  getCurrentMonth(): void {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.createLp(month.toString(), year.toString());
  }

  getNextMonth(): void {
    const date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (month === 12) {
      year++;
      month = 1;
    } else {
      month++;
    }

    this.createLp(month.toString(), year.toString());
  }

  createLp(month: string, year: string): void {
    this.lpgService.getLpg(this.schoolId, this.studentId, month, year).subscribe(pdf => {
      const url = window.URL.createObjectURL(pdf);
      window.open(url);
    });
  }

}

class StudentDetailMenuManager {

  static addMenus(student: StudentInbound,
                  menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  studentService: StudentRepositoryService,
                  schoolId: string,
                  routeTo: string,
                  isHistoric: boolean) {
    menuState.add(new EditDialogCommand(
      'Edit Student',
      'student',
      StudentDialogComponent,
      'Student updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({schoolId, model: student}),
      () => {
      },
      () => !isHistoric
    ));
    menuState.add(new DeleteDialogCommand(
      'Remove Student',
      'student',
      ConfimationDialogComponent,
      'Student(s) removed',
      'student',
      'student',
      router,
      dialog,
      snackBar,
      routeTo,
      () => 1,
      () => studentService.deleteStudents([student]),
      () => !isHistoric
    ));
  }

}
