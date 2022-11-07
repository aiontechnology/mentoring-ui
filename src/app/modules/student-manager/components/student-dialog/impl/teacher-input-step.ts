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

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {equalsBySelfLink} from '../../../../../implementation/functions/comparison';
import {Student} from '../../../../../implementation/models/student/student';
import {Teacher} from '../../../../../implementation/models/teacher/teacher';
import {MultiItemCache} from '../../../../../implementation/state-management/multi-item-cache';
import {SingleItemCache} from '../../../../../implementation/state-management/single-item-cache';
import {LinkService} from '../../../../shared/services/link-service/link.service';
import {FormGroupHolder} from './form-group-holder';

export class TeacherInputStep extends FormGroupHolder<Student> {
  compareTeachers = equalsBySelfLink

  constructor(
    // for super
    student: Student,
    formBuilder: FormBuilder,
    // other
    private teacherInstanceCache: SingleItemCache<Teacher>,
    private teacherCollectionCache: MultiItemCache<Teacher>,
  ) {
    super(student, formBuilder)
  }

  override get value(): any {
    const v = {
      teacher: {
        uri: LinkService.selfLink(this.formGroup.get('teacher').value),
        comment: this.formGroup.get('comment').value
      }
    }
    return v
  }

  teachersForGrade(grade: string): Teacher[] {
    const g:number = +grade
    return this.teacherCollectionCache.items
      .filter(teacher => teacher.grade1 === g)
  }

  protected generateFormGroup(item: Student): FormGroup {
    return this.formBuilder.group({
      teacher: [null, Validators.required],
      comment: ['', Validators.maxLength(500)]
    })
  }

  protected updateFormGroup(student: Student): void {
    this.formGroup.patchValue({
      teacher: student?.teacher?.teacher,
      comment: student?.teacher?.comment
    })
  }

}
