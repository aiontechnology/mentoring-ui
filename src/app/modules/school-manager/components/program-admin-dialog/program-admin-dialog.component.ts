/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CallerWithErrorHandling } from 'src/app/implementation/util/caller-with-error-handling';
import { ProgramAdmin } from '../../models/program-admin/program-admin';
import { ProgramAdminRepositoryService } from '../../services/program-admin/program-admin-repository.service';

@Component({
  selector: 'ms-program-admin-dialog',
  templateUrl: './program-admin-dialog.component.html',
  styleUrls: ['./program-admin-dialog.component.scss']
})
export class ProgramAdminDialogComponent {

  model: FormGroup;
  isUpdate = false;

  schoolId: string;

  private caller = new CallerWithErrorHandling<ProgramAdmin, ProgramAdminDialogComponent>();

  constructor(private dialogRef: MatDialogRef<ProgramAdminDialogComponent>,
              private programAdminService: ProgramAdminRepositoryService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: any) {
    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.model);
    this.schoolId = data.schoolId;
  }

  save(): void {
    const newProgramAdmin = new ProgramAdmin(this.model.value);
    let func: (item: ProgramAdmin) => Promise<ProgramAdmin>;
    if (this.isUpdate) {
      console.log('Updating', this.model.value);
      newProgramAdmin._links = this.model.value.programAdmin._links;
      func = this.programAdminService.updateProgramAdmin;
    } else {
      func = this.programAdminService.curriedCreateProgramAdmin(this.schoolId);
    }
    this.caller.callWithErrorHandling(this.programAdminService, func, newProgramAdmin, this.dialogRef, this.snackBar);
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: FormBuilder, programAdmin: ProgramAdmin): FormGroup {
    const formGroup = formBuilder.group({
      programAdmin,
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      workPhone: null,
      cellPhone: null,
      email: [null, [Validators.email, Validators.maxLength(50)]]
    });
    if (this.isUpdate) {
      formGroup.setValue({
        programAdmin,
        firstName: programAdmin?.firstName,
        lastName: programAdmin?.lastName,
        workPhone: programAdmin?.workPhone,
        cellPhone: programAdmin?.cellPhone,
        email: programAdmin?.email
      });
    }
    return formGroup;
  }

  private determineUpdate(formData: any): boolean {
    return formData.model !== undefined && formData.model !== null;
  }

}
