/*
 * Copyright 2022-2023 Aion Technology LLC
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

import {NgModule} from '@angular/core';
import {
  StudentPostAssessmentComponent
} from '@modules-workflow-manager/components/student-post-assessment/student-post-assessment.component';
import {SharedModule} from '../shared/shared.module';
import {InvalidLink} from './components/registration-invalid/invalid-link.component';
import {StudentInformationThanksComponent} from './components/student-information-thanks/student-information-thanks.component';
import {StudentInformationComponent} from './components/student-information/student-information.component';
import {StudentRegistrationCancelledComponent} from './components/student-registration-cancelled/student-registration-cancelled.component';
import {StudentRegistrationThanksComponent} from './components/student-registration-thanks/student-registration-thanks.component';
import {StudentRegistrationComponent} from './components/student-registration/student-registration.component';
import {WorkflowRoutingModule} from './workflow-routing.module';

@NgModule({
  declarations: [
    InvalidLink,
    StudentInformationComponent,
    StudentInformationThanksComponent,
    StudentPostAssessmentComponent,
    StudentRegistrationCancelledComponent,
    StudentRegistrationComponent,
    StudentRegistrationThanksComponent,
  ],
  imports: [
    WorkflowRoutingModule,
    SharedModule.forRoot()
  ],
})
export class WorkflowManagerModule {
}
