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

import {MatDialogRef} from '@angular/material/dialog';
import {Command} from './command';
import {DialogManager} from './dialog-manager';

export class DialogCommand<T> extends Command {
  static DialogCommandBuilder = class<T> {
    private isAdminOnly: boolean
    private dataSupplier: () => object
    private snackbarMessage: string

    constructor(private title: string,
                private group: string,
                private dialogManager: DialogManager<T>,
                private isEnabledFunction: () => boolean) {
    }

    build(): DialogCommand<T> {
      return new DialogCommand<T>(
        this.title,
        this.group,
        this.isAdminOnly,
        this.dataSupplier,
        this.dialogManager,
        this.isEnabledFunction,
        this.snackbarMessage)
    }

    withAdminOnly(isAdminOnly: boolean) {
      this.isAdminOnly = isAdminOnly
      return this;
    }

    withDataSupplier(dataSupplier: () => object) {
      this.dataSupplier = dataSupplier
      return this
    }

    withSnackbarMessage(snackbarMessage: string) {
      this.snackbarMessage = snackbarMessage
      return this
    }
  }

  private constructor(title: string,
                      group: string,
                      isAdminOnly: boolean,
                      private readonly dataSupplier: () => object,
                      private readonly dialogManager: DialogManager<T>,
                      private readonly isEnabledFunction: () => boolean,
                      private readonly snackbarMessage: string) {
    super(title, group, isAdminOnly);
  }

  static builder<T>(title: string,
                 group: string,
                 dialogManager: DialogManager<T>,
                 isEnabledFunction: () => boolean) {
    return new this.DialogCommandBuilder(title, group, dialogManager, isEnabledFunction)
  }

  override get isEnabled(): boolean {
    return this.isEnabledFunction() && super.isEnabled
  }


  protected override doExecute(): MatDialogRef<any> {
    this.dialogManager.open(this.snackbarMessage, this.dataSupplier)
    return null;
  }
}

