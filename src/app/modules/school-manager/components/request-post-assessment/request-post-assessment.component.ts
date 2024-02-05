/*
 * Copyright 2023 Aion Technology LLC
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
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {DialogComponent} from '@implementation/component/dialog-component';
import {DataSource} from '@implementation/data/data-source';
import {PostAssessment} from '@models/workflow/post-assessment';
import {POST_ASSESSMENT_DATA_SOURCE} from '@providers/global/global-assessment-providers-factory';

@Component({
  selector: 'ms-request-post-assessment',
  templateUrl: './request-post-assessment.component.html',
  styleUrls: ['./request-post-assessment.component.scss']
})
export class RequestPostAssessmentComponent extends DialogComponent<PostAssessment, RequestPostAssessmentComponent> implements OnInit {

  constructor(
    // for super
    @Inject(MAT_DIALOG_DATA) public data: { model: PostAssessment, panelTitle: string},
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<RequestPostAssessmentComponent>,
    @Inject(POST_ASSESSMENT_DATA_SOURCE) private postAssessmentDataSource: DataSource<PostAssessment>
  ) {
    super(data?.model, formBuilder, dialogRef, postAssessmentDataSource)
  }

  ngOnInit(): void {
    this.init()
  }

  protected override toModel(formValue: any): PostAssessment {
    return PostAssessment.of(formValue);
  }

  protected override doCreateFormGroup(formBuilder: FormBuilder, model: PostAssessment): FormGroup {
    return formBuilder.group({

    });
  }

  protected override doUpdateFormGroup(formGroup: FormGroup, model: PostAssessment) {
    // do nothing
  }

}
