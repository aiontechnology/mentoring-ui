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
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '@components/home/home.component';
import {LandingPageComponent} from '@components/landing-page/landing-page.component';
import {ChangePasswordComponent} from '@components/user-session/change-password/change-password.component';
import {ForgotPasswordStep1Component} from '@components/user-session/forgot-password-step1/forgot-password-step1.component';
import {ForgotPasswordStep2Component} from '@components/user-session/forgot-password-step2/forgot-password-step2.component';
import {LoginComponent} from '@components/user-session/login/login.component';
import {LogoutComponent} from '@components/user-session/logout/logout.component';
import {IsAuthenticatedGuard} from '@implementation/route/is-authenticated-guard.service';
import {isSystemAdminGuard} from '@implementation/route/is-system-admin-guard.service';
import {DecoratedComponent} from '@modules-shared/components/decorated/decorated.component';

const routes: Routes = [
  {
    path: '', component: DecoratedComponent, children: [
      {path: '', component: LandingPageComponent},
      {path: 'home', component: HomeComponent, canActivate: [IsAuthenticatedGuard]},
      {
        path: 'adminmanager',
        loadChildren: () => import('./modules/admin-manager/admin-manager.module').then(m => m.AdminManagerModule),
        canActivate: [isSystemAdminGuard]
      },
      {
        path: 'resourcemanager',
        loadChildren: () => import('./modules/resource-manager/resource-manager.module').then(m => m.ResourceManagerModule),
        canActivate: [IsAuthenticatedGuard]
      },
      {
        path: 'schoolsmanager',
        loadChildren: () => import('./modules/school-manager/school-manager.module').then(m => m.SchoolManagerModule),
        canActivate: [IsAuthenticatedGuard]
      },
      {
        path: 'studentmanager',
        loadChildren: () => import('./modules/student-manager/student-manager.module').then(m => m.StudentManagerModule),
        canActivate: [IsAuthenticatedGuard]
      },
      {
        path: 'mentormanager',
        loadChildren: () => import('./modules/mentor-manager/mentor-manager.module').then(m => m.MentorManagerModule),
        canActivate: [IsAuthenticatedGuard]
      },
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'change-password', component: ChangePasswordComponent},
  {path: 'reset-password', component: ForgotPasswordStep1Component},
  {path: 'reset-password/:email', component: ForgotPasswordStep2Component},
  {
    path: 'workflowmanager',
    loadChildren: () => import('./modules/workflow-manager/workflow-manager.module')
      .then(m => m.WorkflowManagerModule)
  },
  {path: '**', redirectTo: ''}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
