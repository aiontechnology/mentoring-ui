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

import { Command } from './command';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentType } from '@angular/cdk/portal';

export class EditDialogCommand<T, S> extends Command {

  constructor(title: string,
              group: string,
              private componentType: ComponentType<T>,
              private snackBarMessage: string,
              private navigationBase: string[],
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private dataSupplier: () => object,
              private postAction: (newItem: S) => void,
              private determineEnabled: () => boolean) {
    super(title, group);
    console.log('Constructing EditDialogCommand', dataSupplier, postAction);
  }

  /**
   * Opens a dialog for editing an existing school.
   */
  execute(): void {
    const dialogRef = this.dialog.open(this.componentType, {
      width: '700px',
      disableClose: true,
      data: this.dataSupplier()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.navigationBase) {
          this.openSnackBar(this.snackBar, this.snackBarMessage, 'Navigate')
            .onAction().subscribe(() => {
              this.router.navigate([...this.navigationBase, result.id]);
            });
        }
        this.openSnackBar(this.snackBar, this.snackBarMessage, '');
        this.postAction(result);
      }
    });
  }

  isEnabled(): boolean {
    return this.determineEnabled();
  }

}
