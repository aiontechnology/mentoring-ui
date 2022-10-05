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
import {NewEditDialogCommandOld} from './new-edit-dialog-command-old';

export class NewDialogCommandOld<T, C> extends NewEditDialogCommandOld<T> {

  constructor(title: string,
              group: string,
              private componentType: ComponentType<C>,
              snackBarMessage: string,
              navigationBase: string[],
              private data: object,
              router: Router,
              private dialog: MatDialog,
              snackBar: MatSnackBar,
              postAction: (newItem: T) => void,
              private determineEnabled: () => boolean) {
    super(title, group, navigationBase, postAction, router, snackBar, snackBarMessage);
  }

  override isEnabled(): boolean {
    return this.determineEnabled();
  }

  /**
   * Opens a dialog for adding a new school.
   */
  protected override doExecute(): MatDialogRef<any> {
    return this.dialog.open(this.componentType, {
      width: '700px',
      disableClose: true,
      data: this?.data
    });
  }

}
