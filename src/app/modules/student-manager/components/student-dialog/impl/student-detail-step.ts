/*
 * Copyright 2022-2023 Aion Technology LLC
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

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {grades} from '../../../../../implementation/constants/grades';
import {personLocations} from '../../../../../implementation/constants/locations';
import {DataSource} from '../../../../../implementation/data/data-source';
import {equalsBySelfLink} from '../../../../../implementation/functions/comparison';
import {getMonth, getYear, months} from '../../../../../implementation/shared/date.utils';
import {Grade} from '../../../../../implementation/types/grade';
import {Interest} from '../../../../../models/interest';
import {Mentor} from '../../../../../models/mentor/mentor';
import {Student} from '../../../../../models/student/student';
import {MetaDataService} from '../../../../shared/services/meta-data/meta-data.service';
import {FormGroupHolder} from './form-group-holder';

export class StudentDetailStep extends FormGroupHolder<Student> {
  compareMentors = equalsBySelfLink

  activityFocuses: string[]
  behaviors: string[]
  interests: string[]
  leadershipSkills: string[]
  leadershipTraits: string[]
  locations = personLocations
  months: string[] = months
  grades: Grade[] = grades

  constructor(
    student: Student,
    formBuilder: FormBuilder,
    interestDataSource: DataSource<Interest>,
    metaDataService: MetaDataService,
  ) {
    super(student, formBuilder)
    interestDataSource.allValues()
      .then(iterests => this.interests = iterests.map(i => i.name))

    metaDataService.loadActivityFocuses()
      .then(activityFocuses => this.activityFocuses = activityFocuses)
    metaDataService.loadBehaviors()
      .then(behaviors => this.behaviors = behaviors)
    metaDataService.loadLeadershipSkills()
      .then(leadershipSkills => this.leadershipSkills = leadershipSkills)
    metaDataService.loadLeadershipTraits()
      .then(leadershipTraits => this.leadershipTraits = leadershipTraits)
  }

  override get value(): any {
    const v = super.value;
    const mentor = v.mentor as Mentor
    v.mentor = mentor?.selfLink
      ? { uri: mentor.selfLink }
      : null
    v.startDate = (v.month && v.year)
      ? new Date(v.year, this.months.indexOf(v.month))
      : null
    return v
  }

  protected generateFormGroup(student: Student): FormGroup {
    return this.formBuilder.group({
      student,
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      studentId: ['', Validators.maxLength(20)],
      grade: ['', Validators.required],
      preBehavioralAssessment: ['', [Validators.min(0), Validators.max(45)]],
      postBehavioralAssessment: ['', [Validators.min(0), Validators.max(45)]],
      registrationSigned: false,
      mediaReleaseSigned: false,
      month: [''],
      year: ['', Validators.min(1900)],
      preferredTime: ['', Validators.maxLength(30)],
      actualTime: ['', Validators.maxLength(30)],
      mentor: null,
      activityFocuses: [],
      interests: [],
      leadershipSkills: [],
      leadershipTraits: [],
      behaviors: [],
      location: ['OFFLINE', Validators.required],
      links: null
    })
  }

  protected updateFormGroup(student: Student) {
    this.formGroup.patchValue({
      student,
      firstName: student?.firstName,
      lastName: student?.lastName,
      studentId: student?.studentId,
      grade: student?.grade?.toString(),
      preBehavioralAssessment: student?.preBehavioralAssessment,
      postBehavioralAssessment: student?.postBehavioralAssessment,
      registrationSigned: student?.registrationSigned || false,
      mediaReleaseSigned: student?.mediaReleaseSigned || false,
      month: getMonth(student?.startDate),
      year: getYear(student?.startDate),
      preferredTime: student?.preferredTime,
      actualTime: student?.actualTime,
      mentor: student?.mentor?.mentor,
      activityFocuses: student?.activityFocuses,
      interests: student?.interests,
      leadershipSkills: student?.leadershipSkills,
      leadershipTraits: student?.leadershipTraits,
      behaviors: student?.behaviors,
      location: student?.location?.toString() || 'OFFLINE',
      links: student.links
    })
  }
}
