/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { grades } from 'src/app/modules/shared/constants/grades';
import { Grade } from 'src/app/modules/shared/types/grade';
import { Teacher } from '../../models/teacher/teacher';
import { TeacherRepositoryService } from '../../services/teacher/teacher-repository.service';

@Component({
  selector: 'ms-teacher-dialog',
  templateUrl: './teacher-dialog.component.html',
  styleUrls: ['./teacher-dialog.component.scss']
})
export class TeacherDialogComponent {

  model: FormGroup;
  isUpdate = false;

  schoolId: string;

  grades: Grade[] = grades;

  constructor(private dialogRef: MatDialogRef<TeacherDialogComponent>,
              private teacherService: TeacherRepositoryService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data: any) {
    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.model);
    this.schoolId = data.schoolId;
  }

  save(): void {
    const newTeacher = new Teacher(this.model.value);
    if (this.isUpdate) {
      console.log('Updating', this.model.value);
      newTeacher._links = this.model.value.teacher._links;
      this.teacherService.updateTeacher(newTeacher).then(teacher => {
        this.dialogRef.close(teacher);
      });
    } else {
      this.teacherService.createTeacher(this.schoolId, newTeacher).then(teacher => {
        this.dialogRef.close(teacher);
      });
    }
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: FormBuilder, teacher: Teacher): FormGroup {
    console.log('Creating teacher model', teacher);
    const formGroup = formBuilder.group({
      teacher,
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      workPhone: null,
      cellPhone: null,
      email: null,
      grade1: [null, Validators.required],
      grade2: null
    });
    if (this.isUpdate) {
      formGroup.setValue({
        teacher,
        firstName: teacher?.firstName,
        lastName: teacher?.lastName,
        workPhone: teacher?.workPhone,
        cellPhone: teacher?.cellPhone,
        email: teacher?.email,
        grade1: teacher?.grade1?.toString(),
        grade2: teacher?.grade2?.toString()
      });
    }
    return formGroup;
  }

  private determineUpdate(formData: any): boolean {
    return formData.model !== undefined && formData.model !== null;
  }

}
