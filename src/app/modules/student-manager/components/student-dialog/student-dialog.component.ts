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

import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Grade} from 'src/app/modules/shared/types/grade';
import {grades} from 'src/app/modules/shared/constants/grades';
import {Student} from '../../models/student/student';
import {StudentInbound} from '../../models/student-inbound/student-inbound';
import {StudentOutbound} from '../../models/student-outbound/student-outbound';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {StudentRepositoryService} from '../../services/student/student-repository.service';
import {Teacher} from 'src/app/modules/school-manager/models/teacher/teacher';
import {MetaDataService} from 'src/app/modules/shared/services/meta-data/meta-data.service';
import {Mentor} from 'src/app/modules/mentor-manager/models/mentor/mentor';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {Observable} from 'rxjs';
import {personLocations} from 'src/app/modules/shared/constants/locations';
import {NewDialogCommand} from 'src/app/implementation/command/new-dialog-command';
import {TeacherDialogComponent} from 'src/app/modules/school-manager/components/teacher-dialog/teacher-dialog.component';
import {MentorDialogComponent} from 'src/app/modules/mentor-manager/components/mentor-dialog/mentor-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LinkService} from 'src/app/modules/shared/services/link-service/link.service';
import {DataSource} from '../../../../implementation/data/data-source';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {
  MENTOR_DATA_SOURCE,
  MENTOR_URI_SUPPLIER,
  STUDENT_DATA_SOURCE,
  TEACHER_DATA_SOURCE,
  TEACHER_URI_SUPPLIER
} from '../../../shared/shared.module';
import {RouteWatchingService} from '../../../../services/route-watching.service';

@Component({
  selector: 'ms-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss'],
  providers: [
    RouteWatchingService,
    {provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}}
  ]
})
export class StudentDialogComponent implements OnInit {

  model: UntypedFormGroup;
  studentDetails: UntypedFormGroup;
  teacherInput: UntypedFormGroup;
  contacts: UntypedFormGroup;

  isUpdate = false;

  schoolId: string;
  selectedGrade: string;

  teachers$: Promise<Teacher[]>;
  mentors$: Promise<Mentor[]>;
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

  constructor(@Inject(STUDENT_DATA_SOURCE) private studentDataSource: DataSource<Student>,
              @Inject(TEACHER_DATA_SOURCE) private teacherDataSource: DataSource<Teacher>,
              @Inject(TEACHER_URI_SUPPLIER) private teacherUriSupplier: UriSupplier,
              @Inject(MENTOR_DATA_SOURCE) private mentorDataSource: DataSource<Mentor>,
              @Inject(MENTOR_URI_SUPPLIER) private mentorUriSupplier: UriSupplier,
              private dialogRef: MatDialogRef<StudentDialogComponent>,
              private formBuilder: UntypedFormBuilder,
              private metaDataService: MetaDataService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.isUpdate = this.determineUpdate(data);

    this.model = this.createModel(formBuilder, data?.model);
    this.studentDetails = this.model.get('studentDetails') as UntypedFormGroup;
    this.teacherInput = this.model.get('teacherInput') as UntypedFormGroup;
    this.contacts = this.model.get('contacts') as UntypedFormGroup;

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
      {schoolId: this.schoolId, selectedGrade: () => this.selectedGrade},
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
      {schoolId: this.schoolId},
      null,
      this.dialog,
      this.snackBar,
      (m: Mentor) => this.addNewMentor(m),
      () => true);
  }

  get parents() {
    return this.contacts.get('parents') as UntypedFormArray;
  }

  get emergencyContact() {
    return this.contacts.get('emergencyContact') as UntypedFormGroup;
  }

  /* Get teacher data; to be displayed in a selection menu */
  ngOnInit = (): void => {
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

  save = (): void => {
    // Create outbound student.
    const studentProperties = Object.assign(this.studentDetails.value, {teacher: this.teacherInput.value.teacher}, this.contacts.value);
    this.addContactsProperty(studentProperties);
    this.clearMentorIfNotProvided(studentProperties);
    this.reformatDate(studentProperties);

    const newStudent = new StudentOutbound(studentProperties);
    let value: Promise<StudentInbound>;

    if (this.isUpdate) {
      value = this.studentDataSource.update(newStudent);
    } else {
      value = this.studentDataSource.add(newStudent);
    }

    value.then((s: Student) => {
      this.dialogRef.close(s);
    });
  }

  dismiss = (): void => {
    this.dialogRef.close(null);
  }

  // Used for the keyvalue pipe, to keep location properties in their default order.
  unsorted = (): number => {
    return 0;
  }

  enableTeacher = (): void => {
    if (this.selectedGrade) {
      this.teacherInput.get('teacher.uri').enable();
    }
  }

  contactsIsEmpty = (): boolean => {
    return !this.parents.length && !this.emergencyContact;
  }

  contactsIsFull = (): boolean => {
    return this.parents.controls.length >= 2 && this.emergencyContact != null;
  }

  parentsIsFull = (): boolean => {
    return this.parents.length >= 2;
  }

  addParent = (): void => {
    this.parents.push(this.createContactForm(false));
  }

  addEmergencyContact = (): void => {
    this.contacts.addControl('emergencyContact', this.createContactForm(true));
  }

  removeParent = (i: number): void => {
    this.parents.removeAt(i);
  }

  removeEmergencyContact = (): void => {
    this.contacts.removeControl('emergencyContact');
  }

  /**
   * Reset #teacher form value when grade is changed.
   */
  onGradeSelected = (): void => {
    const teacher = this.teacherInput.get('teacher') as UntypedFormGroup;
    teacher.patchValue({uri: ''});
  }

  stepperAtStart = (index: number): boolean => {
    return index === 0;
  }

  stepperAtFinish = (index: number): boolean => {
    return index === 2;
  }

  /*
   * Combine form's contact properties for backend model.
   */
  private addContactsProperty = (modelValue: any): void => {
    const e = modelValue.emergencyContact ? modelValue.emergencyContact : [];
    modelValue.contacts = modelValue.parents.concat(e);
  }

  private clearMentorIfNotProvided = (modelValue: any): void => {
    const mentor = modelValue.mentor;
    modelValue.mentor = (mentor.uri == null || mentor.uri === '') ? null : mentor;
  }

  private determineUpdate = (formData: any): boolean => {
    return formData.model !== undefined && formData.model !== null;
  }

  private createModel = (formBuilder: UntypedFormBuilder, student: StudentInbound): UntypedFormGroup => {

    const formGroup: UntypedFormGroup = formBuilder.group({
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
        links: null
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
            uri: LinkService.selfLink(student?.mentor?.mentor)
          },
          interests: student?.interests,
          leadershipSkills: student?.leadershipSkills,
          leadershipTraits: student?.leadershipTraits,
          behaviors: student?.behaviors,
          location: student?.location?.toString(),
          links: student.links
        },
        teacherInput: {
          teacher: {
            uri: LinkService.selfLink(student?.teacher?.teacher),
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
        const contacts = formGroup.get('contacts') as UntypedFormGroup;
        contacts.addControl('emergencyContact', this.createContactForm(true));
        (formGroup.get('contacts.emergencyContact') as UntypedFormGroup).setValue(emergencyContact[0]);
      }

      // Instantiate parent/guardian and emergencyContact in form.
      const parentsFormArray = formGroup.get('contacts.parents') as UntypedFormArray;
      parents.forEach((contact, index) => {
        parentsFormArray.push(this.createContactForm(false));
        (parentsFormArray.at(index) as UntypedFormGroup).setValue(contact);
      });

    }

    return formGroup;
  }

  private createContactForm = (isEmergencyContact?: boolean): UntypedFormGroup => {

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

  private noContactMethodValidator = (): ValidatorFn => {
    return (contact: UntypedFormGroup): { [key: string]: any } | null => {

      const errorMsg = 'You must provide at least one contact method.';

      const phone = contact.get('phone');
      const email = contact.get('email');

      if (!phone.value && !email.value) {
        return {noContacts: {msg: errorMsg}};
      }

      return null;

    };
  }

  /**
   * Parses a date string and returns the month's name.
   */
  private getMonth = (str: string): string => {
    const date = new Date(str);
    return str ? this.months[date.getUTCMonth()] : null;
  }

  /**
   * Parses a date string and returns the year.
   */
  private getYear = (str: string): string => {
    const date = new Date(str);
    return str ? date.getUTCFullYear().toString() : null;
  }

  /**
   * Converts the start date into a valid API date object.
   */
  private reformatDate = (student: any): void => {
    if (student.month === null || !student.year) {
      student.startDate = null;
      return;
    }
    const m = this.months.indexOf(student?.month);
    student.startDate = new Date(student?.year, m);
  }

  private loadAllTeachers = (): void => {
    this.teachers$ = this.teacherDataSource.allValues();
  }

  private addNewTeacher = (t: Teacher): void => {
    this.loadAllTeachers();

    const teacher = new Teacher(t);
    const teacherInput = this.teacherInput.get('teacher') as UntypedFormGroup;
    teacherInput.patchValue({uri: LinkService.selfLink(teacher)});
  }

  private loadAllMentors = (): void => {
    this.mentorUriSupplier.withSubstitution('schoolId', this.schoolId);
    this.mentors$ = this.mentorDataSource.allValues();
  }

  private addNewMentor = (m: Mentor): void => {
    this.loadAllMentors();

    const mentor = new Mentor(m);
    const mentorInput = this.studentDetails.get('mentor') as UntypedFormGroup;
    mentorInput.patchValue({uri: mentor.getSelfLink()});
  }

}
