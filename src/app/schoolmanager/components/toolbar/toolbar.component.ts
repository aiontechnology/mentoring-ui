/**
 * Copyright 2020 Aion Technology LLC
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

import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { SchoolDialogComponent } from '../school-dialog/school-dialog.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SchoolCacheService } from '../../services/school/school-cache.service';
import { ConfimationDialogComponent } from '../confimation-dialog/confimation-dialog.component';

@Component({
  selector: 'ms-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  private DIALOG_WIDTH = '700px';

  @Input() isHandset$: Observable<boolean>;
  @Input() drawer: MatDrawer;

  constructor(private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router,
              private schoolCacheService: SchoolCacheService) { }

  /**
   * Function that lets the toolbar know if it should enable the 'edit' feature.
   * The feature should be enabled when a single school is selected.
   */
  enableEdit() {
    return this.schoolCacheService.selection.selected.length === 1;
  }

  /**
   * Function that lets the toolbar know if it should enable the 'remove' feature.
   * The feature should be enabled when one or more schools are selected.
   */
  enableRemove() {
    return this.schoolCacheService.selection.selected.length > 0;
  }

  /**
   * Opens a dialog for adding a new school.
   */
  openAddSchoolDialog(): void {
    const dialogRef = this.dialog.open(SchoolDialogComponent, {
      width: this.DIALOG_WIDTH
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openSnackBar('School added', '')
          .onAction().subscribe(() => {
            this.router.navigate(['/schoolmanager']);
          });
      }
    });
  }

  /**
   * Opens a dialog for editing an existing school.
   */
  openEditSchoolDialog(): void {
    const school = this.schoolCacheService.selection.selected[0];
    const dialogRef = this.dialog.open(SchoolDialogComponent, {
      width: this.DIALOG_WIDTH,
      data: { school }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.schoolCacheService.selection.clear();
      this.openSnackBar('School updated', '')
        .onAction().subscribe(() => {
          this.router.navigate(['/schoolmanager']);
        });
    });
  }

  /**
   * Opens a snackbar to display the given message.
   * @param message The message to display in the snackbar.
   * @param action The action lable to display.
   */
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  /**
   * remove a one or more schools.
   */
  removeSelectedSchools() {
    const dialogRef = this.dialog.open(ConfimationDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.schoolCacheService.removeSelected();
        this.openSnackBar('Schools removed', '');
      }
    });
  }

}
