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
import {ActivatedRoute, Router} from '@angular/router';
import {DataSource} from '../../../../implementation/data/data-source';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {ProgramAdmin} from '../../../../models/program-admin/program-admin';
import {StudentInformation} from '../../../../models/workflow/student-information';
import {StudentInformationLookup} from '../../../../models/workflow/student-information-lookup';
import {PROGRAM_ADMIN_DATA_SOURCE, PROGRAM_ADMIN_URI_SUPPLIER} from '../../../../providers/global/global-program-admin-providers-factory';
import {MetaDataService} from '../../../shared/services/meta-data/meta-data.service';
import {STUDENT_INFO_DATA_SOURCE, STUDENT_INFO_LOOKUP_DATA_SOURCE, STUDENT_INFO_URI_SUPPLIER} from '../../../shared/shared.module';

@Component({
  selector: 'ms-student-information',
  templateUrl: './student-information.component.html',
  styleUrls: ['./student-information.component.scss']
})
export class StudentInformationComponent implements OnInit {

  infoFormGroup: FormGroup
  assessmentFormGroup: FormGroup
  studentInfo: StudentInformationLookup
  behaviors: string[]
  leadershipSkills: string[]
  leadershipTraits: string[]
  questions: string[] = [
    'Can easily and accurately describe her special strengths and positive qualities',
    'Is proud and confident in her abilities; enjoys being herself',
    'Focuses mostly on her strengths instead of weaknesses and past failures',
    'Speaks mostly positively about herself, rarely negatively',
    'Has a few developed hobbies and interests that encourage natural strengths',
    'Shows sensitivity toward the needs and feelings of others',
    'Recognizes when someone is distressed and responds appropriately',
    'Shows a willingness to understand someone else\'s point of view',
    'Displays concern and wants to help when someone is treated unfairly or unkindly',
    'Tears up or is upset when someone else is suffering',
    'Is honest, admits mistakes, and accepts blame for incorrect actions',
    'Can identify his wrong behavior and turn a wrong action into a right one',
    'Feels guilt about his wrong or improper actions',
    'Rarely needs admonishment/reminders as to how to act right',
    'Can be trusted to do the right thing and keep his word even when no one is looking',
    'Able to manage her own impulses and urges without adult help',
    'Easily calms down and bounces back when excited, frustrated, or angry',
    'Can identify his unhealthy emotions and stress signs prior to their escalating',
    'Has the ability to wait for something; can cope with behavioral impulses',
    'Can remain focused on age-appropriate tasks without adult prompts',
    'Asks copious why-type questions that don\'t always have yes/no answers',
    'Enjoys finding new ways to use conventional things or solving problems',
    'Loves learning new things that drive her interest',
    'Intrigued or easy to motivate about trying something new, different, or surprising',
    'Willing to be wrong and try a different, unconventional way',
    'Willingly tries new tasks with little concern about failing or making a mistake',
    'Recognizes that the way to improve is by working harder',
    'Does not become upset when something is difficult; rarely quits but keeps trying',
    'Willing to try again if not successful with a task',
    'Doesn\'t equate a mistake as a personal failure but a learning opportunity',
    'Expresses gratitude, is appreciative, and takes stock of the good things around her',
    'Uses positive self-talk to express hope and reinforce good outcomes and attitudes',
    'Doesn\'t blame but forgives; knows something she can do to make things better',
    'Can find the silver lining in a hardship or challenge',
    'Equates setbacks and failures as temporary, not permanent',
  ]

  private debug: boolean = true;

  constructor(
    @Inject(STUDENT_INFO_URI_SUPPLIER) private studentInfoUriSupplier: UriSupplier,
    @Inject(STUDENT_INFO_LOOKUP_DATA_SOURCE) private studentInfoLookupDataSource: DataSource<StudentInformationLookup>,
    @Inject(STUDENT_INFO_DATA_SOURCE) private studentInfoDataSource: DataSource<StudentInformation>,
    @Inject(PROGRAM_ADMIN_DATA_SOURCE) private programAdminDataSource: DataSource<ProgramAdmin>,
    @Inject(PROGRAM_ADMIN_URI_SUPPLIER) private programAdminUriSupplier: UriSupplier,
    metaDataService: MetaDataService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    metaDataService.loadBehaviors().then(behaviors => this.behaviors = behaviors)
    metaDataService.loadLeadershipSkills().then(leadershipSkills => this.leadershipSkills = leadershipSkills)
    metaDataService.loadLeadershipTraits().then(leadershipTraits => this.leadershipTraits = leadershipTraits)
  }

  ngOnInit(): void {
    this.infoFormGroup = this.createInfoModel(this.formBuilder)
    this.assessmentFormGroup = this.createAssessmentModel(this.formBuilder)
    this.route.paramMap.subscribe(params => {
      const schoolId = params.get('schoolId')
      const studentId = params.get('studentId')
      const registrationId = params.get('registrationId')
      this.studentInfoUriSupplier.withSubstitution('schoolId', schoolId)
      this.studentInfoUriSupplier.withSubstitution('studentId', studentId)
      this.studentInfoLookupDataSource.oneValue(registrationId)
        .then(studentInfo => {
          this.studentInfo = studentInfo
        })
        .catch(() => {
          this.programAdminUriSupplier.withSubstitution('schoolId', schoolId)
          this.programAdminDataSource.allValues()
            .then(programAdmins => {
              const programAdmin = programAdmins?.[0]
              this.router.navigate(['/workflowmanager/invalidLink'], {
                queryParams: {paName: programAdmin.fullName, paEmail: programAdmin.email}
              })
            })
            .catch(error => {
              this.router.navigate(['/workflowmanager/invalidLink'])
            })
        })
    })
  }

  submitForm(): void {
    const studentInformation = new StudentInformation(
      this.infoFormGroup.get('leadershipSkills')?.value || [],
      this.infoFormGroup.get('leadershipTraits')?.value || [],
      this.infoFormGroup.get('behaviors')?.value || [],
      this.infoFormGroup.get('teacherComment')?.value,
      this.assessmentFormGroup.get('question1')?.value,
      this.assessmentFormGroup.get('question2')?.value,
      this.assessmentFormGroup.get('question3')?.value,
      this.assessmentFormGroup.get('question4')?.value,
      this.assessmentFormGroup.get('question5')?.value,
      this.assessmentFormGroup.get('question6')?.value,
      this.assessmentFormGroup.get('question7')?.value,
      this.assessmentFormGroup.get('question8')?.value,
      this.assessmentFormGroup.get('question9')?.value,
      this.assessmentFormGroup.get('question10')?.value,
      this.assessmentFormGroup.get('question11')?.value,
      this.assessmentFormGroup.get('question12')?.value,
      this.assessmentFormGroup.get('question13')?.value,
      this.assessmentFormGroup.get('question14')?.value,
      this.assessmentFormGroup.get('question15')?.value,
      this.assessmentFormGroup.get('question16')?.value,
      this.assessmentFormGroup.get('question17')?.value,
      this.assessmentFormGroup.get('question18')?.value,
      this.assessmentFormGroup.get('question19')?.value,
      this.assessmentFormGroup.get('question20')?.value,
      this.assessmentFormGroup.get('question21')?.value,
      this.assessmentFormGroup.get('question22')?.value,
      this.assessmentFormGroup.get('question23')?.value,
      this.assessmentFormGroup.get('question24')?.value,
      this.assessmentFormGroup.get('question25')?.value,
      this.assessmentFormGroup.get('question26')?.value,
      this.assessmentFormGroup.get('question27')?.value,
      this.assessmentFormGroup.get('question28')?.value,
      this.assessmentFormGroup.get('question29')?.value,
      this.assessmentFormGroup.get('question30')?.value,
      this.assessmentFormGroup.get('question31')?.value,
      this.assessmentFormGroup.get('question32')?.value,
      this.assessmentFormGroup.get('question33')?.value,
      this.assessmentFormGroup.get('question34')?.value,
      this.assessmentFormGroup.get('question35')?.value,
    )

    const that = this
    studentInformation['links'] = this.studentInfo['links']
    console.log('===>', this.studentInfo)
    console.log('===> ', studentInformation)
    this.studentInfoDataSource.update(studentInformation)
      .then(() => {
        this.router.navigate(['/workflowmanager/teacherThankYou'], {
          relativeTo: that.route,
          queryParams: {name: this.studentInfo.studentName}
        })
      })
  }

  private createInfoModel(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      behaviors: [],
      leadershipSkills: [],
      leadershipTraits: [],
      teacherComment: ['', Validators.maxLength(500)],
    })
  }

  private createAssessmentModel(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      question1: [this.debug ? 1 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question2: [this.debug ? 2 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question3: [this.debug ? 3 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question4: [this.debug ? 4 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question5: [this.debug ? 5 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question6: [this.debug ? 4 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question7: [this.debug ? 3 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question8: [this.debug ? 2 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question9: [this.debug ? 1 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question10: [this.debug ? 2 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question11: [this.debug ? 3 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question12: [this.debug ? 4 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question13: [this.debug ? 5 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question14: [this.debug ? 4 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question15: [this.debug ? 3 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question16: [this.debug ? 2 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question17: [this.debug ? 1 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question18: [this.debug ? 2 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question19: [this.debug ? 3 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question20: [this.debug ? 4 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question21: [this.debug ? 5 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question22: [this.debug ? 4 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question23: [this.debug ? 3 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question24: [this.debug ? 2 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question25: [this.debug ? 1 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question26: [this.debug ? 2 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question27: [this.debug ? 3 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question28: [this.debug ? 4 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question29: [this.debug ? 5 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question30: [this.debug ? 4 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question31: [this.debug ? 3 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question32: [this.debug ? 2 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question33: [this.debug ? 1 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question34: [this.debug ? 2 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
      question35: [this.debug ? 3 : null, [Validators.required, Validators.min(1), Validators.max(5)]],
    })
  }
}
