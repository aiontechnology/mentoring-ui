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
import {FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {grades} from 'src/app/implementation/constants/grades';
import {Grade} from 'src/app/implementation/types/grade';
import {DataSource} from '../../../../implementation/data/data-source';
import {SingleItemCache} from '../../../../implementation/data/single-item-cache';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {School} from '../../../../implementation/models/school/school';
import {SCHOOL_INSTANCE_CACHE} from '../../../../providers/global-school-providers-factory';
import {Teacher} from '../../models/teacher/teacher';
import {TEACHER_DATA_SOURCE, TEACHER_URI_SUPPLIER} from '../../providers/teacher-providers-factory';

@Component({
  selector: 'ms-teacher-dialog',
  templateUrl: './teacher-dialog.component.html',
  styleUrls: ['./teacher-dialog.component.scss'],
})
export class TeacherDialogComponent {

  model: FormGroup
  isUpdate = false;

  grades: Grade[] = grades;

  /**
   * Used to set a fixed grade. Its value is provided when the
   * dialog is activated through a student dialog.
   */
  studentGrade: string;

  constructor(private dialogRef: MatDialogRef<TeacherDialogComponent>,
              private formBuilder: FormBuilder,
              @Inject(TEACHER_DATA_SOURCE) private teacherDataSource: DataSource<Teacher>,
              @Inject(TEACHER_URI_SUPPLIER) private teacherUriSupplier: UriSupplier,
              @Inject(SCHOOL_INSTANCE_CACHE) private schoolCache: SingleItemCache<School>,
              @Inject(MAT_DIALOG_DATA) data: any) {
    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.model);
  }

  save(): void {
    const newTeacher = new Teacher(this.model.value);
    let value: Promise<Teacher>;

    if (this.isUpdate) {
      newTeacher.links = this.model.value.teacher.links;
      value = this.teacherDataSource.update(newTeacher);
    } else {
      this.teacherUriSupplier.withSubstitution('schoolId', this.schoolCache.item.id);
      value = this.teacherDataSource.add(newTeacher);
    }

    value.then((t: Teacher) => {
      this.dialogRef.close(t);
    });
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: UntypedFormBuilder, teacher: Teacher): UntypedFormGroup {
    const formGroup = formBuilder.group({
      teacher,
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      cellPhone: null,
      email: [null, [Validators.email, Validators.maxLength(50)]],
      grade1: [null, [Validators.required]],
      grade2: null
    });
    if (this.isUpdate) {
      formGroup.setValue({
        teacher,
        firstName: teacher?.firstName,
        lastName: teacher?.lastName,
        cellPhone: teacher?.cellPhone,
        email: teacher?.email,
        grade1: teacher?.grade1?.toString(),
        grade2: teacher?.grade2?.toString() || null
      });
    }
    return formGroup;
  }

  private determineUpdate(formData: any): boolean {
    return formData !== undefined && formData !== null;
  }

}
