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
import {ObjectSupplier} from '../types/types';
import {DialogManager} from './dialog-manager';
import {MenuCommand} from './menu-command';

export class MenuDialogCommand<T> extends MenuCommand {
  static DialogMenuCommandBuilder = class<T> {
    private isAdminOnly: boolean
    private dataSupplier: ObjectSupplier
    private snackbarMessage: string

    constructor(
      private title: string,
      private group: string,
      private dialogManager: DialogManager<T>,
    ) {}

    build(): MenuDialogCommand<T> {
      return new MenuDialogCommand<T>(
        this.title,
        this.group,
        this.isAdminOnly,
        this.dataSupplier,
        this.dialogManager,
        this.snackbarMessage)
    }

    withAdminOnly(isAdminOnly: boolean) {
      this.isAdminOnly = isAdminOnly
      return this;
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
    title: string,
    group: string,
    isAdminOnly: boolean,
    private readonly dataSupplier: ObjectSupplier,
    private readonly dialogManager: DialogManager<T>,
    private readonly snackbarMessage: string,
  ) {
    super(title, group, isAdminOnly);
  }

  static builder<T>(
    title: string,
    group: string,
    dialogManager: DialogManager<T>,
  ) {
    return new this.DialogMenuCommandBuilder(title, group, dialogManager)
  }

  protected override doExecute(): MatDialogRef<any> {
    this.dialogManager.open(this.snackbarMessage, this.dataSupplier)
    return null;
  }
}

