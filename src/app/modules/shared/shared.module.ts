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

import {LayoutModule} from '@angular/cdk/layout';
import {CommonModule} from '@angular/common';
import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MaterialModule} from 'src/app/implementation/shared/material.module';
import {environment} from '../../../environments/environment';
import {Cache} from '../../implementation/data/cache';
import {DataSource} from '../../implementation/data/data-source';
import {Repository} from '../../implementation/data/repository';
import {UriSupplier} from '../../implementation/data/uri-supplier';
import {Teacher} from '../school-manager/models/teacher/teacher';
import {Invitation} from '../school-manager/models/workflow/invitation';
import {StudentRegistration} from '../school-manager/models/workflow/student-registration';
import {StudentRegistrationLookup} from '../school-manager/models/workflow/student-registration-lookup';
import {StudentRegistrationLookupRepository} from '../school-manager/repositories/student-registration-lookup-repository';
import {StudentRegistrationRepository} from '../school-manager/repositories/student-registration-repository';
import {Student} from '../student-manager/models/student/student';
import {StudentRepository} from '../student-manager/repositories/student-repository';
import {StudentCacheService} from '../student-manager/services/student/student-cache.service';
import {ConfimationDialogComponent} from './components/confimation-dialog/confimation-dialog.component';
import {SelectionCountDisplayComponent} from './components/selection-count-display/selection-count-display.component';
import {OnlyNumberDirective} from './directives/only-number.directive';
import {PhoneFormatDirective} from './directives/phone-format.directive';
import {InvitationRepository} from '../../implementation/repositories/invitation-repository';
import {MetaDataService} from './services/meta-data/meta-data.service';

export const INVITATION_DATA_SOURCE = new InjectionToken<DataSource<Invitation>>('invitation-data-source');
export const INVITATION_URI_SUPPLIER = new InjectionToken<UriSupplier>('invitation-uri-supplier');

export const REGISTRATION_LOOKUP_DATA_SOURCE = new InjectionToken<DataSource<StudentRegistrationLookup>>('registration-lookup-data-source');
export const REGISTRATION_DATA_SOURCE = new InjectionToken<DataSource<StudentRegistration>>('registration-data-source');
export const REGISTRATION_URI_SUPPLIER = new InjectionToken<UriSupplier>('registration-uri-supplier');

export const STUDENT_DATA_SOURCE = new InjectionToken<DataSource<Student>>('student-data-source');
export const STUDENT_CACHE = new InjectionToken<Cache<Student>>('student-cache');
export const STUDENT_URI_SUPPLIER = new InjectionToken<UriSupplier>('student-uri-supplier');

@NgModule({
  declarations: [
    // Components
    ConfimationDialogComponent,
    SelectionCountDisplayComponent,

    // Directives
    OnlyNumberDirective,
    PhoneFormatDirective,
  ],
  exports: [
    // Components
    ConfimationDialogComponent,
    SelectionCountDisplayComponent,

    // Directives
    OnlyNumberDirective,
    PhoneFormatDirective,

    // Modules
    CommonModule,
    FormsModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        /* Invitation resources */
        {
          provide: INVITATION_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/invitations`)
        },
        InvitationRepository,
        {
          provide: INVITATION_DATA_SOURCE,
          useFactory: (repository: Repository<Invitation>) => new DataSource<Invitation>(repository),
          deps: [InvitationRepository]
        },

        /* Mentor resources */

        /* Registration resources */
        {
          provide: REGISTRATION_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/registrations`)
        },
        StudentRegistrationLookupRepository,
        {
          provide: REGISTRATION_LOOKUP_DATA_SOURCE,
          useFactory: (repository: Repository<StudentRegistrationLookup>) => new DataSource<StudentRegistrationLookup>(repository),
          deps: [StudentRegistrationLookupRepository]
        },
        StudentRegistrationRepository,
        {
          provide: REGISTRATION_DATA_SOURCE,
          useFactory: (repository: Repository<StudentRegistration>) => new DataSource<StudentRegistration>(repository),
          deps: [StudentRegistrationRepository]
        },

        /* Student resources */
        {
          provide: STUDENT_URI_SUPPLIER,
          useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/students`)
        },
        StudentRepository,
        {
          provide: STUDENT_CACHE,
          useFactory: () => new Cache<Student>()
        },
        {
          provide: STUDENT_DATA_SOURCE,
          useFactory: (repository: Repository<Student>, cache: Cache<Student>) => new DataSource<Student>(repository, cache),
          deps: [StudentRepository, STUDENT_CACHE]
        },
        StudentCacheService,

        // Services
        MetaDataService
      ]
    };
  }

}
