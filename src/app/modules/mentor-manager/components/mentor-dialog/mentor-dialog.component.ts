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
import {personLocations} from 'src/app/implementation/constants/locations';
import {DialogComponent} from '../../../../implementation/component/dialog-component';
import {DataSource} from '../../../../implementation/data/data-source';
import {emailAddressValidator} from '../../../../implementation/forms/email-address-validator';
import {phoneValidator} from '../../../../implementation/forms/phone-validator';
import {Mentor} from '../../../../models/mentor/mentor';
import {MENTOR_DATA_SOURCE} from '../../../../providers/global/global-mentor-providers-factory';

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
    @Inject(MAT_DIALOG_DATA) public data: { model: Mentor, panelTitle: string },
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<MentorDialogComponent>,
    @Inject(MENTOR_DATA_SOURCE) mentorDataSource: DataSource<Mentor>,
  ) {
    super(data?.model, formBuilder, dialogRef, mentorDataSource)
  }

  ngOnInit(): void {
    this.init()
  }

  // Used for the keyvalue pipe, to keep location properties in their default order.
  unsorted(): number {
    return 0;
  }

  protected toModel(formValue: any): Mentor {
    const mentor: Mentor = new Mentor(formValue)
    if (this.isUpdate) {
      mentor.links = formValue.mentor.links
    }
    return mentor;
  }

  protected override doCreateFormGroup(formBuilder: FormBuilder, mentor: Mentor): FormGroup {
    return formBuilder.group({
      mentor,
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: [null, [emailAddressValidator(), Validators.maxLength(50)]],
      cellPhone: [null, phoneValidator()],
      availability: ['', Validators.maxLength(100)],
      mediaReleaseSigned: false,
      backgroundCheckCompleted: false,
      location: ['OFFLINE', Validators.required]
    });
  }

  protected override doUpdateFormGroup(formGroup: FormGroup, mentor: Mentor): void {
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
