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

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneFormatDirective } from './directives/phone-format.directive';
import { ConfimationDialogComponent } from './components/confimation-dialog/confimation-dialog.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { SelectionCountDisplayComponent } from './components/selection-count-display/selection-count-display.component';
import { SchoolCacheService } from './services/school/school-cache.service';
import { SchoolRepositoryService } from './services/school/school-repository.service';
import { LoggingService } from './services/logging-service/logging.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { MetaDataService } from './services/meta-data/meta-data.service';
import { BookRepositoryService } from './services/resources/book-repository.service';
import { GameRepositoryService } from './services/resources/game-repository.service';
import { SchoolBookRepositoryService } from './services/school-resource/school-book/school-book-repository.service';
import { SchoolGameRepositoryService } from './services/school-resource/school-game/school-game-repository.service';
import { SchoolBookCacheService } from './services/school-resource/school-book/school-book-cache.service';
import { SchoolGameCacheService } from './services/school-resource/school-game/school-game-cache.service';
import { SchoolBookListComponent } from './components/school-resource/school-book-list/school-book-list.component';
import { SchoolBookDialogComponent } from './components/school-resource/school-book-dialog/school-book-dialog.component';
import { SchoolGameDialogComponent } from './components/school-resource/school-game-dialog/school-game-dialog.component';
import { SchoolGameListComponent } from './components/school-resource/school-game-list/school-game-list.component';
import { RouterModule } from '@angular/router';
import { SchoolSessionCacheService } from './services/school-session/school-session-cache.service';
import { SchoolSessionRepositoryService } from './services/school-session/school-session-repository.service';

@NgModule({
  declarations: [
    // Components
    ConfimationDialogComponent,
    SchoolBookDialogComponent,
    SchoolBookListComponent,
    SchoolGameDialogComponent,
    SchoolGameListComponent,
    SelectionCountDisplayComponent,

    // Directives
    OnlyNumberDirective,
    PhoneFormatDirective,
  ],
  exports: [
    // Components
    ConfimationDialogComponent,
    SchoolBookDialogComponent,
    SchoolBookListComponent,
    SchoolGameDialogComponent,
    SchoolGameListComponent,
    SelectionCountDisplayComponent,

    // Directives
    OnlyNumberDirective,
    PhoneFormatDirective,

    // Modules
    CommonModule,
    FormsModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule
  ],
})
export class SharedModule {

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        // Services
        BookRepositoryService,
        GameRepositoryService,
        SchoolBookCacheService,
        SchoolBookRepositoryService,
        SchoolGameCacheService,
        SchoolGameRepositoryService,
        LoggingService,
        MetaDataService,
        SchoolCacheService,
        SchoolRepositoryService,
        SchoolSessionCacheService,
        SchoolSessionRepositoryService
      ]
    };
  }

}
