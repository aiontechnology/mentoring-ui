/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CallerWithErrorHandling } from 'src/app/implementation/util/caller-with-error-handling';
import { Mentor } from '../../models/mentor/mentor';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MentorRepositoryService } from '../../services/mentor/mentor-repository.service';
import { LoggingService } from 'src/app/modules/shared/services/logging-service/logging.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'ms-mentor-dialog',
  templateUrl: './mentor-dialog.component.html',
  styleUrls: ['./mentor-dialog.component.scss']
})
export class MentorDialogComponent {

  model: FormGroup;
  isUpdate = false;

  schoolId: string;
  locations: string[] = ['Offline', 'Online', 'Both'];

  private caller = new CallerWithErrorHandling<Mentor, MentorDialogComponent>();

  constructor(private dialogRef: MatDialogRef<MentorDialogComponent>,
              private mentorService: MentorRepositoryService,
              private logger: LoggingService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.model);
    this.schoolId = data?.schoolId;

  }

  save(): void {
    const newMentor = new Mentor(this.model.value);
    let func: (item: Mentor) => Promise<Mentor>;
    console.log('Saving mentor', newMentor);
    if (this.isUpdate) {
      // TODO: add update value.
    } else {
      func = this.mentorService.curriedCreateMentor(this.schoolId);
    }
    this.caller.callWithErrorHandling(this.mentorService, func, newMentor, this.dialogRef, this.snackBar); 
  }

  dismiss(): void {
    this.dialogRef.close(null);
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
      workPhone: null,
      cellPhone: null,
      availability: [''],
      mediaReleaseSigned: false,
      location: ['OFFLINE', Validators.required]
    });

    /*
    if (this.isUpdate) {
      formGroup.setValue({
        mentor,
        firstName: mentor?.firstName,
        lastName: mentor?.lastName,
        email: mentor?.email,
        workPhone: mentor?.workPhone,
        cellPhone: mentor?.cellPhone,
        availability: mentor?.availability,
        mediaReleaseSigned: mentor?.mediaReleaseSigned,
        location: mentor?.location?.toString()
      });
    }
    */

    return formGroup;

  }

}
