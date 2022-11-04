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

import {ComponentType} from '@angular/cdk/portal';
import {MatDialog} from '@angular/material/dialog';

export class DialogManager<T> {
  static DialogManagerBuilder = class<T> {
    private afterCloseFunction: (string) => (any) => void;
    private config: object;

    constructor(private dialog: MatDialog,
                private componentType: ComponentType<T>) {
    }

    build(): DialogManager<T> {
      return new DialogManager(
        this.dialog,
        this.componentType,
        this.afterCloseFunction,
        this.config
      )
    }

    withAfterCloseFunction(afterCloseFunction: (s: string) => (a: any) => void) {
      this.afterCloseFunction = afterCloseFunction
      return this
    }

    withConfig(config: object) {
      this.config = config
      return this
    }
  }

  private constructor(private dialog: MatDialog,
                      private readonly componentType: ComponentType<T>,
                      private readonly afterCloseFunction: (string) => (any) => void,
                      private readonly config: object = {width: '700px', disableClose: true}) {
  }

  static builder<T>(dialog: MatDialog,
                    componentType: ComponentType<T>) {
    return new this.DialogManagerBuilder(dialog, componentType)
  }

  open(snackbarMessage: string, dataSupplier?: () => object) {
    this.config['data'] = dataSupplier?.call(undefined)
    this.dialog.open(this.componentType, this.config)
      .afterClosed()
      .subscribe(this.afterCloseFunction(snackbarMessage));
  }
}
