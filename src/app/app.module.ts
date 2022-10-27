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

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ErrorHandler, InjectionToken, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, ActivatedRouteSnapshot, RouterModule, RouterOutlet, Routes} from '@angular/router';
import {environment} from 'src/environments/environment';
import {AppComponent} from './app.component';
import {HandleLogoutComponent} from './components/handle-logout/handle-logout.component';
import {HomeComponent} from './components/home/home.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {NoopComponent} from './components/noop/noop.component';
import {ReceiveTokenComponent} from './components/receive-token/receive-token.component';
import {SchoolSelectorComponent} from './components/school-selector/school-selector.component';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {SnackbarManager} from './implementation/command/snackbar-manager';
import {GlobalErrorHandler} from './implementation/errors/global-error-handler';
import {NavigationService} from './implementation/route/navigation.service';
import {CanActivateApp} from './implementation/services/can-activate-app';
import {CanActivateSysAdmin} from './implementation/services/can-activate-sys-admin';
import {HttpErrorInterceptorService} from './implementation/services/http-error-interceptor.service';
import {TokenInterceptorService} from './implementation/services/token-interceptor.service';
import {UserSessionService} from './implementation/services/user-session.service';
import {MaterialModule} from './implementation/shared/material.module';
import {globalBookProvidersFactory} from './providers/global-book-providers-factory';
import {globalGameProvidersFactory} from './providers/global-game-providers-factory';
import {globalMentorProvidersFactory} from './providers/global-mentor-providers-factory';
import {globalPersonnelProvidersFactory} from './providers/global-personnel-providers-factory';
import {globalProgramAdminProvidersFactory} from './providers/global-program-admin-providers-factory';
import {globalSchoolBookProvidersFactory} from './providers/global-school-book-providers-factory';
import {globalSchoolGameProvidersFactory} from './providers/global-school-game-providers-factory';
import {globalSchoolProvidersFactory} from './providers/global-school-providers-factory';
import {globalSchoolSessionProvidersFactory} from './providers/global-school-session-providers-factory';
import {globalStudentProvidersFactory} from './providers/global-student-providers-factory';
import {globalTeacherProvidersFactory} from './providers/global-teacher-providers-factory';
import { BackArrowComponent } from './components/back-arrow/back-arrow.component';

const LOGIN_PROVIDER = new InjectionToken('loginRedirectResolver');
const LOGOUT_PROVIDER = new InjectionToken('logoutRedirectResolver');

const oauthScopes = 'openid profile';
const loginUrl = `https://${environment.cognitoBaseUrl}/login?client_id=${environment.cognitoClientId}&response_type=token&scope=${oauthScopes}&redirect_uri=${environment.tokenRedirect}`;
const logoutUrl = `https://${environment.cognitoBaseUrl}/logout?client_id=${environment.cognitoClientId}&logout_uri=${environment.logoutRedirect}`;

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'logout', component: NoopComponent, canActivate: [LOGOUT_PROVIDER, CanActivateApp]},
  {path: 'home', component: HomeComponent, canActivate: [CanActivateApp]},
  {path: 'handleLogout', component: HandleLogoutComponent, canActivate: [CanActivateApp]},
  {
    path: 'adminmanager',
    loadChildren: () => import('./modules/admin-manager/admin-manager.module').then(m => m.AdminManagerModule),
    canActivate: [CanActivateSysAdmin]
  },
  {
    path: 'resourcemanager',
    loadChildren: () => import('./modules/resource-manager/resource-manager.module').then(m => m.ResourceManagerModule),
    canActivate: [CanActivateApp]
  },
  {
    path: 'schoolsmanager',
    loadChildren: () => import('./modules/school-manager/school-manager.module').then(m => m.SchoolManagerModule),
    canActivate: [CanActivateApp]
  },
  {
    path: 'studentmanager',
    loadChildren: () => import('./modules/student-manager/student-manager.module').then(m => m.StudentManagerModule),
    canActivate: [CanActivateApp]
  },
  {
    path: 'mentormanager',
    loadChildren: () => import('./modules/mentor-manager/mentor-manager.module').then(m => m.MentorManagerModule),
    canActivate: [CanActivateApp]
  },
  {
    path: 'workflowmanager',
    loadChildren: () => import('./modules/workflow-manager/workflow-manager.module').then(m => m.WorkflowManagerModule)
  },
  {path: 'receiveToken', component: ReceiveTokenComponent},
  {path: 'login', component: NoopComponent, canActivate: [LOGIN_PROVIDER]},
  {path: '**', redirectTo: ''}
];

export const SNACKBAR_MANAGER = new InjectionToken<SnackbarManager>('snackbar-manager');

@NgModule({
  declarations: [
    // components
    AppComponent,
    BackArrowComponent,
    HandleLogoutComponent,
    HomeComponent,
    LandingPageComponent,
    NoopComponent,
    ReceiveTokenComponent,
    SchoolSelectorComponent,
    SidenavComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'}),
    RouterOutlet,
  ],
  providers: [
    NavigationService,
    UserSessionService,
    {
      provide: LOGIN_PROVIDER,
      useValue: (route: ActivatedRouteSnapshot) => {window.open(loginUrl, '_self')}
    },
    {
      provide: LOGOUT_PROVIDER,
      useValue: (route: ActivatedRoute) => {window.open(logoutUrl, '_self')}
    },
    {
      provide: 'TOKEN_REDIRECT',
      useValue: environment.tokenRedirect
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    ...globalSchoolProvidersFactory(),
    ...globalPersonnelProvidersFactory(),
    ...globalProgramAdminProvidersFactory(),
    ...globalTeacherProvidersFactory(),
    ...globalMentorProvidersFactory(),
    ...globalStudentProvidersFactory(),
    ...globalBookProvidersFactory(),
    ...globalGameProvidersFactory(),
    ...globalSchoolBookProvidersFactory(),
    ...globalSchoolGameProvidersFactory(),
    ...globalSchoolSessionProvidersFactory(),
    {
      provide: SNACKBAR_MANAGER,
      useFactory: (snackbar: MatSnackBar) => new SnackbarManager(snackbar),
      deps: [MatSnackBar]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
