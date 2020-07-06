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

import { Command } from 'src/app/implementation/command';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookDialogComponent } from '../components/book-dialog/book-dialog.component';
import { Book } from '../models/book/book';

export class NewBookDialogCommand extends Command {

    constructor(title: string,
                private router: Router,
                private dialog: MatDialog,
                private snackBar: MatSnackBar) {
        super(title);
        this.group = 'book';
    }

    execute(): void {
        const dialogRef = this.dialog.open(BookDialogComponent, {
            width: '700px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.openSnackBar(this.snackBar, 'Book added', 'Navigate')
                    .onAction().subscribe(() => {
                        console.log('Navigating', result);
                        this.router.navigate(['/', 'bookmanager', 'books', result.id]);
                    });
            }
        });
    }

    isEnabled(): boolean {
        return true;
    }

}

export class EditBookDialogCommand extends Command {

    constructor(title: string,
                private router: Router,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                private bookSupplier: () => Book,
                private postAction: () => void,
                private determineEnabled: () => boolean) {
        super(title);
        this.group = 'book';
        console.log('Constructing EditSchoolDialogCommand', bookSupplier, postAction);
    }

    /**
     * Opens a dialog for editing an existing school.
     */
    execute(): void {
        const dialogRef = this.dialog.open(BookDialogComponent, {
            width: '700px',
            data: { book: this.bookSupplier() }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.openSnackBar(this.snackBar, 'Book updated', '')
                    .onAction().subscribe(() => {
                        this.router.navigate(['/resourcemanager']);
                    });
                this.postAction();
            }
        });
    }

    isEnabled(): boolean {
        return this.determineEnabled();
    }

}
