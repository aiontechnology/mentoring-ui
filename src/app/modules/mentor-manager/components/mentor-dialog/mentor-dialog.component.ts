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

import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Mentor } from '../../models/mentor/mentor';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MentorRepositoryService } from '../../services/mentor/mentor-repository.service';
import { LoggingService } from 'src/app/modules/shared/services/logging-service/logging.service';
import { personLocations } from 'src/app/modules/shared/constants/locations';

@Component({
  selector: 'ms-mentor-dialog',
  templateUrl: './mentor-dialog.component.html',
  styleUrls: ['./mentor-dialog.component.scss']
})
export class MentorDialogComponent {

  model: FormGroup;
  isUpdate = false;

  schoolId: string;
  locations: { [key: string]: string };

  constructor(private dialogRef: MatDialogRef<MentorDialogComponent>,
              private mentorService: MentorRepositoryService,
              private logger: LoggingService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.model);
    this.schoolId = data?.schoolId;
    this.locations = personLocations;

  }

  save(): void {

    const newMentor = new Mentor(this.model.value);
    let value: Promise<Mentor>;

    console.log('Saving mentor', newMentor);
    if (this.isUpdate) {
      console.log('Updating', this.model.value);
      newMentor.links = this.model.value.mentor.links;
      value = this.mentorService.updateMentor(newMentor);
    } else {
      value = this.mentorService.createMentor(this.schoolId, newMentor);
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

  private createModel(formBuilder: FormBuilder, mentor: Mentor): FormGroup {

    console.log('Mentor', mentor);
    const formGroup: FormGroup = formBuilder.group({
      mentor,
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: [null, [Validators.email, Validators.maxLength(50)]],
      cellPhone: null,
      availability: ['',  Validators.maxLength(100)],
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
