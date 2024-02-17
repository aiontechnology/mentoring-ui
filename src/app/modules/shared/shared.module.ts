/*
 * Copyright 2020-2024 Aion Technology LLC
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
import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {RouterModule} from '@angular/router'
import {DialogManager} from '@implementation/command/dialog-manager';
import {BackArrowComponent} from '@modules-shared/components/back-arrow/back-arrow.component'
import {ConfirmationDialogComponent} from '@modules-shared/components/confirmation-dialog/confirmation-dialog.component'
import {DecoratedComponent} from '@modules-shared/components/decorated/decorated.component'
import {DialogContainerComponent} from '@modules-shared/components/dialog/dialog-container/dialog-container.component'
import {FileTabComponent} from '@modules-shared/components/file-tab/file-tab.component'
import {FooterComponent} from '@modules-shared/components/footer/footer.component'
import {GradeLevelComponent} from '@modules-shared/components/grade-level/grade-level.component'
import {HeaderComponent} from '@modules-shared/components/header/header.component'
import {InviteStudentComponent} from '@modules-shared/components/invite-student/invite-student.component';
import {ListDataContainerComponent} from '@modules-shared/components/list-data-container/list-data-container.component'
import {ListFooterComponent} from '@modules-shared/components/list-footer/list-footer.component'
import {ListViewHeaderComponent} from '@modules-shared/components/list-view-header/list-view-header.component'
import {MenuComponent} from '@modules-shared/components/menu/menu.component'
import {NotificationComponent} from '@modules-shared/components/notification/notification.component'
import {SchoolSelectorComponent} from '@modules-shared/components/school-selector/school-selector.component'
import {SearchComponent} from '@modules-shared/components/seach/search.component'
import {SelectionCountDisplayComponent} from '@modules-shared/components/selection-count-display/selection-count-display.component'
import {SpinnerComponent} from '@modules-shared/components/spinner/spinner.component'
import {TabbedContainerComponent} from '@modules-shared/components/tabbed-container/tabbed-container.component'
import {OnlyNumberDirective} from '@modules-shared/directives/only-number.directive'
import {PhoneFormatDirective} from '@modules-shared/directives/phone-format.directive'
import {workflowProvidersFactory} from '@modules-shared/providers/workflow-providers-factory';
import {MetaDataService} from '@modules-shared/services/meta-data/meta-data.service'
import {standAloneDialogManagerProviders} from '@providers/dialog/stand-alone-dialog-manager-providers';
import {MaterialModule} from 'src/app/implementation/shared/material.module'

// Tokens
export const INVITATION_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<InviteStudentComponent>>('invitation-edit-dialog-manager')

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
        ...standAloneDialogManagerProviders<InviteStudentComponent>(INVITATION_EDIT_DIALOG_MANAGER, InviteStudentComponent),
        MetaDataService
      ]
    };
  }

}
