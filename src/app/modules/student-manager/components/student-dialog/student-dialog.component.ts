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
import { FormGroup, FormBuilder, Validators, ValidatorFn, FormArray } from '@angular/forms';
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
import { MentorRepositoryService } from 'src/app/modules/mentor-manager/services/mentor/mentor-repository.service';
import { Mentor } from 'src/app/modules/mentor-manager/models/mentor/mentor';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper'

@Component({
  selector: 'ms-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class StudentDialogComponent {

  model: FormGroup;
  studentDetails: FormGroup;
  teacherInput: FormGroup;
  contacts: FormGroup;

  isUpdate = false;

  schoolId: string;
  selectedGrade: string;

  teachers: Teacher[];
  mentors: Mentor[];
  grades: Grade[] = grades;
  contactMethods: string[] = ['Cellphone', 'Workphone', 'Email'];
  locations: string[] = ['Offline', 'Online', 'Both'];

  contactTypes = [
    { value: 'PARENT_GUARDIAN', valueView: 'Parent' },
    { value: 'GRANDPARENT', valueView: 'Grandparent' }
  ];

  interestList: string[];
  leadershipTraitList: string[];
  leadershipSkillList: string[];
  behaviorList: string[];

  private caller = new CallerWithErrorHandling<Student, StudentDialogComponent>();

  constructor(private dialogRef: MatDialogRef<StudentDialogComponent>,
              private studentService: StudentRepositoryService,
              private teacherService: TeacherRepositoryService,
              private mentorService: MentorRepositoryService,
              private logger: LoggingService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private metaDataService: MetaDataService,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.isUpdate = this.determineUpdate(data);

    this.model = this.createModel(formBuilder, data?.model);
    this.studentDetails = this.model.get('studentDetails') as FormGroup;
    this.teacherInput = this.model.get('teacherInput') as FormGroup;
    this.contacts = this.model.get('contacts') as FormGroup;

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

  }

  /* Get teacher data; to be displayed in a selection menu */
  ngOnInit(): void {

    console.log('School data', this.schoolId);
    this.teacherService.readAllTeachers(this.schoolId);
    this.teacherService.teachers.subscribe(teachers => {
      this.logger.log('Read teachers from school', teachers);
      this.teachers = teachers;
    });

    console.log('Mentor data', this.schoolId);
    this.mentorService.readAllMentors(this.schoolId);
    this.mentorService.mentors.subscribe(mentors => {
      this.logger.log('Read mentors from school', mentors);
      this.mentors = mentors;
    });

  }

  save(): void {

    // Create outbound student.
    let studentProperties = Object.assign(this.studentDetails.value, { teacher: this.teacherInput.value.teacher }, this.contacts.value);
    this.addContactsProperty(studentProperties);
    this.clearMentorIfNotProvided(studentProperties);

    const newStudent = new StudentOutbound(studentProperties);
    let func: (item: StudentOutbound) => Promise<StudentInbound>;
    console.log('Saving student', newStudent);

    if (this.isUpdate) {
      console.log('Updating', studentProperties);
      func = this.studentService.updateStudent;
    } else {
      func = this.studentService.curriedCreateStudent(this.schoolId);
    }

    this.caller.callWithErrorHandling(this.studentService, func, newStudent, this.dialogRef, this.snackBar); 

  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  /*
   * Combine form's contact properties for backend model.
   */
  private addContactsProperty(modelValue: any): void {
    const e = modelValue.emergencyContact ? modelValue.emergencyContact : [];
    modelValue['contacts'] = modelValue.parents.concat(e);
  }

  private clearMentorIfNotProvided(modelValue: any): void {
    const mentor = modelValue.mentor;
    modelValue.mentor = (mentor.uri == null || mentor.uri === '') ? null : mentor;
  }

  private determineUpdate(formData: any): boolean {
    return formData.model !== undefined && formData.model !== null;
  }

  private createModel(formBuilder: FormBuilder, student: StudentInbound): FormGroup {

    console.log('Student', student);
    const formGroup: FormGroup = formBuilder.group({
      studentDetails: formBuilder.group({
        student,
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.maxLength(50)]],
        grade: ['', Validators.required],
        mediaReleaseSigned: false,
        startDate: [''],
        preferredTime: [''],
        mentor: formBuilder.group({
          uri: [''],
          time: ['']
        }),
        interests: [],
        leadershipTraits: [],
        leadershipSkills: [],
        behaviors: [],
        location: ['OFFLINE', Validators.required],
        _links: null
      }),
      teacherInput: formBuilder.group({
        teacher: formBuilder.group({
          uri: [{ value: '', disabled: true }, Validators.required],
          comment: ['']
        }),
      }),
      contacts: formBuilder.group({
        parents: formBuilder.array([])
      }),
    });

    if (this.isUpdate) {

      this.selectedGrade = student?.grade?.toString();
      formGroup.patchValue({
        studentDetails: {
          student,
          firstName: student?.firstName,
          lastName: student?.lastName,
          grade: student?.grade?.toString(),
          mediaReleaseSigned: student?.mediaReleaseSigned,
          startDate: student?.startDate,
          preferredTime: student?.preferredTime,
          mentor: {
            uri: student?.mentor?.mentor?._links?.self[0]?.href,
            time: student?.mentor?.time
          },
          interests: student?.interests,
          leadershipTraits: student?.leadershipTraits,
          leadershipSkills: student?.leadershipSkills,
          behaviors: student?.behaviors,
          location: student?.location?.toString(),
          _links: student._links
        },
        teacherInput: {
          teacher: {
            uri: student?.teacher?.teacher?._links?.self[0]?.href,
            comment: student?.teacher?.comment
          },
        },
      });

      // Enable teacher, since its value has been set.
      formGroup.get('teacherInput.teacher.uri').enable();

      let parents = student?.contacts?.filter(contact => {
        return !contact?.isEmergencyContact;
      });
      let emergencyContact = student?.contacts?.filter(contact => {
        return contact?.isEmergencyContact;
      })

      if (emergencyContact.length) {
        let contacts = formGroup.get('contacts') as FormGroup;
        contacts.addControl('emergencyContact', this.createContactForm(true));
        (formGroup.get('contacts.emergencyContact') as FormGroup).setValue(emergencyContact[0]);
      }

      // Instantiate parent/guardian and emergencyContact in form.
      let parentsFormArray = formGroup.get('contacts.parents') as FormArray;
      parents.forEach((contact, index) => {
        parentsFormArray.push(this.createContactForm(false));
        (parentsFormArray.at(index) as FormGroup).setValue(contact);
      });

    }

    return formGroup;

  }

  enableTeacher(): void {
    if (this.selectedGrade) {
      this.teacherInput.get('teacher.uri').enable();
    }
  }

  get parents() {
    return this.contacts.get('parents') as FormArray;
  }

  get emergencyContact() {
    return this.contacts.get('emergencyContact') as FormGroup;
  }

  contactsIsEmpty(): boolean {
    return !this.parents.length && !this.emergencyContact;
  }

  contactsIsFull(): boolean {
    return this.parents.controls.length >= 2 && this.emergencyContact != null;
  }

  parentsIsFull(): boolean {
    return this.parents.length >= 2;
  }

  addParent(): void {
    this.parents.push(this.createContactForm(false));
  }
  
  addEmergencyContact(): void {
    this.contacts.addControl('emergencyContact', this.createContactForm(true));
  }

  removeParent(i: number): void {
    this.parents.removeAt(i);
  }

  removeEmergencyContact(): void {
    this.contacts.removeControl('emergencyContact');
  }

  private createContactForm(isEmergencyContact?: boolean): FormGroup {
    let relation = '';
    if (!isEmergencyContact) {
      relation = 'PARENT_GUARDIAN';
    }

    return this.formBuilder.group({
      type: [relation, Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      workPhone: null,
      cellPhone: null,
      email: [null, [Validators.email, Validators.maxLength(50)]],
      preferredContactMethod: null,
      isEmergencyContact: isEmergencyContact,
      comment: ['']
    }, {
      validators: this.noContactMethodValidator()
    });

  }

  noContactMethodValidator(): ValidatorFn {

    return (contact: FormGroup): {[key: string]: any} | null => {

      const errorMsg = 'You must provide at least one contact method.';

      const workPhone = contact.get('workPhone');
      const cellPhone = contact.get('cellPhone');
      const email = contact.get('email');

      if (!workPhone.value && !cellPhone.value && !email.value) {
        return { noContacts: { msg: errorMsg } };
      }

      return null;

    };

  }

  /*
   * Reset #teacher form value when grade is changed.
   */
  onGradeSelected(): void {
    let teacher = this.teacherInput.get('teacher') as FormGroup;
    teacher.patchValue({ uri: '' });
  }

}
