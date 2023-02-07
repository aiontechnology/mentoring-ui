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
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {DataSource} from '../../../../implementation/data/data-source';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {StudentInformationLookup} from '../../../../models/workflow/student-information-lookup';
import {MetaDataService} from '../../../shared/services/meta-data/meta-data.service';
import {STUDENT_INFO_LOOKUP_DATA_SOURCE, STUDENT_INFO_URI_SUPPLIER} from '../../../shared/shared.module';

@Component({
  selector: 'ms-student-information',
  templateUrl: './student-information.component.html',
  styleUrls: ['./student-information.component.scss']
})
export class StudentInformationComponent implements OnInit {

  infoFormGroup: FormGroup
  assessmentFormGroup: FormGroup
  studentInfo: Promise<StudentInformationLookup>
  behaviors: string[]
  leadershipSkills: string[]
  leadershipTraits: string[]

  constructor(
    @Inject(STUDENT_INFO_URI_SUPPLIER) private studentInfoUriSupplier: UriSupplier,
    @Inject(STUDENT_INFO_LOOKUP_DATA_SOURCE) private studentInfoDataSource: DataSource<StudentInformationLookup>,
    metaDataService: MetaDataService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {
    metaDataService.loadBehaviors().then(behaviors => this.behaviors = behaviors)
    metaDataService.loadLeadershipSkills().then(leadershipSkills => this.leadershipSkills = leadershipSkills)
    metaDataService.loadLeadershipTraits().then(leadershipTraits => this.leadershipTraits = leadershipTraits)
  }

  ngOnInit(): void {
    console.log('===> Here we are')
    this.infoFormGroup = this.createInfoModel(this.formBuilder)
    this.assessmentFormGroup = this.createAssessmentModel(this.formBuilder)
    this.route.paramMap.subscribe(params => {
      const schoolId = params.get('schoolId')
      const studentId = params.get('studentId')
      const registrationId = params.get('registrationId')
      this.studentInfoUriSupplier.withSubstitution('schoolId', schoolId)
      this.studentInfoUriSupplier.withSubstitution('studentId', studentId)
      this.studentInfo = this.studentInfoDataSource.oneValue(registrationId)
    })
  }

  save(): void {
    console.log('SAVING')
  }

  private createInfoModel(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      behaviors: [],
      leadershipSkills: [],
      leadershipTraits: [],
      teacherComments: ['', Validators.maxLength(500)],
    })
  }

  private createAssessmentModel(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      question1: [null, [Validators.min(1), Validators.max(5)]],
      question2: [null, [Validators.min(1), Validators.max(5)]],
      question3: [null, [Validators.min(1), Validators.max(5)]],
      question4: [null, [Validators.min(1), Validators.max(5)]],
      question5: [null, [Validators.min(1), Validators.max(5)]],
      question6: [null, [Validators.min(1), Validators.max(5)]],
      question7: [null, [Validators.min(1), Validators.max(5)]],
      question8: [null, [Validators.min(1), Validators.max(5)]],
      question9: [null, [Validators.min(1), Validators.max(5)]],
      question10: [null, [Validators.min(1), Validators.max(5)]],
      question11: [null, [Validators.min(1), Validators.max(5)]],
      question12: [null, [Validators.min(1), Validators.max(5)]],
      question13: [null, [Validators.min(1), Validators.max(5)]],
      question14: [null, [Validators.min(1), Validators.max(5)]],
      question15: [null, [Validators.min(1), Validators.max(5)]],
      question16: [null, [Validators.min(1), Validators.max(5)]],
      question17: [null, [Validators.min(1), Validators.max(5)]],
      question18: [null, [Validators.min(1), Validators.max(5)]],
      question19: [null, [Validators.min(1), Validators.max(5)]],
      question20: [null, [Validators.min(1), Validators.max(5)]],
      question21: [null, [Validators.min(1), Validators.max(5)]],
      question22: [null, [Validators.min(1), Validators.max(5)]],
      question23: [null, [Validators.min(1), Validators.max(5)]],
      question24: [null, [Validators.min(1), Validators.max(5)]],
      question25: [null, [Validators.min(1), Validators.max(5)]],
      question26: [null, [Validators.min(1), Validators.max(5)]],
      question27: [null, [Validators.min(1), Validators.max(5)]],
      question28: [null, [Validators.min(1), Validators.max(5)]],
      question29: [null, [Validators.min(1), Validators.max(5)]],
      question30: [null, [Validators.min(1), Validators.max(5)]],
      question31: [null, [Validators.min(1), Validators.max(5)]],
      question32: [null, [Validators.min(1), Validators.max(5)]],
      question33: [null, [Validators.min(1), Validators.max(5)]],
      question34: [null, [Validators.min(1), Validators.max(5)]],
      question35: [null, [Validators.min(1), Validators.max(5)]],
    })
  }
}
