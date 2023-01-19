/*
 * Copyright 2022-2023 Aion Technology LLC
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
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ClosedResultType} from '../types/dialog-types';

export class DialogManager<T> {
  static DialogManagerBuilder = class<T> {
    private afterCloseFunction: ClosedResultType;
    private config: any;

    constructor(
      private dialog: MatDialog,
      private componentType: ComponentType<T>,
    ) {}

    build(): DialogManager<T> {
      return new DialogManager(
        this.dialog,
        this.componentType,
        this.afterCloseFunction,
        this.config
      )
    }

    withAfterCloseFunction(afterCloseFunction: ClosedResultType) {
      this.afterCloseFunction = afterCloseFunction
      return this
    }

    withConfig(config: any) {
      this.config = config
      return this
    }
  }

  private constructor(
    private dialog: MatDialog,
    private readonly componentType: ComponentType<T>,
    private readonly afterCloseFunction: ClosedResultType,
    private readonly config: MatDialogConfig = {
      width: '649px',
      maxHeight: '90vh',
    },
  ) {}

  static builder<T>(
    dialog: MatDialog,
    componentType: ComponentType<T>,
  ) {
    return new this.DialogManagerBuilder(dialog, componentType)
  }

  open(snackbarMessage: string, dataSupplier?: () => object) {
    this.config.data = dataSupplier?.call(undefined)
    this.dialog.open(this.componentType, this.config)
      .afterClosed()
      .subscribe(result => {
        this.afterCloseFunction(snackbarMessage)(result)
        if(this.config?.data?.reloadCacheFunction) {
          this.config.data.reloadCacheFunction(result)
        }
      });
  }
}
