/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ms-confimation-dialog',
  templateUrl: './confimation-dialog.component.html',
  styleUrls: ['./confimation-dialog.component.scss']
})
export class ConfimationDialogComponent {

  message: string;

  constructor(private dialogRef: MatDialogRef<ConfimationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    const singularName = data.singularName;
    const pluralName = data.pluralName;
    const countSupplier = data.countSupplier;
    const selectionCount = countSupplier();
    const bookLabel = selectionCount > 1 ? pluralName : singularName;
    this.message = `Are you sure you want to delete ${selectionCount} ${bookLabel}?`;
  }

  delete() {
    this.dialogRef.close(true);
  }

  dismiss() {
    this.dialogRef.close(false);
  }

}
