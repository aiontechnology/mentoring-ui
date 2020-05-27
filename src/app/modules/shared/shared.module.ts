/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneFormatPipe } from './pipes/phone-format.pipe';
import { PhoneFormatDirective } from './directives/phone-format.directive';
import { ConfimationDialogComponent } from './components/confimation-dialog/confimation-dialog.component';
import { MaterialModule } from 'src/app/shared/material.module';

@NgModule({
  declarations: [
    ConfimationDialogComponent,
    PhoneFormatDirective,
    PhoneFormatPipe
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    PhoneFormatDirective,
    PhoneFormatPipe
  ]
})
export class SharedModule { }
