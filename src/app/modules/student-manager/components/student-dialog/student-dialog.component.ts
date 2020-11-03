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

import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Grade } from 'src/app/modules/shared/types/grade';
import { grades } from 'src/app/modules/shared/constants/grades';
import { CallerWithErrorHandling } from 'src/app/implementation/util/caller-with-error-handling';
import { Student } from '../../models/student/student';
import { StudentInbound } from '../../models/student-inbound/student-inbound';
import { StudentOutbound } from '../../models/student-outbound/student-outbound';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentRepositoryService } from '../../services/student/student-repository.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeacherRepositoryService } from 'src/app/modules/school-manager/services/teacher/teacher-repository.service'
import { LoggingService } from 'src/app/modules/shared/services/logging-service/logging.service';
import { Teacher } from 'src/app/modules/school-manager/models/teacher/teacher';
import { MetaDataService } from 'src/app/modules/shared/services/meta-data/meta-data.service';
import { Element } from 'src/app/modules/shared/models/meta-data/element';

@Component({
  selector: 'ms-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss']
})
export class StudentDialogComponent {

  model: FormGroup;
  isUpdate = false;

  schoolId: string;
  selectedGrade: string;

  teachers: Teacher[];
  grades: Grade[] = grades;
  contactMethods: string[] = ['Cellphone', 'Workphone', 'Email'];
  locations: string[] = ['Offline', 'Online', 'Both'];

  contactTypes = [
    { value: 'PARENT_GUARDIAN', valueView: 'Parent' },
    { value: 'GRANDPARENT', valueView: 'Grandparent' }
  ];

  interestList: Element[];
  leadershipTraitList: Element[];
  leadershipSkillList: Element[];
  behaviorList: Element[];

  private caller = new CallerWithErrorHandling<Student, StudentDialogComponent>();

  constructor(private dialogRef: MatDialogRef<StudentDialogComponent>,
              private studentService: StudentRepositoryService,
              private teacherService: TeacherRepositoryService,
              private logger: LoggingService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private metaDataService: MetaDataService,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.model);
    this.schoolId = data?.schoolId;

    metaDataService.loadInterests();
    metaDataService.interests.subscribe(interests => {
      this.interestList = interests;
    });

    metaDataService.loadLeadershipTraits();
    metaDataService.leadershipTraits.subscribe(leadershipTraits => {
      this.leadershipTraitList = leadershipTraits;
    });

    metaDataService.loadLeadershipSkills();
    metaDataService.leadershipSkills.subscribe(leadershipSkills => {
      this.leadershipSkillList = leadershipSkills;
    });

    metaDataService.loadBehaviors();
    metaDataService.behaviors.subscribe(behaviors => {
      this.behaviorList = behaviors;
    });

    this.addContact();
  }

  /* Get teacher data; to be displayed in a selection menu */
  ngOnInit() {
    console.log('School data', this.schoolId);
    this.teacherService.readAllTeachers(this.schoolId);
    this.teacherService.teachers.subscribe(teachers => {
      this.logger.log('Read teachers from school', teachers);
      this.teachers = teachers;
    });
  }

  save(): void {
    const newStudent = new StudentOutbound(this.model.value);
    let func: (item: StudentOutbound) => Promise<StudentInbound>;
    console.log('Saving student', newStudent);
    if (this.isUpdate) {
      //console.log('Updating', this.model.value);
      //newBook._links = this.model.value.book._links;
      //func = this.bookService.updateBook;
    } else {
      func = this.studentService.curriedCreateStudent(this.schoolId);
    }
    this.caller.callWithErrorHandling(this.studentService, func, newStudent, this.dialogRef, this.snackBar); 
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private determineUpdate(formData: any): boolean {
    return formData.model !== undefined && formData.model !== null;
  }

  private createModel(formBuilder: FormBuilder, student: StudentInbound): FormGroup {

    console.log('Student', student);
    const formGroup: FormGroup = formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      grade: ['', Validators.required],
      mediaReleaseSigned: false,
      preferredTime: [''],
      teacher: formBuilder.group({
        uri: ['', Validators.required],
        comment: ['']
      }),
      allergyInfo: [''],
      interests: [],
      leadershipTraits: [],
      leadershipSkills: [],
      behaviors: [],
      contacts: formBuilder.array([]),
      location: ['OFFLINE', Validators.required]
    });

    /*if (this.isUpdate) {
      formGroup.setValue({
        firstName: student?.firstName,
        lastName: student?.lastName,
        grade: student?.grade,
        mediaReleaseSigned: student?.mediaReleaseSigned,    
        preferredTime: student?.preferredTime,
        teacher: student?.teacher,
        allergyInfo: student?.allergyInfo,
        interests: student?.interests,
        leadershipTraits: student?.leadershipTraits,
        leadershipSkills: student?.leadershipSkills,
        behaviors: student?.behaviors,
        location: student?.location?.toString()
      });
    }*/

    return formGroup;
  }

  get contacts() {
    return this.model.get('contacts') as FormArray;
  }

  addContact() {
    this.contacts.push(this.createContactsFormGroup());
  }
  
  removeContact(i: number) {
    this.contacts.removeAt(i);
  }

  private createContactsFormGroup(): FormGroup {
    return this.formBuilder.group({
      type: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      workPhone: null,
      cellPhone: null,
      email: [null, [Validators.email, Validators.maxLength(50)]],
      preferredContactMethod: null,
      isEmergencyContact: false,
      comment: ['']
    });
  }

}

