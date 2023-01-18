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

import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {DataSource} from '../data/data-source';
import {DialogActions} from './dialog-actions';

export abstract class DialogComponent<T extends { links: any }, COMPONENT> implements DialogActions{
  modelFormGroup: FormGroup

  protected constructor(
    private model: T,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<COMPONENT>,
    private dataSource: DataSource<T>
  ) {}

  get isUpdate(): boolean {
    return this.model !== undefined && this.model !== null
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    const item: T = this.toModel(this.modelFormGroup.value)
    const value: Promise<T> = this.isUpdate
      ? this.dataSource.update(item)
      : this.dataSource.add(item)
    value
      .then(result => {
        this.dialogRef.close(result)
        return result
      })
      .then(result => this.postDialogClose(result))
  }

  protected init() {
    this.modelFormGroup = this.createFormGroup(this.formBuilder, this.model)
  }

  protected postDialogClose(item: T) {
    // do nothing
  }

  protected abstract toModel(formValue: any): T

  protected abstract doCreateFormGroup(formBuilder: FormBuilder, model: T): FormGroup

  protected abstract doUpdateFormGroup(formGroup: FormGroup, model: T): void

  private createFormGroup(formBuilder: FormBuilder, model: T) {
    const formGroup = this.doCreateFormGroup(formBuilder, model)
    if (this.isUpdate) {
      this.doUpdateFormGroup(formGroup, model)
    }
    return formGroup
  }

}
