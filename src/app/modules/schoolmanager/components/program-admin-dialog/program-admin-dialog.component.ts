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

import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProgramAdminService } from '../../services/program-admin/program-admin.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgramAdmin } from '../../models/program-admin/program-admin';

@Component({
  selector: 'ms-program-admin-dialog',
  templateUrl: './program-admin-dialog.component.html',
  styleUrls: ['./program-admin-dialog.component.scss']
})
export class ProgramAdminDialogComponent {

  model: FormGroup;
  schoolId: string;

  constructor(private dialogRef: MatDialogRef<ProgramAdminDialogComponent>,
              private programAdminService: ProgramAdminService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data: any) {
    this.model = this.createModel(formBuilder);
    this.schoolId = data.schoolId;
  }

  save(): void {
    const newProgramAdmin = this.model.value as ProgramAdmin;
    this.programAdminService.addProgramAdmin(this.schoolId, newProgramAdmin).then(programAdmin => {
      this.dialogRef.close(programAdmin);
    });
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      workPhone: '',
      cellPhone: '',
      email: ''
    });
  }

}
