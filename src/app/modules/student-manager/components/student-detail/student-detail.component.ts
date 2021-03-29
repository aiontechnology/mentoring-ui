/**
 * Copyright 2020 - 2021 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteDialogCommand } from 'src/app/implementation/command/delete-dialog-command';
import { EditDialogCommand } from 'src/app/implementation/command/edit-dialog-command';
import { ConfimationDialogComponent } from 'src/app/modules/shared/components/confimation-dialog/confimation-dialog.component';
import { StudentInbound } from '../../models/student-inbound/student-inbound';
import { StudentRepositoryService } from '../../services/student/student-repository.service';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { StudentDialogComponent } from '../student-dialog/student-dialog.component';
import { Contact } from '../../models/contact/contact';
import { grades } from 'src/app/modules/shared/constants/grades';
import { StudentMentorInbound } from '../../models/student-inbound/student-inbound';
import { Subscription } from 'rxjs';
import { LpgRepositoryService } from '../../services/lpg/lpg-repository.service';

@Component({
  selector: 'ms-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnDestroy {

  private subscriptions$: Subscription;
  private studentId: string;
  private schoolId: string;

  student: StudentInbound;
  studentMentor: StudentMentorInbound;

  studentGrade: string;

  contacts: Contact[];
  parents: Contact[];
  emergencyContact: Contact;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private studentService: StudentRepositoryService,
              private snackBar: MatSnackBar,
              private router: Router,
              private lpgService: LpgRepositoryService) {

    this.subscriptions$ = new Subscription();

    const subscription1$ = this.route.paramMap.subscribe(params => {
      this.schoolId = params.get('schoolId');
      this.studentId = params.get('studentId');
    });

    this.studentService.readOneStudent(this.schoolId, this.studentId);
    const subscription2$ = this.studentService.students.subscribe(() => {

      this.menuState.removeGroup('student');

      this.student = this.studentService.getStudentById(this.studentId);
      this.contacts = this.student?.contacts ? this.student?.contacts : [];
      this.parents = this.contacts.filter(contact => !contact.isEmergencyContact);
      this.emergencyContact = this.contacts.find(contact => contact.isEmergencyContact);
      this.studentGrade = grades.find(grade => grade.value === this.student?.grade.toString())?.valueView;
      this.studentMentor = this.student?.mentor;

      console.log('Adding student detail menus');
      StudentDetailMenuManager.addMenus(this.student,
                                        this.menuState,
                                        this.router,
                                        this.dialog,
                                        this.snackBar,
                                        this.studentService,
                                        this.schoolId);

    });

    this.subscriptions$.add(subscription1$);
    this.subscriptions$.add(subscription2$);

  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
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
                  school: string) {
    menuState.add(new EditDialogCommand(
      'Edit Student',
      'student',
      StudentDialogComponent,
      'Student updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({ schoolId: school, model: student }),
      () => {},
      () => true
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
      '/studentmanager',
      () => 1,
      () => studentService.deleteStudents([student]),
      () => true
    ));
  }

}
