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

import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserSessionService} from 'src/app/services/user-session.service';
import {SchoolRepositoryService} from 'src/app/modules/shared/services/school/school-repository.service';
import {School} from 'src/app/modules/shared/models/school/school';
import {StudentCacheService} from '../../services/student/student-cache.service';
import {NewDialogCommand} from 'src/app/implementation/command/new-dialog-command';
import {EditDialogCommand} from 'src/app/implementation/command/edit-dialog-command';
import {DeleteDialogCommand} from 'src/app/implementation/command/delete-dialog-command';
import {MenuStateService} from 'src/app/services/menu-state.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfimationDialogComponent} from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import {StudentDialogComponent} from '../student-dialog/student-dialog.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Contact} from '../../models/contact/contact';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Student} from '../../models/student/student';
import {SchoolSession} from 'src/app/modules/shared/models/school/schoolsession';
import {grades} from 'src/app/modules/shared/constants/grades';
import {SchoolSessionRepositoryService} from 'src/app/modules/shared/services/school-session/school-session-repository.service';
import {
  SCHOOL_DATA_SOURCE,
  SCHOOL_SESSION_DATA_SOURCE,
  SCHOOL_SESSION_URI_SUPPLIER,
  STUDENT_DATA_SOURCE,
  STUDENT_URI_SUPPLIER
} from '../../../shared/shared.module';
import {DataSource} from '../../../../implementation/data/data-source';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {RouteWatchingService} from '../../../../services/route-watching.service';

@Component({
  selector: 'ms-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
  providers: [RouteWatchingService]
})
export class StudentListComponent implements OnInit, OnDestroy {

  schools$: Promise<School[]>;
  selectedSchool: School;
  schoolSessions$: Promise<SchoolSession[]>;
  selectedSession: SchoolSession;

  /**
   * Action taken after a dialog is closed: Move
   * to page that displayes the new item.
   * @param newItem Added/edited item that helps the
   * cache service determine which page to jump to.
   */
  private paramSubscription$: Subscription;

  constructor(public studentCacheService: StudentCacheService,
              public userSession: UserSessionService,
              @Inject(SCHOOL_DATA_SOURCE) private schoolDataSource: DataSource<School>,
              @Inject(SCHOOL_SESSION_DATA_SOURCE) private schoolSessionDataSource: DataSource<SchoolSession>,
              @Inject(SCHOOL_SESSION_URI_SUPPLIER) private schoolSessionUriSupplier: UriSupplier,
              @Inject(STUDENT_DATA_SOURCE) private studentDataSource: DataSource<Student>,
              @Inject(STUDENT_URI_SUPPLIER) private studentUriSupplier: UriSupplier,
              private schoolRepository: SchoolRepositoryService,
              private schoolSessionRepository: SchoolSessionRepositoryService,
              private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router,
              private routeWatcher: RouteWatchingService) {
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort !== undefined) {
      this.studentCacheService.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator !== undefined) {
      this.studentCacheService.paginator = paginator;
    }
  }

  get isSchoolSelected(): boolean {
    return (this.routeWatcher.schoolId != null) || this.userSession.isProgAdmin;
  }

  ngOnInit(): void {
    this.routeWatcher.open(this.route)
      .pipe(
        tap(() => this.schools$ = this.schoolDataSource.allValues())
      )
      .subscribe(params => {
        const schoolId = params.get(RouteWatchingService.SCHOOL_ID);
        this.routeWatcher.school
          .then(school => {
            if (school) {
              this.selectedSchool = school ? school : null;
              this.loadSchoolSessions();
              this.loadStudentData();
            }
            return school;
          });
      });
  }

  ngOnDestroy(): void {
    this.menuState.clear();
    this.paramSubscription$?.unsubscribe();
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'firstName', 'teacher', 'preferredTime'];
    } else {
      return ['select', 'firstName', 'lastName', 'studentId', 'grade', 'teacher', 'preferredTime', 'contacts'];
    }
  }

  displayContact(contact: Contact): string {

    const name = contact.firstName + ' ' + contact.lastName;

    let contactInfo = contact.phone ?? '';

    if (contact.email !== null) {
      contactInfo += contactInfo ? ', ' + contact.email : contact.email;
    }

    return name + ': ' + contactInfo;

  }

  isLoading(gettingData: boolean): boolean {
    return gettingData && this.isSchoolSelected;
  }

  studentGrade(student: Student): string {
    return grades[student.grade].valueView;
  }

  updateSession() {
    this.loadStudentData();
  }

  jumpToNewItem(newItem: Student): void {
    this.studentCacheService.clearSelection();
    this.studentCacheService.jumpToItem(newItem);
  }

  private loadSchoolSessions(): void {
    this.schoolSessions$ = this.schoolSessionDataSource.allValues()
      .then(schoolSessions => {
        if (!this.selectedSession) {
          schoolSessions.forEach(schoolSession => {
            if (schoolSession.isCurrent) {
              this.selectedSession = schoolSession;
            }
          });
          return schoolSessions;
        }
      });
  }

  private loadStudentData(): Promise<void> {
    if (this.selectedSession?.id) {
      this.studentUriSupplier.withParameter('session', this.selectedSession?.id);
    }
    this.studentDataSource.reset();
    return this.studentCacheService.loadData()
      .then(() => {
        StudentListMenuManager.addMenus(this.menuState,
          this.router,
          this.dialog,
          this.snackBar,
          (s: Student) => this.jumpToNewItem(s),
          this.studentCacheService,
          this.routeWatcher.schoolId,
          this.selectedSession);
      });
  }

}

class StudentListMenuManager {
  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  postAction: (s: Student) => void,
                  studentCacheService: StudentCacheService,
                  schoolId: string,
                  selectedSession: SchoolSession): void {
    menuState.clear();

    menuState.add(new NewDialogCommand(
      'Add Student',
      'student',
      StudentDialogComponent,
      'Student added',
      ['/', 'studentmanager', 'schools', schoolId, 'students'],
      {schoolId},
      router,
      dialog,
      snackBar,
      (s: Student) => postAction(s),
      () => schoolId != null && selectedSession.isCurrent));
    menuState.add(new EditDialogCommand(
      'Edit Student',
      'student',
      StudentDialogComponent,
      'Student updated',
      ['/', 'studentmanager', 'schools', schoolId, 'students'],
      router,
      dialog,
      snackBar,
      () => ({schoolId, model: studentCacheService.getFirstSelection()}),
      (s: Student) => postAction(s),
      () => studentCacheService.selection.selected.length === 1 && selectedSession.isCurrent));
    menuState.add(new DeleteDialogCommand(
      'Delete Student',
      'student',
      ConfimationDialogComponent,
      'Student(s) removed',
      'student',
      'students',
      router,
      dialog,
      snackBar,
      null,
      () => studentCacheService.selectionCount,
      () => studentCacheService.removeSelected(),
      () => studentCacheService.selection.selected.length > 0 && selectedSession.isCurrent));
  }

}
