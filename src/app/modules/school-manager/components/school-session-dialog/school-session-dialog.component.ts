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

import {Component, Inject} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SchoolSession} from 'src/app/modules/shared/models/school/schoolsession';
import {DataSource} from '../../../../implementation/data/data-source';
import {SCHOOL_SESSION_DATA_SOURCE} from '../../providers/school-session-providers-factory';

@Component({
  selector: 'ms-school-session-dialog',
  templateUrl: './school-session-dialog.component.html',
  styleUrls: ['./school-session-dialog.component.scss']
})
export class SchoolSessionDialogComponent {

  model: UntypedFormGroup;
  isUpdate = false;

  schoolId: string;

  constructor(@Inject(SCHOOL_SESSION_DATA_SOURCE) private schoolSessionDataSource: DataSource<SchoolSession>,
              private dialogRef: MatDialogRef<SchoolSessionDialogComponent>,
              private formBuilder: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.model = this.createModel(formBuilder);
    this.schoolId = data?.schoolId;
  }

  /**
   * Save the form. Handles both new and updated schools.
   */
  save(): void {
    const newSession = new SchoolSession(this.model.value);
    let value: Promise<SchoolSession>;

    if (this.isUpdate) {
      newSession.links = this.model.value.school.links;
      value = this.schoolSessionDataSource.update(newSession);
    } else {
      value = this.schoolSessionDataSource.add(newSession);
    }

    value.then((ss: SchoolSession) => {
      this.dialogRef.close(ss);
    });
  }

  /**
   * Dismiss the dialog without saving.
   */
  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: UntypedFormBuilder): UntypedFormGroup {
    const formGroup: UntypedFormGroup = formBuilder.group({
      label: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', Validators.required]
    });
    return formGroup;
  }

}
