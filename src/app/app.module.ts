/*
 * Copyright 2020-2023 Aion Technology LLC
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
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DecoratedComponent} from './components/decorated/decorated.component';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {HomeComponent} from './components/home/home.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {NoopComponent} from './components/noop/noop.component';
import {QuotesComponent} from './components/quotes/quotes.component';
import {SchoolSelectorComponent} from './components/school-selector/school-selector.component';
import {ChangePasswordComponent} from './components/user-session/change-password/change-password.component';
import {ForgotPasswordStep1Component} from './components/user-session/forgot-password-step1/forgot-password-step1.component';
import {ForgotPasswordStep2Component} from './components/user-session/forgot-password-step2/forgot-password-step2.component';
import {LoginComponent} from './components/user-session/login/login.component';
import {LogoutNotificationComponent} from './components/user-session/logout-notification/logout-notification.component';
import {LogoutComponent} from './components/user-session/logout/logout.component';
import {GlobalErrorHandler} from './implementation/errors/global-error-handler';
import {IsAuthenticatedGuard} from './implementation/route/is-authenticated-guard.service';
import {IsProgramAdminGuard} from './implementation/route/is-program-admin-guard.service';
import {isSystemAdminGuard} from './implementation/route/is-system-admin-guard.service';
import {NavigationService} from './implementation/route/navigation.service';
import {CognitoService} from './implementation/security/cognito.service';
import {UserLoginService} from './implementation/security/user-login.service';
import {HttpErrorInterceptorService} from './implementation/services/http-error-interceptor.service';
import {MenuStateService} from './implementation/services/menu-state.service';
import {TokenInterceptorService} from './implementation/services/token-interceptor.service';
import {MaterialModule} from './implementation/shared/material.module';
import {SchoolLocalStorageLoader} from './implementation/state-management/school-local-storage-loader';
import {globalBookProvidersFactory} from './providers/global/global-book-providers-factory';
import {globalGameProvidersFactory} from './providers/global/global-game-providers-factory';
import {globalInterestProvidersFactory} from './providers/global/global-interest-providers-factory';
import {globalInvitationProvidersFactory} from './providers/global/global-invitation-providers-factory';
import {globalMentorProvidersFactory} from './providers/global/global-mentor-providers-factory';
import {globalPersonnelProvidersFactory} from './providers/global/global-personnel-providers-factory';
import {globalProgramAdminProvidersFactory} from './providers/global/global-program-admin-providers-factory';
import {globalSchoolBookProvidersFactory} from './providers/global/global-school-book-providers-factory';
import {globalSchoolGameProvidersFactory} from './providers/global/global-school-game-providers-factory';
import {globalSchoolProvidersFactory} from './providers/global/global-school-providers-factory';
import {globalSchoolSessionProvidersFactory} from './providers/global/global-school-session-providers-factory';
import {globalSnackbarProviders} from './providers/global/global-snackbar-providers';
import {globalStudentProvidersFactory} from './providers/global/global-student-providers-factory';
import {globalTeacherProvidersFactory} from './providers/global/global-teacher-providers-factory';

@NgModule({
  declarations: [
    // components
    AppComponent,
    ChangePasswordComponent,
    DecoratedComponent,
    FooterComponent,
    ForgotPasswordStep1Component,
    ForgotPasswordStep2Component,
    HeaderComponent,
    HomeComponent,
    LandingPageComponent,
    LoginComponent,
    LogoutComponent,
    LogoutNotificationComponent,
    NoopComponent,
    QuotesComponent,
    SchoolSelectorComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
  ],
  providers: [
    IsAuthenticatedGuard,
    IsProgramAdminGuard,
    isSystemAdminGuard,
    CognitoService,
    MenuStateService,
    NavigationService,
    SchoolLocalStorageLoader,
    UserLoginService,
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
    ...globalBookProvidersFactory(),
    ...globalGameProvidersFactory(),
    ...globalInterestProvidersFactory(),
    ...globalInvitationProvidersFactory(),
    ...globalMentorProvidersFactory(),
    ...globalSchoolProvidersFactory(),
    ...globalPersonnelProvidersFactory(),
    ...globalProgramAdminProvidersFactory(),
    ...globalSchoolBookProvidersFactory(),
    ...globalSchoolGameProvidersFactory(),
    ...globalSchoolSessionProvidersFactory(),
    ...globalSnackbarProviders(),
    ...globalStudentProvidersFactory(),
    ...globalTeacherProvidersFactory(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
