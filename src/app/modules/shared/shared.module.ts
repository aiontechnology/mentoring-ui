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

import {LayoutModule} from '@angular/cdk/layout'
import {CommonModule} from '@angular/common'
import {ModuleWithProviders, NgModule} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {RouterModule} from '@angular/router'
import {MaterialModule} from 'src/app/implementation/shared/material.module'
import {BackArrowComponent} from './components/back-arrow/back-arrow.component'
import {ConfirmationDialogComponent} from './components/confirmation-dialog/confirmation-dialog.component'
import {DecoratedComponent} from './components/decorated/decorated.component'
import {DialogContainerComponent} from './components/dialog/dialog-container/dialog-container.component'
import {FileTabComponent} from './components/file-tab/file-tab.component'
import {FooterComponent} from './components/footer/footer.component'
import {GradeLevelComponent} from './components/grade-level/grade-level.component'
import {HeaderComponent} from './components/header/header.component'
import {ListDataContainerComponent} from './components/list-data-container/list-data-container.component'
import {ListFooterComponent} from './components/list-footer/list-footer.component'
import {ListViewHeaderComponent} from './components/list-view-header/list-view-header.component'
import {MenuComponent} from './components/menu/menu.component'
import {NotificationComponent} from './components/notification/notification.component'
import {SchoolSelectorComponent} from './components/school-selector/school-selector.component'
import {SearchComponent} from './components/seach/search.component'
import {SelectionCountDisplayComponent} from './components/selection-count-display/selection-count-display.component'
import {SpinnerComponent} from './components/spinner/spinner.component'
import {TabbedContainerComponent} from './components/tabbed-container/tabbed-container.component'
import {OnlyNumberDirective} from './directives/only-number.directive'
import {PhoneFormatDirective} from './directives/phone-format.directive'
import {workflowProvidersFactory} from './providers/workflow-providers-factory';
import {MetaDataService} from './services/meta-data/meta-data.service'

@NgModule({
  declarations: [
    // Components
    BackArrowComponent,
    ConfirmationDialogComponent,
    DecoratedComponent,
    DialogContainerComponent,
    FileTabComponent,
    FooterComponent,
    GradeLevelComponent,
    HeaderComponent,
    ListDataContainerComponent,
    ListFooterComponent,
    ListViewHeaderComponent,
    MenuComponent,
    SchoolSelectorComponent,
    SearchComponent,
    SelectionCountDisplayComponent,
    SpinnerComponent,
    TabbedContainerComponent,

    // Directives
    OnlyNumberDirective,
    PhoneFormatDirective,
    NotificationComponent,
  ],
  exports: [
    // Components
    BackArrowComponent,
    ConfirmationDialogComponent,
    DecoratedComponent,
    DialogContainerComponent,
    FileTabComponent,
    FooterComponent,
    GradeLevelComponent,
    HeaderComponent,
    ListDataContainerComponent,
    ListFooterComponent,
    ListViewHeaderComponent,
    MenuComponent,
    SchoolSelectorComponent,
    SearchComponent,
    SelectionCountDisplayComponent,
    SpinnerComponent,
    TabbedContainerComponent,

    // Directives
    OnlyNumberDirective,
    PhoneFormatDirective,

    // Modules
    CommonModule,
    FormsModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    NotificationComponent,
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
        ...workflowProvidersFactory(),
        MetaDataService
      ]
    };
  }

}
