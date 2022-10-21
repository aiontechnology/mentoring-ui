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
import {FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {SCHOOL_INSTANCE_CACHE} from '../../../../providers/global-school-providers-factory';
import {School} from '../../../../implementation/models/school/school';
import {Personnel} from '../../models/personnel/personnel';
import {DataSource} from '../../../../implementation/data/data-source';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {PERSONNEL_DATA_SOURCE, PERSONNEL_URI_SUPPLIER} from '../../providers/personnel-providers-factory';

@Component({
  selector: 'ms-personnel-dialog',
  templateUrl: './personnel-dialog.component.html',
  styleUrls: ['./personnel-dialog.component.scss']
})
export class PersonnelDialogComponent {

  model: FormGroup;
  isUpdate = false;

  titles: any[] = [
    {value: 'SOCIAL_WORKER', valueView: 'Social Worker'},
    {value: 'PRINCIPAL', valueView: 'Principal'},
    {value: 'COUNSELOR', valueView: 'Counselor'},
    {value: 'STAFF', valueView: 'Staff'}
  ];

  constructor(private dialogRef: MatDialogRef<PersonnelDialogComponent>,
              private formBuilder: FormBuilder,
              @Inject(PERSONNEL_DATA_SOURCE) private personnelDataSource: DataSource<Personnel>,
              @Inject(PERSONNEL_URI_SUPPLIER) private personnelUriSupplier: UriSupplier,
              @Inject(SCHOOL_INSTANCE_CACHE) private schoolCache: SingleItemCache<School>,
              @Inject(MAT_DIALOG_DATA) data: any) {
    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.model);
  }

  save(): void {
    const newPersonnel = new Personnel(this.model.value);
    let value: Promise<Personnel>;

    if (this.isUpdate) {
      newPersonnel.links = this.model.value.personnel.links;
      value = this.personnelDataSource.update(newPersonnel);
    } else {
      this.personnelUriSupplier.withSubstitution('schoolId', this.schoolCache.item.id)
      value = this.personnelDataSource.add(newPersonnel);
    }

    value.then((p: Personnel) => {
      this.dialogRef.close(p);
    });
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: UntypedFormBuilder, personnel: Personnel): UntypedFormGroup {
    const formGroup = formBuilder.group({
      personnel,
      type: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      cellPhone: null,
      email: [null, [Validators.email, Validators.maxLength(50)]]
    });
    if (this.isUpdate) {
      formGroup.setValue({
        personnel,
        type: personnel?.type,
        firstName: personnel?.firstName,
        lastName: personnel?.lastName,
        cellPhone: personnel?.cellPhone,
        email: personnel?.email
      });
    }
    return formGroup;
  }

  private determineUpdate = (formData: any): boolean => {
    return formData !== undefined && formData !== null;
  }

}
