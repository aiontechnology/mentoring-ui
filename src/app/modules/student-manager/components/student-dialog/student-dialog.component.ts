/**
 * Copyright 2020 - 2021 Aion Technology LLC
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
import { Student } from '../../models/student/student';
import { StudentInbound } from '../../models/student-inbound/student-inbound';
import { StudentOutbound } from '../../models/student-outbound/student-outbound';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentRepositoryService } from '../../services/student/student-repository.service';
import { TeacherRepositoryService } from 'src/app/modules/school-manager/services/teacher/teacher-repository.service';
import { LoggingService } from 'src/app/modules/shared/services/logging-service/logging.service';
import { Teacher } from 'src/app/modules/school-manager/models/teacher/teacher';
import { MetaDataService } from 'src/app/modules/shared/services/meta-data/meta-data.service';
import { MentorRepositoryService } from 'src/app/modules/mentor-manager/services/mentor/mentor-repository.service';
import { Mentor } from 'src/app/modules/mentor-manager/models/mentor/mentor';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { personLocations } from 'src/app/modules/shared/constants/locations';
import { NewDialogCommand } from 'src/app/implementation/command/new-dialog-command';
import { TeacherDialogComponent } from 'src/app/modules/school-manager/components/teacher-dialog/teacher-dialog.component';
import { MentorDialogComponent } from 'src/app/modules/mentor-manager/components/mentor-dialog/mentor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ms-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss'],
  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } }
  ]
})
export class StudentDialogComponent implements OnInit {

  model: FormGroup;
  studentDetails: FormGroup;
  teacherInput: FormGroup;
  contacts: FormGroup;

  isUpdate = false;

  schoolId: string;
  selectedGrade: string;

  teachers$: Observable<Teacher[]>;
  mentors$: Observable<Mentor[]>;
  grades: Grade[] = grades;
  contactMethods: string[] = ['Phone', 'Email', 'Either'];
  locations: { [key: string]: string };

  interestList$: Observable<string[]>;
  leadershipTraitList$: Observable<string[]>;
  leadershipSkillList$: Observable<string[]>;
  behaviorList$: Observable<string[]>;

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  newTeacherCommand: NewDialogCommand<TeacherDialogComponent, Teacher>;
  newMentorCommand: NewDialogCommand<MentorDialogComponent, Mentor>;

  constructor(private dialogRef: MatDialogRef<StudentDialogComponent>,
              private studentService: StudentRepositoryService,
              private teacherService: TeacherRepositoryService,
              private mentorService: MentorRepositoryService,
              private logger: LoggingService,
              private formBuilder: FormBuilder,
              private metaDataService: MetaDataService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.isUpdate = this.determineUpdate(data);

    this.model = this.createModel(formBuilder, data?.model);
    this.studentDetails = this.model.get('studentDetails') as FormGroup;
    this.teacherInput = this.model.get('teacherInput') as FormGroup;
    this.contacts = this.model.get('contacts') as FormGroup;

    this.schoolId = data?.schoolId;
    this.locations = personLocations;

    /**
     * Opens teacher creation dialog with a fixed grade.
     */
    this.newTeacherCommand = new NewDialogCommand(
      'Add Teacher',
      'teacher',
      TeacherDialogComponent,
      'Teacher added',
      null,
      { schoolId: this.schoolId, selectedGrade: () => this.selectedGrade },
      null,
      this.dialog,
      this.snackBar,
      (t: Teacher) => this.addNewTeacher(t),
      () => true);

    this.newMentorCommand = new NewDialogCommand(
      'Add Mentor',
      'mentor',
      MentorDialogComponent,
      'Mentor added',
      null,
      { schoolId: this.schoolId },
      null,
      this.dialog,
      this.snackBar,
      (m: Mentor) => this.addNewMentor(m),
      () => true);

  }

  /* Get teacher data; to be displayed in a selection menu */
  ngOnInit(): void {

    this.metaDataService.loadInterests();
    this.interestList$ = this.metaDataService.interests;

    this.metaDataService.loadLeadershipTraits();
    this.leadershipTraitList$ = this.metaDataService.leadershipTraits;

    this.metaDataService.loadLeadershipSkills();
    this.leadershipSkillList$ = this.metaDataService.leadershipSkills;

    this.metaDataService.loadBehaviors();
    this.behaviorList$ = this.metaDataService.behaviors;

    this.loadAllTeachers();

    this.loadAllMentors();

  }

  save(): void {

    // Create outbound student.
    const studentProperties = Object.assign(this.studentDetails.value, { teacher: this.teacherInput.value.teacher }, this.contacts.value);
    this.addContactsProperty(studentProperties);
    this.clearMentorIfNotProvided(studentProperties);
    this.reformatDate(studentProperties);

    const newStudent = new StudentOutbound(studentProperties);
    let value: Promise<StudentInbound>;

    console.log('Saving student', newStudent);
    if (this.isUpdate) {
      console.log('Updating', studentProperties);
      value = this.studentService.updateStudent(newStudent);
    } else {
      value = this.studentService.createStudent(this.schoolId, newStudent);
    }

    value.then((s: Student) => {
      this.dialogRef.close(s);
    });

  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  // Used for the keyvalue pipe, to keep location properties in their default order.
  unsorted(): number {
    return 0;
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
        studentId: ['', Validators.maxLength(20)],
        grade: ['', Validators.required],
        preBehavioralAssessment: ['', [Validators.min(0), Validators.max(45)]],
        postBehavioralAssessment: ['', [Validators.min(0), Validators.max(45)]],
        mediaReleaseSigned: false,
        month: [''],
        year: ['', Validators.min(1900)],
        preferredTime: ['', Validators.maxLength(30)],
        actualTime: ['', Validators.maxLength(30)],
        mentor: formBuilder.group({
          uri: ['']
        }),
        interests: [],
        leadershipSkills: [],
        leadershipTraits: [],
        behaviors: [],
        location: ['OFFLINE', Validators.required],
        _links: null
      }),
      teacherInput: formBuilder.group({
        teacher: formBuilder.group({
          uri: ['', Validators.required],
          comment: ['', Validators.maxLength(500)]
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
          studentId: student?.studentId,
          grade: student?.grade?.toString(),
          preBehavioralAssessment: student?.preBehavioralAssessment,
          postBehavioralAssessment: student?.postBehavioralAssessment,
          mediaReleaseSigned: student?.mediaReleaseSigned,
          month: this.getMonth(student?.startDate),
          year: this.getYear(student?.startDate),
          preferredTime: student?.preferredTime,
          actualTime: student?.actualTime,
          mentor: {
            uri: student?.mentor?.mentor?._links?.self[0]?.href
          },
          interests: student?.interests,
          leadershipSkills: student?.leadershipSkills,
          leadershipTraits: student?.leadershipTraits,
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

      const parents = student?.contacts?.filter(contact => {
        return !contact?.isEmergencyContact;
      });
      const emergencyContact = student?.contacts?.filter(contact => {
        return contact?.isEmergencyContact;
      });

      if (emergencyContact.length) {
        const contacts = formGroup.get('contacts') as FormGroup;
        contacts.addControl('emergencyContact', this.createContactForm(true));
        (formGroup.get('contacts.emergencyContact') as FormGroup).setValue(emergencyContact[0]);
      }

      // Instantiate parent/guardian and emergencyContact in form.
      const parentsFormArray = formGroup.get('contacts.parents') as FormArray;
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

  /**
   * Reset #teacher form value when grade is changed.
   */
  onGradeSelected(): void {
    const teacher = this.teacherInput.get('teacher') as FormGroup;
    teacher.patchValue({ uri: '' });
  }

  stepperAtStart(index: number): boolean {
    return index === 0;
  }

  stepperAtFinish(index: number): boolean {
    return index === 2;
  }

  private createContactForm(isEmergencyContact?: boolean): FormGroup {

    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      label: [null, [Validators.maxLength(50)]],
      phone: null,
      email: [null, [Validators.email, Validators.maxLength(50)]],
      preferredContactMethod: null,
      isEmergencyContact,
      comment: ['']
    }, {
      validators: this.noContactMethodValidator()
    });

  }

  private noContactMethodValidator(): ValidatorFn {

    return (contact: FormGroup): {[key: string]: any} | null => {

      const errorMsg = 'You must provide at least one contact method.';

      const phone = contact.get('phone');
      const email = contact.get('email');

      if (!phone.value && !email.value) {
        return { noContacts: { msg: errorMsg } };
      }

      return null;

    };

  }

  /**
   * Parses a date string and returns the month's name.
   */
  private getMonth(str: string): string {
    const date = new Date(str);
    return str ? this.months[date.getUTCMonth()] : null;
  }

  /**
   * Parses a date string and returns the year.
   */
  private getYear(str: string): string {
    const date = new Date(str);
    return str ? date.getUTCFullYear().toString() : null;
  }

  /**
   * Converts the start date into a valid API date object.
   */
  private reformatDate(student: any): void {
    if (student.month === null || !student.year) {
      student['startDate'] = null;
      return;
    }
    const m = this.months.indexOf(student?.month);
    student['startDate'] = new Date(student?.year, m);
  }

  private loadAllTeachers(): void {
    console.log('School data', this.schoolId);
    this.teacherService.readAllTeachers(this.schoolId);
    this.teachers$ = this.teacherService.teachers.pipe(
      tap(teachers => this.logger.log('Read teachers from school', teachers))
    );
  }

  private addNewTeacher(t: Teacher): void {

    this.loadAllTeachers();

    const teacher = new Teacher(t);
    const teacherInput = this.teacherInput.get('teacher') as FormGroup;
    teacherInput.patchValue({ uri: teacher.getSelfLink() });

  }

  private loadAllMentors(): void {
    console.log('Mentor data', this.schoolId);
    this.mentorService.readAllMentors(this.schoolId);
    this.mentors$ = this.mentorService.mentors.pipe(
      tap(mentors => this.logger.log('Read mentors from school', mentors))
    );
  }

  private addNewMentor(m: Mentor): void {

    this.loadAllMentors();

    const mentor = new Mentor(m);
    const mentorInput = this.studentDetails.get('mentor') as FormGroup;
    mentorInput.patchValue({ uri: mentor.getSelfLink() });

  }

}
