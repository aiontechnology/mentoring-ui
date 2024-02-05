/*
 * Copyright 2021-2023 Aion Technology LLC
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
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {DialogComponent} from '../../../../implementation/component/dialog-component';
import {DataSource} from '../../../../implementation/data/data-source';
import {Interest} from '../../../../models/interest';
import {INTEREST_DATA_SOURCE} from '../../../../providers/global/global-interest-providers-factory';

@Component({
  selector: 'ms-interest-dialog',
  templateUrl: './interest-dialog.component.html',
  styleUrls: ['./interest-dialog.component.scss']
})
export class InterestDialogComponent extends DialogComponent<Interest, InterestDialogComponent> implements OnInit {
  private interests: string[]

  constructor(
    // for super
    @Inject(MAT_DIALOG_DATA) public data: { model: Interest, panelTitle: string },
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<InterestDialogComponent>,
    @Inject(INTEREST_DATA_SOURCE) interestDataSource: DataSource<Interest>,
  ) {
    super(data?.model, formBuilder, dialogRef, interestDataSource)
    interestDataSource.allValues()
      .then(interests => this.interests = interests.map(i => i.name))
  }

  ngOnInit(): void {
    this.init()
  }

  duplicateInterestValidator(): ValidatorFn {
    const errorMsg = 'This interest already exists'
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.interests?.includes(control.value) && this.interests !== undefined) {
        return {duplicateInterest: {msg: errorMsg}};
      }
      return null;
    };
    return null;
  }

  protected override toModel(formValue: any): Interest {
    const interest: Interest = new Interest(formValue)
    if (this.isUpdate) {
      interest.links = formValue.interest.links
    }
    return interest;
  }

  protected override doCreateFormGroup(formBuilder: FormBuilder, interest: Interest): FormGroup {
    return formBuilder.group({
      interest,
      name: ['', [this.duplicateInterestValidator(), Validators.required]]
    })
  }

  protected override doUpdateFormGroup(formGroup: FormGroup, interest: Interest): void {
    formGroup.setValue({
      interest,
      name: interest?.name
    })
  }

}
