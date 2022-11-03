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
import {Student} from '../../../../../implementation/models/student/student';
import {LinkService} from '../../../../shared/services/link-service/link.service';
import {FormGroupHolder} from './form-group-holder';

export class TeacherInputStep extends FormGroupHolder<Student> {
  constructor(
    student: Student,
    formBuilder: FormBuilder,
  ) {
    super(student, formBuilder)
  }

  protected generateFormGroup(item: Student): FormGroup {
    return this.formBuilder.group({
      teacher: this.formBuilder.group({
        uri: ['', Validators.required],
        comment: ['', Validators.maxLength(500)]
      }),
    })
  }

  protected updateFormGroup(student: Student): void {
    this.formGroup.setValue({
      teacher: {
        uri: LinkService.selfLink(student?.teacher?.teacher),
        comment: student?.teacher?.comment
      },
    })
  }

}
