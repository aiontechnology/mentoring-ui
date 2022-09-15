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
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {grades} from 'src/app/modules/shared/constants/grades';
import {Grade} from 'src/app/modules/shared/types/grade';
import {Teacher} from '../../models/teacher/teacher';
import {DataSource} from '../../../../implementation/data/data-source';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {TEACHER_DATA_SOURCE, TEACHER_URI_SUPPLIER} from '../../../shared/shared.module';
import {RouteWatchingService} from '../../../../services/route-watching.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'ms-teacher-dialog',
  templateUrl: './teacher-dialog.component.html',
  styleUrls: ['./teacher-dialog.component.scss'],
  providers: [RouteWatchingService]
})
export class TeacherDialogComponent {

  model: UntypedFormGroup;
  isUpdate = false;

  schoolId: string;

  grades: Grade[] = grades;

  /**
   * Used to set a fixed grade. Its value is provided when the
   * dialog is activated through a student dialog.
   */
  studentGrade: string;

  constructor(@Inject(TEACHER_DATA_SOURCE) private teacherDataSource: DataSource<Teacher>,
              @Inject(TEACHER_URI_SUPPLIER) private teacherUriSupplier: UriSupplier,
              private route: ActivatedRoute,
              private routeWatcher: RouteWatchingService,
              private dialogRef: MatDialogRef<TeacherDialogComponent>,
              private formBuilder: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) data: any) {
    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.model);
    this.schoolId = data.schoolId;

    if (typeof data?.selectedGrade === 'function') {
      this.studentGrade = data?.selectedGrade();
      this.model.patchValue({grade1: this.studentGrade});
    }
  }

  get hasStudentGrade(): boolean {
    return this.studentGrade !== undefined;
  }

  save(): void {
    const newTeacher = new Teacher(this.model.value);
    let value: Promise<Teacher>;

    if (this.isUpdate) {
      newTeacher.links = this.model.value.teacher.links;
      value = this.teacherDataSource.update(newTeacher);
    } else {
      this.teacherUriSupplier.withSubstitution('schoolId', this.schoolId);
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
      grade1: [null, Validators.required],
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
    return formData.model !== undefined && formData.model !== null;
  }

}
