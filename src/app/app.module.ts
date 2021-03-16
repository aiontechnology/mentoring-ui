/**
 * Copyright 2020 - 2021 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MaterialModule } from './shared/material.module';
import { ReceiveTokenComponent } from './components/receive-token/receive-token.component';
import { NoopComponent } from './components/noop/noop.component';
import { HandleLogoutComponent } from './components/handle-logout/handle-logout.component';
import { environment } from 'src/environments/environment';
import { HttpErrorInterceptorService } from './services/http-error-interceptor.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CanActivateRoute } from './services/can-activate-admin-module';

const loginProvider = new InjectionToken('loginRedirectResolver');
const logoutProvider = new InjectionToken('logoutRedirectResolver');

const oauthScopes = 'openid profile';
const loginUrl = `https://${environment.cognitoBaseUrl}/login?client_id=${environment.cognitoClientId}&response_type=token&scope=${oauthScopes}&redirect_uri=${environment.tokenRedirect}`;
const logoutUrl = `https://${environment.cognitoBaseUrl}/logout?client_id=${environment.cognitoClientId}&logout_uri=${environment.logoutRedirect}`;

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: NoopComponent, canActivate: [loginProvider] },
  { path: 'logout', component: NoopComponent, canActivate: [logoutProvider] },
  { path: 'receiveToken', component: ReceiveTokenComponent },
  { path: 'handleLogout', component: HandleLogoutComponent },
  { path: 'adminmanager', loadChildren: () => import('./modules/admin-manager/admin-manager.module')
    .then(m => m.AdminManagerModule), canActivate: [CanActivateRoute]},
  { path: 'resourcemanager', loadChildren: () => import('./modules/resource-manager/resource-manager.module')
    .then(m => m.ResourceManagerModule) },
  { path: 'schoolsmanager', loadChildren: () => import('./modules/school-manager/school-manager.module')
    .then(m => m.SchoolManagerModule) },
  { path: 'studentmanager', loadChildren: () => import('./modules/student-manager/student-manager.module')
    .then(m => m.StudentManagerModule) },
  { path: 'mentormanager', loadChildren: () => import('./modules/mentor-manager/mentor-manager.module')
    .then(m => m.MentorManagerModule) }
];

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    SidenavComponent,
    ToolbarComponent,
    ReceiveTokenComponent,
    NoopComponent,
    HandleLogoutComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {
      provide: loginProvider,
      useValue: (route: ActivatedRouteSnapshot) => {
        window.open(loginUrl, '_self');
      }
    },
    {
      provide: logoutProvider,
      useValue: (route: ActivatedRoute) => {
        window.open(logoutUrl, '_self');
      }
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
