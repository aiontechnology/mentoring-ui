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

import { Component, Inject, OnInit, OnChanges, Output} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Grade } from 'src/app/modules/shared/types/grade';
import { grades } from 'src/app/modules/shared/constants/grades';
import { CallerWithErrorHandling } from 'src/app/implementation/util/caller-with-error-handling';
import { Student } from '../../models/student/student';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentRepositoryService } from '../../services/student/student-repository.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeacherRepositoryService } from 'src/app/modules/school-manager/services/teacher/teacher-repository.service'
import { LoggingService } from 'src/app/modules/shared/services/logging-service/logging.service';
import { Teacher } from 'src/app/modules/school-manager/models/teacher/teacher';

@Component({
  selector: 'ms-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss']
})
export class StudentDialogComponent {

  @Output() valueChange

  model: FormGroup;
  isUpdate = false;

  teachers: Teacher[];
  grades: Grade[] = grades;
  selectedGrade: string;
  locations: string[] = ['Offline', 'Online', 'Both'];

  //interestList: Element[];
  //leadershipTraitList: Element[];
  //leadershipSkillList: Element[];
  //behavior: Element;

  private caller = new CallerWithErrorHandling<Student, StudentDialogComponent>();

  constructor(private dialogRef: MatDialogRef<StudentDialogComponent>,
              private studentService: StudentRepositoryService,
              private teacherService: TeacherRepositoryService,
              private logger: LoggingService,
              // private metaDataService: MetaDataService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.isUpdate = this.determineUpdate(null);//data);
    this.model = this.createModel(formBuilder, null);//data?.model);
  }

  /* Get teacher data; to be displayed in a selection menu */
  ngOnInit() {
    console.log('School data', this.data?.id);
    this.teacherService.readAllTeachers(this.data?.id);
    this.teacherService.teachers.subscribe(teachers => {
      this.logger.log('Read teachers from school', teachers);
      this.teachers = teachers;
    });
  }

  save(): void {
    // Save student's info.
  }
  
  dismiss(): void {
    this.dialogRef.close(null);
  }

  /* teachersInSelectedGrade(): Teacher[] {
    if (this.selectedGrade == null) {
      return [];
    }
    return this.teachers.filter(
      teacher => teacher.grade1?.toString() === this.selectedGrade || 
      teacher.grade2?.toString() === this.selectedGrade
    );
  } */

  private createModel(formBuilder: FormBuilder, student: Student): FormGroup {
    console.log('Student', student);
    const formGroup: FormGroup = formBuilder.group({
      student,
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      mediaReleaseSigned: [''],    
      gradeLevel: ['', [Validators.required]],
      // TODO: preferred time
      teacher: ['', [Validators.required]],
      location: ['OFFLINE', Validators.required]
    });
    if (this.isUpdate) {
      formGroup.setValue({
        student,
        firstName: student?.firstName,
        lastName: student?.lastName,
        mediaReleaseSigned: [''],
        gradeLevel: [''],
        //TODO: preferred time
        teacher: student?.teacher?.firstName + ' ' + student?.teacher?.lastName,
        location: student?.location?.toString()
      });
    }
    return formGroup;
  }

  private determineUpdate(formData: any): boolean {
    return formData !== undefined && formData !== null;
  }

}
