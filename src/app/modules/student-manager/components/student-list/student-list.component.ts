/**
 * Copyright 2020 - 2021 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { UserSessionService } from 'src/app/services/user-session.service';
import { SchoolRepositoryService } from 'src/app/modules/shared/services/school/school-repository.service';
import { School } from 'src/app/modules/shared/models/school/school';
import { StudentCacheService } from '../../services/student/student-cache.service';
import { NewDialogCommand } from 'src/app/implementation/command/new-dialog-command';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';
import { DeleteDialogCommand } from 'src/app/implementation/command/delete-dialog-command';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfimationDialogComponent } from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import { StudentDialogComponent } from '../student-dialog/student-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Contact } from '../../models/contact/contact';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LoggingService } from 'src/app/modules/shared/services/logging-service/logging.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Student } from '../../models/student/student';

@Component({
  selector: 'ms-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
  providers: [StudentCacheService]
})
export class StudentListComponent implements OnInit, OnDestroy {

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

  schools$: Observable<School[]>;
  schoolId: string;

  constructor(public userSession: UserSessionService,
              public studentCacheService: StudentCacheService,
              private schoolRepository: SchoolRepositoryService,
              private logger: LoggingService,
              private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar) {
    console.log('student list constructed');
  }

  ngOnInit(): void {
    if (this.userSession.isSysAdmin) {
      this.schoolRepository.readAllSchools();
      this.schools$ = this.schoolRepository.schools.pipe(
        tap(s => this.logger.log('Read schools', s))
      );
    } else if (this.userSession.isProgAdmin) {
      this.schoolId = this.userSession.schoolUUID;
      this.loadStudentData();
    }
  }

  ngOnDestroy(): void {
    this.menuState.clear();
  }

  get isSchoolSelected(): boolean {
    return (this.schoolId !== undefined) || this.userSession.isProgAdmin;
  }

  setSchool(id$: string) {
    this.schoolId = id$;
    this.loadStudentData();
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'firstName', 'teacher', 'preferredTime'];
    } else {
      return ['select', 'firstName', 'lastName', 'teacher', 'preferredTime', 'contacts'];
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

  private loadStudentData(): void {

    this.studentCacheService.establishDatasource(this.schoolId);

    console.log('Adding student list menus');
    StudentListMenuManager.addMenus(this.menuState,
                                    this.router,
                                    this.dialog,
                                    this.snackBar,
                                    (s: Student) => this.jumpToNewItem(s),
                                    this.studentCacheService,
                                    this.schoolId);

  }

  /**
   * Action taken after a dialog is closed: Move
   * to page that displayes the new item.
   * @param newItem Added/edited item that helps the
   * cache service determine which page to jump to.
   */
  private jumpToNewItem(newItem: Student): void {
    this.studentCacheService.clearSelection();
    this.studentCacheService.jumpToItem(newItem);
  }

}

class StudentListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  postAction: (s: Student) => void,
                  studentCacheService: StudentCacheService,
                  schoolId: string): void {

    console.log('Constructing MenuHandler');
    menuState.clear();

    menuState.add(new NewDialogCommand(
      'Create New Student',
      'student',
      StudentDialogComponent,
      'Student added',
      ['/', 'studentmanager', 'schools', schoolId, 'students'],
      { schoolId },
      router,
      dialog,
      snackBar,
      (s: Student) => postAction(s),
      () => schoolId != null));
    menuState.add(new EditDialogCommand(
      'Edit Student',
      'student',
      StudentDialogComponent,
      'Student updated',
      ['/', 'studentmanager', 'schools', schoolId, 'students'],
      router,
      dialog,
      snackBar,
      () => ({ schoolId, model: studentCacheService.getFirstSelection() }),
      (s: Student) => postAction(s),
      () => studentCacheService.selection.selected.length === 1));
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
      () => studentCacheService.selection.selected.length > 0));

  }

}
