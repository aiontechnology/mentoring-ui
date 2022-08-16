/*
 * Copyright 2021-2022 Aion Technology LLC
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

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MetaDataService } from 'src/app/modules/shared/services/meta-data/meta-data.service';
import { InterestOutbound } from 'src/app/modules/shared/models/meta-data/interests/interest-outbound';
import { InterestInbound } from '../../models/interest/interest-inbound';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ms-interest-dialog',
  templateUrl: './interest-dialog.component.html',
  styleUrls: ['./interest-dialog.component.scss']
})
export class InterestDialogComponent implements OnInit, OnDestroy {

  private isUpdate: boolean;
  private updateValue: string; // 'CREATE_ME' for new interest, and 'old_value' for edited interest.

  dialogTitle: string;
  model: FormGroup;

  interestSubscription$: Subscription;
  interests: string[];

  constructor(private dialogRef: MatDialogRef<InterestDialogComponent>,
              private metaDataService: MetaDataService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    const updateInterest = data?.model ? data.model.name : '';
    this.updateValue = updateInterest ? updateInterest : 'CREATE_ME';

    this.isUpdate = this.determineUpdate(data);

    this.dialogTitle = this.isUpdate ? 'Edit Interest' : 'Add New Interest';
    this.createModel(formBuilder, updateInterest);

  }

  ngOnInit(): void {
    this.interestSubscription$ = this.metaDataService.interests.subscribe(data => {
      console.log('Interest dialog component recieving meta-data interests:', data);
      this.interests = data;
    });
  }

  ngOnDestroy(): void {
    this.interestSubscription$.unsubscribe();
  }

  createModel(formBuilder: FormBuilder, interest: string): void {
    this.model = formBuilder.group({
      name: [interest, this.duplicateInterestValidator()]
    });
  }

  duplicateInterestValidator(): ValidatorFn {
    const errorMsg = 'This interest already exists';
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.interests?.includes(control.value) && this.interests !== undefined) {
        return { duplicateInterest: { msg: errorMsg } };
      }
      return null;
    };
  }

  save(): void {

    const newInterest = this.model.value.name;
    const value: InterestOutbound = {
      [newInterest]: this.updateValue
    };
    const ret = this.metaDataService.updateInterests(value);

    ret.then(() => {
      const n: InterestInbound = { name: newInterest };
      this.dialogRef.close(n);
    });

  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private determineUpdate(formData: any): boolean {
    return formData?.model != null;
  }

}
