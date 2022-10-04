/*
 * Copyright 2020-2022 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {ComponentType} from '@angular/cdk/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Command} from './command';

export class DeleteDialogCommand<T> extends Command {

  constructor(title: string,
              group: string,
              private componentType: ComponentType<any>,
              private snackBarMessage: string,
              private singularName: string,
              private pluralName: string,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private routeTo: string,
              private countSupplier: () => number,
              private removeItem: () => Promise<void | T[]>,
              private determineEnabled: () => boolean,
              private postAction?: (item?: T) => void) {
    super(title, group);
  }

  private get message(): string {
    const selectionCount = this.countSupplier();
    const bookLabel = selectionCount > 1 ? this.pluralName : this.singularName;
    return `Are you sure you want to delete ${selectionCount} ${bookLabel}?`;
  }

  override isEnabled(): boolean {
    return this.determineEnabled();
  }

  protected override doExecute(): MatDialogRef<any> {
    return this.dialog.open(this.componentType, {
      width: '500px',
      disableClose: true,
      data: {
        message: this.message
      }
    });
  }

  protected override doPostExecute(dialog: MatDialogRef<any>) {
    dialog.afterClosed().subscribe(result => {
      this.removeItem().then(() => {
        this.openSnackBar(this.snackBar, this.snackBarMessage, '');
        if (this.routeTo) {
          this.router.navigate([this.routeTo]);
        }
        this?.postAction();
      });
    });
  }

}
