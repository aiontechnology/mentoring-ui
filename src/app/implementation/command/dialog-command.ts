/*
 * Copyright 2022 Aion Technology LLC
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

import {MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {ObjectSupplier} from '../types/types';
import {Command} from './command';
import {DialogManager} from './dialog-manager';

export class DialogCommand<T> extends Command {
  static DialogCommandBuilder = class<T> {
    private dataSupplier: ObjectSupplier
    private snackbarMessage: string

    constructor(
      private dialogManager: DialogManager<T>,
    ) {}

    build(): DialogCommand<T> {
      return new DialogCommand<T>(
        this.dataSupplier,
        this.dialogManager,
        this.snackbarMessage)
    }

    withDataSupplier(dataSupplier: ObjectSupplier) {
      this.dataSupplier = dataSupplier
      return this
    }

    withSnackbarMessage(snackbarMessage: string) {
      this.snackbarMessage = snackbarMessage
      return this
    }
  }

  private constructor(
    private readonly dataSupplier: ObjectSupplier,
    private readonly dialogManager: DialogManager<T>,
    private readonly snackbarMessage: string,
  ) {
    super();
  }

  static builder<T>(
    dialogManager: DialogManager<T>,
  ) {
    return new this.DialogCommandBuilder(dialogManager)
  }

  protected override doExecute(): MatDialogRef<any> {
    this.dialogManager.open(this.snackbarMessage, this.dataSupplier)
    return null;
  }
}
