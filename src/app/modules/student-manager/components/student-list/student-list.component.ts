/**
 * Copyright 2020 Aion Technology LLC
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

import { Component, Input, OnChanges } from '@angular/core';
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

@Component({
  selector: 'ms-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnChanges {

  @Input() school: School;

  constructor(private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private menuState: MenuStateService,
              private router: Router,
              private snackBar: MatSnackBar,
              public studentCacheService: StudentCacheService) {
  }

  ngOnChanges(): void {
    if (this.school !== undefined && this.school !== null) {
      this.studentCacheService.establishDatasource(this.school.id);
    }

    this.menuState.clear();
    console.log('Adding student list menus');
    StudentListMenuManager.addMenus(this.menuState, this.router, this.dialog, this.snackBar, this.studentCacheService, this.school?.id);
  }

  displayedColumns(): string[] {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      return ['select', 'firstName', 'teacher', 'preferredTime'];
    } else {
      return ['select', 'firstName', 'lastName', 'teacher', 'preferredTime', 'contacts'];
    }
  }

  displayContact(contact: Contact): string {
    
    let name = contact.firstName + ' ' + contact.lastName;
    let contactInfo = '';

    if (contact.cellPhone) {
      contactInfo = contact.cellPhone;
    } else if (contact.workPhone) {
      contactInfo = contact.workPhone;
    }

    if (contact.email) {
      contactInfo += contactInfo ? ', ' + contact.email : contact.email;
    }

    return name + ': ' + contactInfo;

  }

}

class StudentListMenuManager {

  static addMenus(menuState: MenuStateService,
                  router: Router,
                  dialog: MatDialog,
                  snackBar: MatSnackBar,
                  studentCacheService: StudentCacheService,
                  schoolId: string) { 
    console.log('Constructing MenuHandler');
    menuState.add(new NewDialogCommand(
      'Create New Student',
      'student',
      StudentDialogComponent,
      'Student added',
      null,
      { schoolId },
      router,
      dialog,
      snackBar,
      () => schoolId != null));
    menuState.add(new EditDialogCommand(
      'Edit Student',
      'student',
      StudentDialogComponent,
      'Student updated',
      null,
      router,
      dialog,
      snackBar,
      () => ({ schoolId: schoolId, model: studentCacheService.getFirstSelection() }),
      () => studentCacheService.clearSelection(),
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
      () => { },
      () => studentCacheService.selection.selected.length > 0));
  }

}
