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
import { Router } from '@angular/router';
import { SchoolDialogComponent } from '../components/school-dialog/school-dialog.component';
import { ConfimationDialogComponent } from '../components/confimation-dialog/confimation-dialog.component';
import { School } from '../models/school/school';
import { Command } from './command';

export class NewSchoolDialogCommand extends Command {

    constructor(title: string,
                private router: Router,
                private dialog: MatDialog,
                private snackBar: MatSnackBar) {
        super(title);
    }

    /**
     * Opens a dialog for adding a new school.
     */
    execute(): void {
        const dialogRef = this.dialog.open(SchoolDialogComponent, {
            width: '700px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.openSnackBar(this.snackBar, 'School added', 'Navigate')
                    .onAction().subscribe(() => {
                        console.log('Navigating', result);
                        this.router.navigate(['/', 'schoolmanager', 'schools', result.id]);
                    });
            }
        });
    }

    isEnabled(): boolean {
        return true;
    }

}

export class EditSchoolDialogCommand extends Command {

    constructor(title: string,
                private router: Router,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                private schoolSupplier: () => School,
                private postAction: () => void,
                private determineEnabled: () => boolean) {
        super(title);
        console.log('Constructing EditSchoolDialogCommand', schoolSupplier, postAction);
    }

    /**
     * Opens a dialog for editing an existing school.
     */
    execute(): void {
        const dialogRef = this.dialog.open(SchoolDialogComponent, {
            width: '700px',
            data: { school: this.schoolSupplier() }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.openSnackBar(this.snackBar, 'School updated', '')
                    .onAction().subscribe(() => {
                        this.router.navigate(['/schoolmanager']);
                    });
                this.postAction();
            }
        });
    }

    isEnabled(): boolean {
        return this.determineEnabled();
    }

}

export class RemoveSchoolCommand extends Command {

    constructor(title: string,
                private router: Router,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                private routeTo: string,
                private removeSchool: () => void,
                private postAction: () => void,
                private determineEnabled: () => boolean) {
        super(title);
    }

    execute(): void {
        const dialogRef = this.dialog.open(ConfimationDialogComponent, {
            width: '500px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.removeSchool();
                this.openSnackBar(this.snackBar, 'School(s) removed', '');
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
