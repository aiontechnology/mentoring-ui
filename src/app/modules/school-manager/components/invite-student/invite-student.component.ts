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

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '../../../../implementation/component/dialog-component';
import {DataSource} from '../../../../implementation/data/data-source';
import {emailAddressValidator} from '../../../../implementation/form-validation/email-address-validator';
import {Invitation} from '../../../../implementation/models/workflow/invitation';
import {INVITATION_DATA_SOURCE} from '../../../../providers/global-invitation-providers-factory';

@Component({
  selector: 'ms-invite-student',
  templateUrl: './invite-student.component.html',
  styleUrls: ['./invite-student.component.scss']
})
export class InviteStudentComponent extends DialogComponent<Invitation, InviteStudentComponent> implements OnInit {

  constructor(
    // for super
    @Inject(MAT_DIALOG_DATA) data: any,
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<InviteStudentComponent>,
    @Inject(INVITATION_DATA_SOURCE) private invitationDataSource: DataSource<Invitation>,
  ) {
    super(data?.model, formBuilder, dialogRef, invitationDataSource)
  }

  ngOnInit(): void {
    this.init()
  }

  protected toModel(formValue: any): Invitation {
    return Invitation.of(formValue)
  }

  protected doCreateFormGroup(formBuilder: FormBuilder, invitation: Invitation): FormGroup {
    return formBuilder.group({
      parent1FirstName: [invitation?.parent1FirstName, [Validators.required, Validators.maxLength(50)]],
      parent1LastName: [invitation?.parent1LastName, [Validators.required, Validators.maxLength(50)]],
      parent1EmailAddress: [invitation?.parent1EmailAddress, [emailAddressValidator(), Validators.required, Validators.maxLength(50)]],
      studentFirstName: [invitation?.studentFirstName, [Validators.required, Validators.maxLength(50)]],
      studentLastName: [invitation?.studentLastName, [Validators.required, Validators.maxLength(50)]],
    });
  }

  protected doUpdateFormGroup(formGroup: FormGroup, invitation: Invitation): void {
    // do nothing
  }
}
