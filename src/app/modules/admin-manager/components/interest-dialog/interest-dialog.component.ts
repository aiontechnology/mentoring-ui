/**
 * Copyright 2021 Aion Technology LLC
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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MetaDataService } from 'src/app/modules/shared/services/meta-data/meta-data.service';
import { InterestOutbound } from 'src/app/modules/shared/models/meta-data/interests/interest-outbound';

@Component({
  selector: 'ms-interest-dialog',
  templateUrl: './interest-dialog.component.html',
  styleUrls: ['./interest-dialog.component.scss']
})
export class InterestDialogComponent {

  private isUpdate: boolean;
  private updateValue: string; // 'CREATE_ME' for new interest, and 'old_value' for edited interest.

  interestBinding: string; // Value bound to template input.
  dialogTitle: string;

  constructor(private dialogRef: MatDialogRef<InterestDialogComponent>,
              private metaDataService: MetaDataService,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.isUpdate = this.determineUpdate(data);
    this.interestBinding = data?.model ? data.model.name : '';
    this.updateValue = this.interestBinding ? this.interestBinding : 'CREATE_ME';

    this.dialogTitle = this.isUpdate ? 'Edit Interest' : 'Add New Interest';

  }

  save(): void {

    const value: InterestOutbound = {
      [this.interestBinding]: this.updateValue
    };

    const ret = this.metaDataService.updateInterests(value);

    ret.then((i: string[]) => {
      this.dialogRef.close(i);
    });

  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private determineUpdate(formData: any): boolean {
    return formData?.model != null;
  }

}
