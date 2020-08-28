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

import { Command } from './command';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentType } from '@angular/cdk/portal';

export class DeleteDialogCommand<T> extends Command {

    constructor(title: string,
                group: string,
                private componentType: ComponentType<T>,
                private snackBarMessage: string,
                private singularName: string,
                private pluralName: string,
                private router: Router,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                private routeTo: string,
                private countSupplier: () => number,
                private removeBook: () => void,
                private postAction: () => void,
                private determineEnabled: () => boolean) {
        super(title, group);
    }

    execute(): void {
        const dialogRef = this.dialog.open(this.componentType, {
            width: '500px',
            data: {
                message: this.message
              }
            });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.removeBook();
                this.openSnackBar(this.snackBar, this.snackBarMessage, '');
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

    private get message(): string {
        const selectionCount = this.countSupplier();
        const bookLabel = selectionCount > 1 ? this.pluralName : this.singularName;
        return `Are you sure you want to delete ${ selectionCount } ${ bookLabel }?`;
    }

}
