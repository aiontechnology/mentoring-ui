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

import {InjectionToken, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StudentRegistrationComponent} from './components/student-registration/student-registration.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {DataSource} from '../../implementation/data/data-source';
import {StudentRegistrationLookup} from '../school-manager/models/workflow/student-registration-lookup';
import {UriSupplier} from '../../implementation/data/uri-supplier';
import {environment} from '../../../environments/environment';
import {StudentRegistrationLookupRepository} from '../school-manager/repositories/student-registration-lookup-repository';
import {Repository} from '../../implementation/data/repository';
import {StudentRegistration} from '../school-manager/models/workflow/student-registration';
import {StudentRegistrationRepository} from '../school-manager/repositories/student-registration-repository';
import { StudentRegistrationThanksComponent } from './components/student-registration-thanks/student-registration-thanks.component';

const routes: Routes = [
  { path: 'schools/:schoolId/registrations/:registrationId', component: StudentRegistrationComponent },
  { path: 'schools/:schoolId/registrations/:registrationId/thanks', component: StudentRegistrationThanksComponent },
];

export const REGISTRATION_LOOKUP_DATA_SOURCE = new InjectionToken<DataSource<StudentRegistrationLookup>>('registration-lookup-data-source');
export const REGISTRATION_DATA_SOURCE = new InjectionToken<DataSource<StudentRegistration>>('registration-data-source');
export const REGISTRATION_URI_SUPPLIER = new InjectionToken<UriSupplier>('registration-uri-supplier');

@NgModule({
  declarations: [
    StudentRegistrationComponent,
    StudentRegistrationThanksComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  providers: [
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
  ]
})
export class WorkflowManagerModule {
}
