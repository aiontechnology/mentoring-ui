/*
 * Copyright 2023 Aion Technology LLC
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

import {InjectionToken} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {DataSource} from '../../../implementation/data/data-source';
import {Repository} from '../../../implementation/data/repository';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {StudentInfoRepository, StudentInfoRepository2} from '../../../implementation/repositories/student-info-repository';
import {StudentInformationLookupRepository} from '../../../implementation/repositories/student-information-lookup-repository';
import {StudentRegistrationLookupRepository} from '../../../implementation/repositories/student-registration-lookup-repository';
import {StudentRegistrationRepository} from '../../../implementation/repositories/student-registration-repository';
import {BaseUri} from '../../../models/workflow/base-uri';
import {StudentInformation} from '../../../models/workflow/student-information';
import {StudentInformationLookup} from '../../../models/workflow/student-information-lookup';
import {StudentRegistration} from '../../../models/workflow/student-registration';
import {StudentRegistrationLookup} from '../../../models/workflow/student-registration-lookup';

export const REGISTRATION_LOOKUP_DATA_SOURCE = new InjectionToken<DataSource<StudentRegistrationLookup>>('registration-lookup-data-source')
export const REGISTRATION_DATA_SOURCE = new InjectionToken<DataSource<StudentRegistration>>('registration-data-source')
export const REGISTRATION_URI_SUPPLIER = new InjectionToken<UriSupplier>('registration-uri-supplier')
export const STUDENT_INFO_URI_SUPPLIER = new InjectionToken<UriSupplier>('student-info-uri-supplier')
export const STUDENT_INFO_LOOKUP_DATA_SOURCE = new InjectionToken<DataSource<StudentInformationLookup>>('student-info-lookup-data-source')
export const STUDENT_INFO_DATA_SOURCE = new InjectionToken<DataSource<StudentInformation>>('student-info-data-source')
export const STUDENT_INFO2_DATA_SOURCE = new InjectionToken<DataSource<BaseUri>>('student-info2-data-source')

export function workflowProvidersFactory() {
  return [
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

    /* Student Information */
    {
      provide: STUDENT_INFO_URI_SUPPLIER,
      useFactory: () => new UriSupplier(`${environment.apiUri}/api/v1/schools/{schoolId}/students/{studentId}/registrations`)
    },
    StudentInformationLookupRepository,
    {
      provide: STUDENT_INFO_LOOKUP_DATA_SOURCE,
      useFactory: (repository: Repository<StudentInformationLookup>) => new DataSource<StudentInformationLookup>(repository),
      deps: [StudentInformationLookupRepository]
    },
    StudentInfoRepository,
    {
      provide: STUDENT_INFO_DATA_SOURCE,
      useFactory: (repository: Repository<StudentInformation>) => new DataSource<StudentInformation>(repository),
      deps: [StudentInfoRepository]
    },
    StudentInfoRepository2,
    {
      provide: STUDENT_INFO2_DATA_SOURCE,
      useFactory: (repository: Repository<BaseUri>) => new DataSource<BaseUri>(repository),
      deps: [StudentInfoRepository2]
    }
  ]
}
