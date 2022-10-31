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

import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';

export abstract class Command {

  isVisible = true;
  private _disableFunction = () => false;

  protected constructor(public title: string,
                        public group: string,
                        public isAdminOnly) {
  }

  execute(): void {
    this.doPreExecute();
    const dialog = this.doExecute();
    this.doPostExecute(dialog);
  }

  set disableFunction(disableFunction: () => boolean) {
    this._disableFunction = disableFunction
  }

  get isEnabled(): boolean {
    return !this._disableFunction()
  }

  protected doPreExecute(): void {
  }

  protected abstract doExecute(): MatDialogRef<any>;

  protected doPostExecute(dialog: MatDialogRef<any>): void {
  }
}

