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

import {InjectionToken, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CanActivateProgAdmin} from 'src/app/implementation/services/can-activate-prog-admin';
import {CanActivateSysAdmin} from 'src/app/implementation/services/can-activate-sys-admin';
import {Command} from '../../implementation/command/command';
import {SCHOOL_ID} from '../../implementation/route/route-constants';
import {TableCache} from '../../implementation/table-cache/table-cache';
import {globalMentorProvidersFactory} from '../../providers/global/global-mentor-providers-factory';
import {globalSchoolProvidersFactory} from '../../providers/global/global-school-providers-factory';
import {School} from '../../models/school/school';
import {SharedModule} from '../shared/shared.module';
import {MentorDetailComponent} from './components/mentor-detail/mentor-detail.component';
import {MentorDialogComponent} from './components/mentor-dialog/mentor-dialog.component';
import {MentorListComponent} from './components/mentor-list/mentor-list.component';
import {MentorManagerComponent} from './mentor-manager.component';
import {mentorProvidersFactory} from './providers/mentor-providers-factory';

const routes: Routes = [
  {
    path: '', component: MentorManagerComponent, children: [
      {path: '', component: MentorListComponent},
      {path: `schools/:${SCHOOL_ID}`, component: MentorListComponent},
      {path: `schools/:${SCHOOL_ID}/mentors/:mentorId`, component: MentorDetailComponent},
      {path: 'mentors/:mentorId', component: MentorDetailComponent},
    ]
  }
];

// Menus
export const MENTOR_DETAIL_MENU = new InjectionToken<Command[]>('mentor-detail-menu')
export const MENTOR_LIST_MENU = new InjectionToken<Command[]>('mentor-list-menu')

// Groups
export const MENTOR_GROUP = 'mentor'

@NgModule({
  declarations: [
    MentorDetailComponent,
    MentorDialogComponent,
    MentorListComponent,
    MentorManagerComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
  ],
  providers: [
    ...mentorProvidersFactory(),
  ]
})
export class MentorManagerModule {
}
