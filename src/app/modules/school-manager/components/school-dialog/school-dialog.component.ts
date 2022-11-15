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

import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {School} from 'src/app/implementation/models/school/school';
import {DialogComponent} from '../../../../implementation/component/dialog-component';
import {states as globalStates} from '../../../../implementation/constants/states';
import {DataSource} from '../../../../implementation/data/data-source';
import {phoneValidator} from '../../../../implementation/form-validation/phone-validator';
import {MultiItemCache} from '../../../../implementation/state-management/multi-item-cache';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {
  SCHOOL_COLLECTION_CACHE,
  SCHOOL_DATA_SOURCE,
  SCHOOL_INSTANCE_CACHE
} from '../../../../providers/global/global-school-providers-factory';

@Component({
  selector: 'ms-new-school-dialog',
  templateUrl: './school-dialog.component.html',
  styleUrls: ['./school-dialog.component.scss']
})
export class SchoolDialogComponent extends DialogComponent<School, SchoolDialogComponent> implements OnInit {
  states = globalStates

  constructor(
    // for super
    @Inject(MAT_DIALOG_DATA) public data: { model: School, panelTitle: string },
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<SchoolDialogComponent>,
    @Inject(SCHOOL_DATA_SOURCE) schoolDataSource: DataSource<School>,
    // other
    @Inject(SCHOOL_INSTANCE_CACHE) private schoolInstanceCache: SingleItemCache<School>,
    @Inject(SCHOOL_COLLECTION_CACHE) private schoolCollectionCache: MultiItemCache<School>,
  ) {
    super(data?.model, formBuilder, dialogRef, schoolDataSource)
  }

  ngOnInit(): void {
    this.init()
  }

  protected postDialogClose(school: School) {
    this.schoolInstanceCache.item = school;
    this.schoolCollectionCache.load()
  }

  protected toModel(formValue: any): School {
    const school: School = new School(formValue);
    if (this.isUpdate) {
      school.links = formValue.school.links
    }
    return school;
  }

  protected doCreateFormGroup(formBuilder: FormBuilder, school: School): FormGroup {
    const group: FormGroup = formBuilder.group({
      school,
      name: ['', [Validators.required, Validators.maxLength(100)]],
      address: formBuilder.group({
        street1: [null, Validators.maxLength(50)],
        street2: [null, Validators.maxLength(50)],
        city: [null, Validators.maxLength(50)],
        state: null,
        zip: null
      }),
      phone: [null, phoneValidator()],
      district: [null, Validators.maxLength(50)],
      isPrivate: false
    })
    if (!this.isUpdate) {
      const control = new FormControl('', [Validators.required, Validators.maxLength(30)])
      group.addControl('initialSessionLabel', control)
    }
    return group
  }

  protected doUpdateFormGroup(formGroup: FormGroup, school: School): void {
    formGroup.setValue({
      school,
      name: school?.name,
      address: {
        street1: school?.address?.street1,
        street2: school?.address?.street2,
        city: school?.address?.city,
        state: school?.address?.state,
        zip: school?.address?.zip
      },
      phone: school?.phone,
      district: school?.district,
      isPrivate: school?.isPrivate
    })
  }
}
