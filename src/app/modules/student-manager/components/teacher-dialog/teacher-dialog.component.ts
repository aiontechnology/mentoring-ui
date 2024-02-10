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

import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {DialogComponent} from '../../../../implementation/component/dialog-component';
import {grades} from '../../../../implementation/constants/grades';
import {DataSource} from '../../../../implementation/data/data-source';
import {emailAddressValidator} from '../../../../implementation/forms/email-address-validator';
import {phoneValidator} from '../../../../implementation/forms/phone-validator';
import {MultiItemCache} from '../../../../implementation/state-management/multi-item-cache';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {Grade} from '../../../../implementation/types/grade';
import {Teacher} from '../../../../models/teacher/teacher';
import {
  TEACHER_COLLECTION_CACHE,
  TEACHER_DATA_SOURCE,
  TEACHER_INSTANCE_CACHE
} from '../../../../providers/global/global-teacher-providers-factory';

@Component({
  selector: 'ms-teacher-dialog',
  templateUrl: './teacher-dialog.component.html',
  styleUrls: ['./teacher-dialog.component.scss']
})
export class TeacherDialogComponent extends DialogComponent<Teacher, TeacherDialogComponent> implements OnInit {
  grades: Grade[] = grades;

  constructor(
    // for super
    @Inject(MAT_DIALOG_DATA) public data: { model: Teacher, panelTitle: string, grade: number },
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<TeacherDialogComponent>,
    @Inject(TEACHER_DATA_SOURCE) teacherDataSource: DataSource<Teacher>,
    // other
    @Inject(TEACHER_INSTANCE_CACHE) private teacherInstanceCache: SingleItemCache<Teacher>,
    @Inject(TEACHER_COLLECTION_CACHE) private teacherCollectionCache: MultiItemCache<Teacher>,
  ) {
    super(data?.model, formBuilder, dialogRef, teacherDataSource)
  }

  ngOnInit(): void {
    this.init()
  }

  protected postDialogClose(teacher: Teacher) {
    this.teacherCollectionCache.load()
      .then((teachers) => {
        this.teacherInstanceCache.item = teacher
      })
  }

  protected toModel(formValue: any): Teacher {
    const teacher: Teacher = new Teacher(formValue);
    teacher.grade1 = this.data?.grade
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
      cellPhone: [null, phoneValidator()],
      email: [null, [emailAddressValidator(), Validators.maxLength(50)]],
      grade1: [{value: this.data?.grade, disabled: true}, [Validators.required]],
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
