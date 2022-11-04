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

import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogCommand} from '../../../../implementation/command/dialog-command';
import {DataSource} from '../../../../implementation/data/data-source';
import {StudentOutbound} from '../../../../implementation/models/student-outbound/student-outbound';
import {Student} from '../../../../implementation/models/student/student';
import {Teacher} from '../../../../implementation/models/teacher/teacher';
import {MultiItemCache} from '../../../../implementation/state-management/multi-item-cache';
import {SingleItemCache} from '../../../../implementation/state-management/single-item-cache';
import {MENTOR_COLLECTION_CACHE} from '../../../../providers/global-mentor-providers-factory';
import {STUDENT_DATA_SOURCE} from '../../../../providers/global-student-providers-factory';
import {TEACHER_COLLECTION_CACHE, TEACHER_INSTANCE_CACHE} from '../../../../providers/global-teacher-providers-factory';
import {Mentor} from '../../../mentor-manager/models/mentor/mentor';
import {MetaDataService} from '../../../shared/services/meta-data/meta-data.service';
import {STUDENT_ADD_TEACHER} from '../../providers/student-providers-factory';
import {ContactsStep} from './impl/contacts-step';
import {StudentDetailStep} from './impl/student-detail-step';
import {TeacherInputStep} from './impl/teacher-input-step';

@Component({
  selector: 'ms-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss'],
  providers: [
    {provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}}
  ]
})
export class StudentDialogComponent implements OnInit {
  contactsStep: ContactsStep
  studentDetailsStep: StudentDetailStep
  teacherInputStep: TeacherInputStep

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { model: Student },
    private formBuilder: FormBuilder,
    private metaDataService: MetaDataService,
    private dialogRef: MatDialogRef<StudentDialogComponent>,
    @Inject(MENTOR_COLLECTION_CACHE) public mentorCollectionCache: MultiItemCache<Mentor>,
    @Inject(TEACHER_INSTANCE_CACHE) public teacherInstanceCache: SingleItemCache<Teacher>,
    @Inject(TEACHER_COLLECTION_CACHE) public teacherCollectionCache: MultiItemCache<Teacher>,
    @Inject(STUDENT_DATA_SOURCE) private dataSource: DataSource<Student>,
    @Inject(STUDENT_ADD_TEACHER) private teacherDialogFactory: (dataSupplier) => DialogCommand<Teacher>,
  ) {}

  get teacherDialog(): DialogCommand<Teacher> {
    const command = this.teacherDialogFactory(() => {
      return {grade: this.studentDetailsStep.formGroup.get('grade').value}
    })
    return command
  }

  private get isUpdate(): boolean {
    return this.data?.model !== undefined && this.data?.model !== null
  }

  ngOnInit(): void {
    this.contactsStep = new ContactsStep(this.data?.model, this.formBuilder).init()
    this.studentDetailsStep = new StudentDetailStep(this.data?.model, this.formBuilder, this.metaDataService).init()
    this.teacherInputStep =
      new TeacherInputStep(this.data?.model, this.formBuilder, this.teacherInstanceCache, this.teacherCollectionCache).init()
  }

  save(): void {
    const item: Student = this.toModel()
    const value: Promise<Student> = this.isUpdate
      ? this.dataSource.update(item)
      : this.dataSource.add(item)
    value
      .then(result => {
        this.dialogRef.close(result)
        return result
      })
  }

  dismiss(): void {
    this.dialogRef.close(null)
  }

  allModelsAreValid(): boolean {
    return this.studentDetailsStep.formGroup.valid
      && this.contactsStep.formGroup.valid
      && this.teacherInputStep.formGroup.valid
  }

  private toModel(): Student {
    const joinedValues = Object.assign(
      this.studentDetailsStep.value,
      this.teacherInputStep.value,
      this.contactsStep.value,
    )
    const student: Student = new StudentOutbound(joinedValues)
    return student;
  }
}
