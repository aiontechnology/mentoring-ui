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
import {FormBuilder, FormGroup, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {personLocations} from 'src/app/implementation/constants/locations';
import {DataSource} from '../../../../implementation/data/data-source';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {MENTOR_DATA_SOURCE, MENTOR_INSTANCE_CACHE, MENTOR_URI_SUPPLIER} from '../../../../providers/global-mentor-providers-factory';
import {SCHOOL_INSTANCE_CACHE} from '../../../../providers/global-school-providers-factory';
import {School} from '../../../../implementation/models/school/school';
import {Mentor} from '../../models/mentor/mentor';

@Component({
  selector: 'ms-mentor-dialog',
  templateUrl: './mentor-dialog.component.html',
  styleUrls: ['./mentor-dialog.component.scss']
})
export class MentorDialogComponent implements OnInit {

  model: FormGroup;
  isUpdate = false;

  schoolId: string;
  locations: { [key: string]: string };

  constructor(private dialogRef: MatDialogRef<MentorDialogComponent>,
              private formBuilder: FormBuilder,
              @Inject(MENTOR_DATA_SOURCE) private mentorDataSource: DataSource<Mentor>,
              @Inject(MENTOR_INSTANCE_CACHE) private mentorCache: SingleItemCache<Mentor>,
              @Inject(MENTOR_URI_SUPPLIER) private mentorUriSupplier: UriSupplier,
              @Inject(SCHOOL_INSTANCE_CACHE) private schoolCache: SingleItemCache<School>,
              @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit(): void {
    this.isUpdate = this.determineUpdate(this.data);
    this.model = this.createModel(this.formBuilder, this.data?.model);
    this.locations = personLocations;
  }

  save(): void {
    const newMentor = new Mentor(this.model.value);
    let value: Promise<Mentor>;

    if (this.isUpdate) {
      newMentor.links = this.model.value.mentor.links;
      value = this.mentorDataSource.update(newMentor);
    } else {
      this.mentorUriSupplier.withSubstitution('schoolId', this.schoolCache.item.id)
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
    return formData !== undefined && formData !== null;
  }

  private createModel(formBuilder: FormBuilder, mentor: Mentor): FormGroup {
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
