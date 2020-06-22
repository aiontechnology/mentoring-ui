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
import { Command } from '../../../implementation/command';
import { ConfimationDialogComponent } from '../../shared/components/confimation-dialog/confimation-dialog.component';
import { Router } from '@angular/router';
import { ProgramAdminDialogComponent } from '../components/program-admin-dialog/program-admin-dialog.component';

export class AddProgramAdminCommand extends Command {

    constructor(title: string,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                private schoolId: string) {
        super(title);
        this.group = 'program-admin';
    }

    execute(): void {
        const dialogRef = this.dialog.open(ProgramAdminDialogComponent, {
            data: {
              schoolId: this.schoolId
            },
            width: '700px'
          });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.openSnackBar(this.snackBar, 'Program admin added', '')
                .onAction().subscribe(() => {
                  console.error('Cannot navigate to program admin');
                });
            }
          });
         }

    isEnabled(): boolean {
        return true;
    }

}

export class RemoveProgramAdminCommand extends Command {

  isVisible: boolean;

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
    this.group = 'program-admin';
  }

    execute(): void {
      const selectionCount = this.countSupplier();
      const programAdminLabel = selectionCount > 1 ? 'program admins' : 'program admin';
      const message = `Are you sure you want to delete ${ selectionCount } ${ programAdminLabel }?`;
      const dialogRef = this.dialog.open(ConfimationDialogComponent, {
          width: '500px',
          data: {
            message
          }
      });

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.removeTeacher();
              this.openSnackBar(this.snackBar, 'Program admin(s) removed', '');
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
