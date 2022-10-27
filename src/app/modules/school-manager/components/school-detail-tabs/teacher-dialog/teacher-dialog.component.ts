/*
 * Copyright 2020-2022 Aion Technology LLC
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

import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {grades} from 'src/app/implementation/constants/grades';
import {Grade} from 'src/app/implementation/types/grade';
import {AbstractDialogComponent} from '../../../../../implementation/component/abstract-dialog-component';
import {DataSource} from '../../../../../implementation/data/data-source';
import {SingleItemCache} from '../../../../../implementation/data/single-item-cache';
import {UriSupplier} from '../../../../../implementation/data/uri-supplier';
import {School} from '../../../../../implementation/models/school/school';
import {Teacher} from '../../../../../implementation/models/teacher/teacher';
import {SCHOOL_INSTANCE_CACHE} from '../../../../../providers/global-school-providers-factory';
import {TEACHER_DATA_SOURCE, TEACHER_URI_SUPPLIER} from '../../../../../providers/global-teacher-providers-factory';

@Component({
  selector: 'ms-teacher-dialog',
  templateUrl: './teacher-dialog.component.html',
  styleUrls: ['./teacher-dialog.component.scss'],
})
export class TeacherDialogComponent extends AbstractDialogComponent<Teacher, TeacherDialogComponent> {
  grades: Grade[] = grades;

  constructor(
    // for super
    @Inject(MAT_DIALOG_DATA) data: any,
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<TeacherDialogComponent>,
    @Inject(TEACHER_DATA_SOURCE) teacherDataSource: DataSource<Teacher>,
    // other
    @Inject(TEACHER_URI_SUPPLIER) private teacherUriSupplier: UriSupplier,
    @Inject(SCHOOL_INSTANCE_CACHE) private schoolCache: SingleItemCache<School>,
  ) {
    super(data?.model as Teacher, formBuilder, dialogRef, teacherDataSource)
  }

  protected toModel(formValue: any): Teacher {
    const teacher: Teacher = new Teacher(formValue);
    if (this.isUpdate) {
      teacher.links = formValue.teacher.links
    }
    return teacher;
  }

  protected doCreateFormGroup(formBuilder: FormBuilder, teacher: Teacher): FormGroup {
    return formBuilder.group({
      teacher,
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      cellPhone: null,
      email: [null, [Validators.email, Validators.maxLength(50)]],
      grade1: [null, [Validators.required]],
      grade2: null
    });
  }

  protected doUpdateFormGroup(formGroup: FormGroup, teacher: Teacher): void {
    formGroup.setValue({
      teacher,
      firstName: teacher?.firstName,
      lastName: teacher?.lastName,
      cellPhone: teacher?.cellPhone,
      email: teacher?.email,
      grade1: teacher?.grade1?.toString(),
      grade2: teacher?.grade2?.toString() || null
    })
  }
}
