/**
 * Copyright 2020 - 2021 Aion Technology LLC
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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonnelRepositoryService } from '../../services/personnel/personnel-repository.service';
import { Personnel } from '../../models/personnel/personnel';

@Component({
  selector: 'ms-personnel-dialog',
  templateUrl: './personnel-dialog.component.html',
  styleUrls: ['./personnel-dialog.component.scss']
})
export class PersonnelDialogComponent {

  model: FormGroup;
  isUpdate = false;

  schoolId: string;

  constructor(private dialogRef: MatDialogRef<PersonnelDialogComponent>,
              private personnelService: PersonnelRepositoryService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data: any) {
    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.model);
    this.schoolId = data.schoolId;
  }

  titles: any[] = [
    { value: 'SOCIAL_WORKER', valueView: 'Social Worker' },
    { value: 'PRINCIPAL', valueView: 'Principal' },
    { value: 'COUNSELOR', valueView: 'Counselor' },
    { value: 'STAFF', valueView: 'Staff' }
  ];

  save(): void {

    const newPersonnel = new Personnel(this.model.value);
    let value: Promise<Personnel>;

    if (this.isUpdate) {
      console.log('Updating', this.model.value);
      newPersonnel._links = this.model.value.personnel._links;
      value = this.personnelService.updatePersonnel(newPersonnel);
    } else {
      value = this.personnelService.createPersonnel(this.schoolId, newPersonnel);
    }

    value.then((p: Personnel) => {
      this.dialogRef.close(p);
    });

  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: FormBuilder, personnel: Personnel): FormGroup {
    const formGroup = formBuilder.group({
      personnel,
      type: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      workPhone: null,
      cellPhone: null,
      email: [null, [Validators.email, Validators.maxLength(50)]]
    });
    if (this.isUpdate) {
      formGroup.setValue({
        personnel,
        type: personnel?.type,
        firstName: personnel?.firstName,
        lastName: personnel?.lastName,
        workPhone: personnel?.workPhone,
        cellPhone: personnel?.cellPhone,
        email: personnel?.email
      })
    }
    return formGroup;
  }

  private determineUpdate(formData: any): boolean {
    return formData.model !== undefined && formData.model !== null;
  }

}
