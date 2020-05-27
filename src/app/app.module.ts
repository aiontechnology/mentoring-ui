/**
 * Copyright 2020 Aion Technology LLC
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
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MaterialModule } from './shared/material.module';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'schoolsmanager', loadChildren: () => import('./modules/schoolmanager/school-manager.module').then(m => m.SchoolManagerModule) }
];

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    SidenavComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MaterialModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
