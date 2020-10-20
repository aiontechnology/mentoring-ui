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

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneFormatPipe } from './pipes/phone-format.pipe';
import { PhoneFormatDirective } from './directives/phone-format.directive';
import { ConfimationDialogComponent } from './components/confimation-dialog/confimation-dialog.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { SelectionCountDisplayComponent } from './components/selection-count-display/selection-count-display.component';
import { SchoolCacheService } from './services/school/school-cache.service';
import { SchoolRepositoryService } from './services/school/school-repository.service';
import { LoggingService } from './services/logging-service/logging.service';

@NgModule({
  declarations: [
    ConfimationDialogComponent,
    OnlyNumberDirective,
    PhoneFormatDirective,
    PhoneFormatPipe,
    SelectionCountDisplayComponent
  ],
  providers: [
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ConfimationDialogComponent,
    OnlyNumberDirective,
    PhoneFormatDirective,
    PhoneFormatPipe,
    SelectionCountDisplayComponent
  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        LoggingService,
        SchoolCacheService,
        SchoolRepositoryService
      ]
    };
  }

}
