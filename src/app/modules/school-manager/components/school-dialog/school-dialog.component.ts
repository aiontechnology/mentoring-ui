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
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {School} from 'src/app/modules/shared/models/school/school';
import {states} from '../../../../shared/states';
import {SCHOOL_DATA_SOURCE} from '../../../shared/shared.module';
import {DataSource} from '../../../../implementation/data/data-source';

@Component({
  selector: 'ms-new-school-dialog',
  templateUrl: './school-dialog.component.html',
  styleUrls: ['./school-dialog.component.scss']
})
export class SchoolDialogComponent {

  model: UntypedFormGroup;
  isUpdate = false;

  /**
   * Set up the form model and determine if this is an new school or an update of an existing school.
   * @param dialogRef A reference to the dialog that is to be used.
   * @param schoolService A reference to the SchoolService.
   * @param formBuilder A builder used to setup the form model.
   * @param data The data of the dialog.
   */
  constructor(@Inject(SCHOOL_DATA_SOURCE) private schoolDataSource: DataSource<School>,
              private dialogRef: MatDialogRef<SchoolDialogComponent>,
              private formBuilder: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.model);
  }

  get states() {
    return states;
  }

  /**
   * Save the form. Handles both new and updated schools.
   */
  save(): void {
    const newSchool = new School(this.model.value);
    let value: Promise<School>;

    if (this.isUpdate) {
      newSchool.links = this.model.value.school.links;
      value = this.schoolDataSource.update(newSchool);
    } else {
      value = this.schoolDataSource.add(newSchool);
    }

    value.then((s: School) => {
      this.dialogRef.close(s);
    });
  }

  /**
   * Dismiss the dialog without saving.
   */
  dismiss(): void {
    this.dialogRef.close(null);
  }

  /**
   * Create the form model.
   * @param formBuilder A builder used to setup the form model.
   * @param school The School being edited (if any).
   */
  private createModel(formBuilder: UntypedFormBuilder, school: School): UntypedFormGroup {
    const formGroup: UntypedFormGroup = formBuilder.group({
      school,
      name: ['', [Validators.required, Validators.maxLength(100)]],
      address: formBuilder.group({
        street1: [null, Validators.maxLength(50)],
        street2: [null, Validators.maxLength(50)],
        city: [null, Validators.maxLength(50)],
        state: null,
        zip: null
      }),
      phone: null,
      district: [null, Validators.maxLength(50)],
      isPrivate: false
    });
    if (this.isUpdate) {
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
      });
    }
    return formGroup;
  }

  /**
   * Determine if a school is being updated (as opposed to created).
   * @param formData The form data to check.
   */
  private determineUpdate(formData: any): boolean {
    return formData !== undefined && formData !== null;
  }

}
