/*
 * Copyright 2022 Aion Technology LLC
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

import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {grades} from '../../../../implementation/constants/grades';
import {DataSource} from '../../../../implementation/data/data-source';
import {UriSupplier} from '../../../../implementation/data/uri-supplier';
import {Teacher} from '../../../../implementation/models/teacher/teacher';
import {StudentRegistration} from '../../../../implementation/models/workflow/student-registration';
import {StudentRegistrationLookup} from '../../../../implementation/models/workflow/student-registration-lookup';
import {Grade} from '../../../../implementation/types/grade';
import {LinkService} from '../../../shared/services/link-service/link.service';
import {REGISTRATION_DATA_SOURCE, REGISTRATION_LOOKUP_DATA_SOURCE, REGISTRATION_URI_SUPPLIER} from '../../../shared/shared.module';

@Component({
  selector: 'ms-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StudentRegistrationComponent implements OnInit {

  model: FormGroup;
  registration: StudentRegistrationLookup;

  constructor(
    @Inject(REGISTRATION_LOOKUP_DATA_SOURCE) private registrationLookupDataSource: DataSource<StudentRegistrationLookup>,
    @Inject(REGISTRATION_DATA_SOURCE) private registrationDataSource: DataSource<StudentRegistration>,
    @Inject(REGISTRATION_URI_SUPPLIER) private registrationUriSuppler: UriSupplier,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  get today(): string {
    return new Date().toDateString();
  }

  /**
   * Get the array of grades that are used to populate the grade dropdown list.
   */
  get grades(): Grade[] {
    return grades;
  }

  get teachers(): Teacher[] {
    const grade = Number(this.model.get('grade')?.value);
    if (!grade) {
      return [];
    } else {
      const teachers: Teacher[] = this.registration.teachers
        .filter(t => (t.grade1 === grade || t.grade2 === grade));
      return teachers;
    }
  }

  selfLinkFunction(): (object: any) => string {
    return LinkService.selfLink;
  }

  submitForm(): void {
    const studentRegistration = new StudentRegistration(
      this.model.get('studentFirstName').value,
      this.model.get('studentLastName').value,
      this.model.get('grade').value,
      this.model.get('parent1FirstName').value,
      this.model.get('parent1LastName').value,
      this.model.get('parent1PhoneNumber')?.value,
      this.model.get('parent1EmailAddress')?.value,
      this.model.get('parent1PreferredContactMethod')?.value,
      this.model.get('parent2FirstName')?.value,
      this.model.get('parent2LastName')?.value,
      this.model.get('parent2PhoneNumber')?.value,
      this.model.get('parent2EmailAddress')?.value,
      this.model.get('parent2PreferredContactMethod')?.value,
      this.model.get('teacher')?.value,
      this.model.get('preferredSession')?.value,
      this.model.get('emergencyContactFirstName')?.value,
      this.model.get('emergencyContactLastName')?.value,
      this.model.get('emergencyContactPhone')?.value,
      this.model.get('parentSignature').value,
      this.registration.links,
    );
    const that = this;
    console.log('That', that);
    this.registrationDataSource.update(studentRegistration)
      .then(() => {
        this.router.navigate(['./thanks'], {
          relativeTo: that.route,
          queryParams: {name: this.model.get('studentFirstName').value}
        })
          .then(() => console.log('Navigated to thank you page'));
      });
  }

  ngOnInit(): void {
    this.model = this.createModel(this.formBuilder);
    this.route.paramMap
      .subscribe(params => {
        const registrationId = params.get('registrationId');
        this.registrationUriSuppler.withSubstitution('schoolId', params.get('schoolId'));
        this.registrationLookupDataSource.oneValue(registrationId)
          .then(registration => {
            this.registration = registration;
            this.updateModel(registration);
          });
      })
  }

  private updateModel(registration: StudentRegistrationLookup) {
    const model = Object.assign({}, this.model.value, {
      studentFirstName: registration.studentFirstName || '',
      studentLastName: registration.studentLastName || '',
      parent1FirstName: registration.parent1FirstName || '',
      parent1LastName: registration.parent1LastName || '',
      parent1EmailAddress: registration.parent1EmailAddress || '',
      parent1PreferredContactMethod: registration.parent1EmailAddress ? 'EMAIL' : ''
    });
    this.model.setValue(model);
  }

  private createModel(formBuilder: FormBuilder) {
    return formBuilder.group({
      studentFirstName: ['', [Validators.required, Validators.maxLength(50)]],
      studentLastName: ['', [Validators.required, Validators.maxLength(50)]],
      grade: ['', Validators.required],
      parent1FirstName: ['', [Validators.required, Validators.maxLength(50)]],
      parent1LastName: ['', [Validators.required, Validators.maxLength(50)]],
      parent1PhoneNumber: [''],
      parent1EmailAddress: ['', [Validators.maxLength(50)]],
      parent1PreferredContactMethod: ['', [Validators.required]],
      parent2FirstName: ['', [Validators.maxLength(50)]],
      parent2LastName: ['', [Validators.maxLength(50)]],
      parent2PhoneNumber: [''],
      parent2EmailAddress: ['', [Validators.maxLength(50)]],
      parent2PreferredContactMethod: [''],
      teacher: [''],
      preferredSession: [''],
      emergencyContactFirstName: [''],
      emergencyContactLastName: [''],
      emergencyContactPhone: [''],
      parentSignature: ['', Validators.required]
    }, {validators: contactValidator});
  }
}

const contactValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const parent1EmailAddress = control.get('parent1EmailAddress')?.value;
  const parent1PhoneNumber = control.get('parent1PhoneNumber')?.value;
  return !parent1EmailAddress && !parent1PhoneNumber
    ? {contactInvalid: true}
    : null;
};
