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

import { Component, Inject, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Teacher } from '../../models/teacher/teacher';
import { TeacherService } from '../../services/teacher/teacher.service';
import { grades } from 'src/app/modules/shared/constants/grades';
import { Grade } from 'src/app/modules/shared/types/grade';

@Component({
  selector: 'ms-teacher-dialog',
  templateUrl: './teacher-dialog.component.html',
  styleUrls: ['./teacher-dialog.component.scss']
})
export class TeacherDialogComponent {

  model: FormGroup;
  schoolId: string;

  grades: Grade[] = grades;

  constructor(private dialogRef: MatDialogRef<TeacherDialogComponent>,
              private teacherService: TeacherService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data: any) {
    this.model = this.createModel(formBuilder);
    this.schoolId = data.schoolId;
  }

  save(): void {
    const newTeacher = this.model.value as Teacher;
    this.teacherService.addTeacher(this.schoolId, newTeacher).then(teacher => {
      this.dialogRef.close(teacher);
    });
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      workPhone: '',
      cellPhone: '',
      email: '',
      grade1: undefined,
      grade2: undefined
    });
  }

}
