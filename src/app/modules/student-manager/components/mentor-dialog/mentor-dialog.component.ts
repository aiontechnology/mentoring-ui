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

import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '../../../../implementation/component/dialog-component';
import {personLocations} from '../../../../implementation/constants/locations';
import {DataSource} from '../../../../implementation/data/data-source';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {Mentor} from '../../../../implementation/models/mentor/mentor';
import {School} from '../../../../implementation/models/school/school';
import {MultiItemCache} from '../../../../implementation/state-management/multi-item-cache';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {
  MENTOR_COLLECTION_CACHE,
  MENTOR_DATA_SOURCE,
  MENTOR_INSTANCE_CACHE,
  MENTOR_URI_SUPPLIER
} from '../../../../providers/global-mentor-providers-factory';
import {SCHOOL_INSTANCE_CACHE} from '../../../../providers/global-school-providers-factory';

@Component({
  selector: 'ms-mentor-dialog',
  templateUrl: './mentor-dialog.component.html',
  styleUrls: ['./mentor-dialog.component.scss']
})
export class MentorDialogComponent extends DialogComponent<Mentor, MentorDialogComponent> implements OnInit {
  schoolId: string;
  locations: { [key: string]: string } = personLocations;

  constructor(
    // for super
    @Inject(MAT_DIALOG_DATA) private data: any,
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<MentorDialogComponent>,
    @Inject(MENTOR_DATA_SOURCE) mentorDataSource: DataSource<Mentor>,
    // other
    @Inject(MENTOR_INSTANCE_CACHE) private mentorInstanceCache: SingleItemCache<Mentor>,
    @Inject(MENTOR_COLLECTION_CACHE) private mentorCollectionCache: MultiItemCache<Mentor>,
    @Inject(MENTOR_URI_SUPPLIER) private mentorUriSupplier: UriSupplier,
    @Inject(SCHOOL_INSTANCE_CACHE) private schoolCache: SingleItemCache<School>,
  ) {
    super(data?.model as Mentor, formBuilder, dialogRef, mentorDataSource)
  }

  ngOnInit(): void {
    this.init()
  }

// Used for the keyvalue pipe, to keep location properties in their default order.
  unsorted(): number {
    return 0;
  }

  protected postDialogClose(mentor: Mentor) {
    this.mentorCollectionCache.load()
      .then((mentors) => {
        this.mentorInstanceCache.item = mentor
      })
  }

  protected toModel(formValue: any): Mentor {
    const mentor: Mentor = new Mentor(formValue);
    if (this.isUpdate) {
      mentor.links = formValue.mentor.links
    }
    return mentor;
  }

  protected doCreateFormGroup(formBuilder: FormBuilder, mentor: Mentor): FormGroup {
    return formBuilder.group({
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
  }

  protected doUpdateFormGroup(formGroup: FormGroup, mentor: Mentor): void {
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
    })
  }
}
