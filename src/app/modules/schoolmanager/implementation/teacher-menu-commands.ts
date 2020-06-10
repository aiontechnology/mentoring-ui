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

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeacherDialogComponent } from '../components/teacher-dialog/teacher-dialog.component';
import { Command } from '../../../implementation/command';
import { ConfimationDialogComponent } from '../../shared/components/confimation-dialog/confimation-dialog.component';
import { Router } from '@angular/router';

export class AddTeacherCommand extends Command {

    constructor(title: string,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                private schoolId: string) {
        super(title);
        this.group = 'teacher';
    }

    execute(): void {
        const dialogRef = this.dialog.open(TeacherDialogComponent, {
            data: {
              schoolId: this.schoolId
            },
            width: '700px'
          });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.openSnackBar(this.snackBar, 'Teacher added', '')
                .onAction().subscribe(() => {
                  console.error('Cannot navigate to teacher');
                });
            }
          });
         }

    isEnabled(): boolean {
        return true;
    }

}

export class RemoveTeacherCommand extends Command {

  constructor(title: string,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private routeTo: string,
              private countSupplier: () => number,
              private removeTeacher: () => void,
              private postAction: () => void,
              private determineEnabled: () => boolean) {
    super(title);
    this.group = 'teacher';
  }

    execute(): void {
      const selectionCount = this.countSupplier();
      const teacherLabel = selectionCount > 1 ? 'teachers' : 'teacher';
      const message = `Are you sure you want to delete ${ selectionCount } ${ teacherLabel }?`;
      const dialogRef = this.dialog.open(ConfimationDialogComponent, {
          width: '500px',
          data: {
            message
          }
      });

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.removeTeacher();
              this.openSnackBar(this.snackBar, 'Teacher(s) removed', '');
              if (this.routeTo) {
                  this.router.navigate([this.routeTo]);
              }
              this.postAction();
          }
      });
  }

  isEnabled(): boolean {
      return this.determineEnabled();
  }

}
