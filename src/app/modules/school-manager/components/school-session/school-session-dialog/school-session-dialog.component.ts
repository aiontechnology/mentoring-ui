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
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {SchoolSession} from 'src/app/models/school/schoolsession';
import {DialogComponent} from '../../../../../implementation/component/dialog-component';
import {DataSource} from '../../../../../implementation/data/data-source';
import {SCHOOL_SESSION_DATA_SOURCE} from '../../../../../providers/global/global-school-session-providers-factory';

@Component({
  selector: 'ms-school-session-dialog',
  templateUrl: './school-session-dialog.component.html',
  styleUrls: ['./school-session-dialog.component.scss']
})
export class SchoolSessionDialogComponent extends DialogComponent<SchoolSession, SchoolSessionDialogComponent> implements OnInit{
  constructor(
    // for super
    @Inject(MAT_DIALOG_DATA) private data: { model: SchoolSession },
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<SchoolSessionDialogComponent>,
    @Inject(SCHOOL_SESSION_DATA_SOURCE) schoolSessionDataSource: DataSource<SchoolSession>,
    // other
  ) {
    super(data?.model, formBuilder, dialogRef, schoolSessionDataSource)
  }

  ngOnInit(): void {
    this.init()
  }

  protected toModel(formValue: any): SchoolSession {
    return new SchoolSession(formValue);
  }

  protected doCreateFormGroup(formBuilder: FormBuilder, schoolSession: SchoolSession): FormGroup {
    return formBuilder.group({
      label: ['', [Validators.required]],
    });
  }

  protected doUpdateFormGroup(formGroup: FormGroup, model: SchoolSession): void {
    // do nothing
  }
}
