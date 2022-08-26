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
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Mentor} from '../../models/mentor/mentor';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {personLocations} from 'src/app/modules/shared/constants/locations';
import {DataSource} from '../../../../implementation/data/data-source';
import {MENTOR_DATA_SOURCE} from '../../../shared/shared.module';

@Component({
  selector: 'ms-mentor-dialog',
  templateUrl: './mentor-dialog.component.html',
  styleUrls: ['./mentor-dialog.component.scss']
})
export class MentorDialogComponent implements OnInit {

  model: UntypedFormGroup;
  isUpdate = false;

  schoolId: string;
  locations: { [key: string]: string };

  constructor(@Inject(MENTOR_DATA_SOURCE) private mentorDataSource: DataSource<Mentor>,
              private dialogRef: MatDialogRef<MentorDialogComponent>,
              private formBuilder: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit(): void {
    this.isUpdate = this.determineUpdate(this.data);
    this.model = this.createModel(this.formBuilder, this.data?.model);
    this.schoolId = this.data?.schoolId;
    this.locations = personLocations;
  }

  save(): void {
    const newMentor = new Mentor(this.model.value);
    let value: Promise<Mentor>;

    if (this.isUpdate) {
      newMentor.links = this.model.value.mentor.links;
      value = this.mentorDataSource.update(newMentor);
    } else {
      value = this.mentorDataSource.add(newMentor);
    }

    value.then((m: Mentor) => {
      this.dialogRef.close(m);
    });
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  // Used for the keyvalue pipe, to keep location properties in their default order.
  unsorted(): number {
    return 0;
  }

  private determineUpdate(formData: any): boolean {
    return formData.model !== undefined && formData.model !== null;
  }

  private createModel(formBuilder: UntypedFormBuilder, mentor: Mentor): UntypedFormGroup {
    const formGroup: UntypedFormGroup = formBuilder.group({
      mentor,
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: [null, [Validators.email, Validators.maxLength(50)]],
      cellPhone: null,
      availability: ['', Validators.maxLength(100)],
      mediaReleaseSigned: false,
      backgroundCheckCompleted: false,
      location: ['OFFLINE', Validators.required]
    });

    if (this.isUpdate) {
      formGroup.setValue({
        mentor,
        firstName: mentor?.firstName,
        lastName: mentor?.lastName,
        email: mentor?.email,
        cellPhone: mentor?.cellPhone,
        availability: mentor?.availability,
        mediaReleaseSigned: mentor?.mediaReleaseSigned,
        backgroundCheckCompleted: mentor?.backgroundCheckCompleted,
        location: mentor?.location?.toString()
      });
    }

    return formGroup;
  }

}
