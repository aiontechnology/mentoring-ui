/*
 * Copyright 2020-2023 Aion Technology LLC
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

import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {DialogComponent} from '../../../../../implementation/component/dialog-component';
import {DataSource} from '../../../../../implementation/data/data-source';
import {UriSupplier} from '../../../../../implementation/data/uri-supplier';
import {emailAddressValidator} from '../../../../../implementation/forms/email-address-validator';
import {phoneValidator} from '../../../../../implementation/forms/phone-validator';
import {SingleItemCache} from '../../../../../implementation/state-management/single-item-cache';
import {Personnel} from '../../../../../models/personnel/personnel';
import {School} from '../../../../../models/school/school';
import {PERSONNEL_DATA_SOURCE, PERSONNEL_URI_SUPPLIER} from '../../../../../providers/global/global-personnel-providers-factory';
import {SCHOOL_INSTANCE_CACHE} from '../../../../../providers/global/global-school-providers-factory';

@Component({
  selector: 'ms-personnel-dialog',
  templateUrl: './personnel-dialog.component.html',
  styleUrls: ['./personnel-dialog.component.scss']
})
export class PersonnelDialogComponent extends DialogComponent<Personnel, PersonnelDialogComponent> implements OnInit {
  titles: any[] = [
    {value: 'SOCIAL_WORKER', valueView: 'Social Worker'},
    {value: 'PRINCIPAL', valueView: 'Principal'},
    {value: 'COUNSELOR', valueView: 'Counselor'},
    {value: 'STAFF', valueView: 'Staff'}
  ];

  constructor(
    // for super
    @Inject(MAT_DIALOG_DATA) public data: { model: Personnel, panelTitle: string },
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<PersonnelDialogComponent>,
    @Inject(PERSONNEL_DATA_SOURCE) personnelDataSource: DataSource<Personnel>,
    // other
    @Inject(PERSONNEL_URI_SUPPLIER) private personnelUriSupplier: UriSupplier,
    @Inject(SCHOOL_INSTANCE_CACHE) private schoolCache: SingleItemCache<School>,
  ) {
    super(data?.model, formBuilder, dialogRef, personnelDataSource)
  }

  ngOnInit(): void {
    this.init()
  }

  protected toModel(formValue: any): Personnel {
    const personnel: Personnel = new Personnel(formValue);
    if (this.isUpdate) {
      personnel.links = formValue.personnel.links
    }
    return personnel;
  }

  protected doCreateFormGroup(formBuilder: FormBuilder, personnel: Personnel): FormGroup {
    return formBuilder.group({
      personnel,
      type: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      cellPhone: [null, phoneValidator()],
      email: [null, [emailAddressValidator(), Validators.maxLength(50)]]
    });
  }

  protected doUpdateFormGroup(formGroup: FormGroup, personnel: Personnel): void {
    formGroup.setValue({
      personnel,
      type: personnel?.type,
      firstName: personnel?.firstName,
      lastName: personnel?.lastName,
      cellPhone: personnel?.cellPhone,
      email: personnel?.email
    })
  }
}
