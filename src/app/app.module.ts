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

import {BrowserModule} from '@angular/platform-browser';
import {InjectionToken, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ActivatedRoute, ActivatedRouteSnapshot, RouteReuseStrategy, RouterModule, RouterOutlet, Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {MaterialModule} from './shared/material.module';
import {HomeComponent} from './components/home/home.component';
import {NoopComponent} from './components/noop/noop.component';
import {HandleLogoutComponent} from './components/handle-logout/handle-logout.component';
import {environment} from 'src/environments/environment';
import {HttpErrorInterceptorService} from './services/http-error-interceptor.service';
import {TokenInterceptorService} from './services/token-interceptor.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CanActivateSysAdmin} from './services/can-activate-sys-admin';
import {CanActivateApp} from './services/can-activate-app';
import {ReceiveTokenComponent} from './components/receive-token/receive-token.component';
import {CustomRouteReuseStrategy} from './shared/custom-route-reuse-strategy';
import {WorkflowManagerModule} from './modules/workflow-manager/workflow-manager.module';

const loginProvider = new InjectionToken('loginRedirectResolver');
const logoutProvider = new InjectionToken('logoutRedirectResolver');

const oauthScopes = 'openid profile';
const loginUrl = `https://${environment.cognitoBaseUrl}/login?client_id=${environment.cognitoClientId}&response_type=token&scope=${oauthScopes}&redirect_uri=${environment.tokenRedirect}`;
const logoutUrl = `https://${environment.cognitoBaseUrl}/logout?client_id=${environment.cognitoClientId}&logout_uri=${environment.logoutRedirect}`;

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'logout', component: NoopComponent, canActivate: [logoutProvider, CanActivateApp] },
  { path: 'home', component: HomeComponent, canActivate: [CanActivateApp] },
  { path: 'handleLogout', component: HandleLogoutComponent, canActivate: [CanActivateApp]
  },
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
  { path: 'receiveToken', component: ReceiveTokenComponent },
  { path: 'login', component: NoopComponent, canActivate: [loginProvider] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    SidenavComponent,
    ToolbarComponent,
    HomeComponent,
    NoopComponent,
    HandleLogoutComponent,
    ReceiveTokenComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'}),
    RouterOutlet,
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
    },
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
