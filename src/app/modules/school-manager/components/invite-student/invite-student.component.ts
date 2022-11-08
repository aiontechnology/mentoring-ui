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
import {DataSource} from '../../../../implementation/data/data-source';
import {emailAddressValidator} from '../../../../implementation/form-validation/email-address-validator';
import {INVITATION_DATA_SOURCE} from '../../../shared/shared.module';
import {Invitation} from '../../../../implementation/models/workflow/invitation';

@Component({
  selector: 'ms-invite-student',
  templateUrl: './invite-student.component.html',
  styleUrls: ['./invite-student.component.scss']
})
export class InviteStudentComponent implements OnInit {

  model: FormGroup;

  constructor(@Inject(INVITATION_DATA_SOURCE) private invitationDataSource: DataSource<Invitation>,
              private dialogRef: MatDialogRef<InviteStudentComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit(): void {
    this.model = this.createModel(this.formBuilder, this.data?.model);
  }

  save(): void {
    const invitation: Invitation = Invitation.of(this.model.value);
    this.invitationDataSource.add(invitation)
      .then(i => this.dialogRef.close(i));
  }

  dismiss(): void {
    this.dialogRef.close();
  }

  private createModel(formBuilder: FormBuilder, invitation: Invitation): FormGroup {
    return formBuilder.group({
      parent1FirstName: [invitation?.parent1FirstName, [Validators.required, Validators.maxLength(50)]],
      parent1LastName: [invitation?.parent1LastName, [Validators.required, Validators.maxLength(50)]],
      parent1EmailAddress: [invitation?.parent1EmailAddress, [emailAddressValidator(), Validators.required, Validators.maxLength(50)]],
      studentFirstName: [invitation?.studentFirstName, [Validators.required, Validators.maxLength(50)]],
      studentLastName: [invitation?.studentLastName, [Validators.required, Validators.maxLength(50)]],
    });
  }

}
