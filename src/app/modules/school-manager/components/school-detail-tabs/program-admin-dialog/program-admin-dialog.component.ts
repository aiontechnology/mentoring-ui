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

import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '../../../../../implementation/component/dialog-component';
import {DataSource} from '../../../../../implementation/data/data-source';
import {ProgramAdmin} from '../../../../../implementation/models/program-admin/program-admin';
import {PROGRAM_ADMIN_DATA_SOURCE} from '../../../../../providers/global-program-admin-providers-factory';

@Component({
  selector: 'ms-program-admin-detail-dialog',
  templateUrl: './program-admin-dialog.component.html',
  styleUrls: ['./program-admin-dialog.component.scss']
})
export class ProgramAdminDialogComponent extends DialogComponent<ProgramAdmin, ProgramAdminDialogComponent> {
  constructor(
    // For super
    @Inject(MAT_DIALOG_DATA) data: any,
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<ProgramAdminDialogComponent>,
    @Inject(PROGRAM_ADMIN_DATA_SOURCE) programAdminDataSource: DataSource<ProgramAdmin>,
  ) {
    super(data?.model as ProgramAdmin, formBuilder, dialogRef, programAdminDataSource)
  }

  protected toModel(formValue: any): ProgramAdmin {
    const programAdmin: ProgramAdmin = new ProgramAdmin(formValue);
    if (this.isUpdate) {
      programAdmin.links = formValue.programAdmin.links
    }
    return programAdmin;
  }

  protected doCreateFormGroup(formBuilder: FormBuilder, programAdmin: ProgramAdmin): FormGroup {
    return formBuilder.group({
      programAdmin,
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      cellPhone: null,
      email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]]
    })
  }

  protected doUpdateFormGroup(formGroup: FormGroup, programAdmin: ProgramAdmin): void {
    formGroup.setValue({
      programAdmin,
      firstName: programAdmin?.firstName,
      lastName: programAdmin?.lastName,
      cellPhone: programAdmin?.cellPhone,
      email: programAdmin?.email
    })
  }
}
