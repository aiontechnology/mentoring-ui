/*
 * Copyright 2022 Aion Technology LLC
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

import {InjectionToken} from '@angular/core';
import {DialogManager} from '../../../implementation/command/dialog-manager';
import {Cache} from '../../../implementation/data/cache';
import {DataSource} from '../../../implementation/data/data-source';
import {UriSupplier} from '../../../implementation/data/uri-supplier';
import {Mentor} from '../../../models/mentor/mentor';
import {School} from '../../../models/school/school';
import {SchoolChangeDataSourceResetter} from '../../../implementation/state-management/school-change-data-source-resetter';
import {SingleItemCacheSchoolChangeHandler} from '../../../implementation/state-management/single-item-cache-school-change-handler';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {detailDialogManagerProviders} from '../../../providers/dialog/detail-dialog-manager-providers';
import {listDialogManagerProviders} from '../../../providers/dialog/list-dialog-manager-providers';
import {
  MENTOR_CACHE,
  MENTOR_DATA_SOURCE,
  MENTOR_INSTANCE_CACHE,
  MENTOR_INSTANCE_CACHE_UPDATER,
  MENTOR_SCHOOL_CHANGE_RESETTER,
  MENTOR_URI_SUPPLIER
} from '../../../providers/global/global-mentor-providers-factory';
import {ConfimationDialogComponent} from '../../shared/components/confimation-dialog/confimation-dialog.component';
import {MentorDialogComponent} from '../components/mentor-dialog/mentor-dialog.component';

export const MENTOR_TABLE_CACHE = new InjectionToken<TableCache<School>>('mentor-table-cache')
export const MENTOR_SCHOOL_CHANGE_HANDLER = new InjectionToken<SingleItemCacheSchoolChangeHandler<Mentor>>('mentor-school-change-handler')
export const MENTOR_DETAIL_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<MentorDialogComponent>>('mentor-detail-edit-dialog-manager')
export const MENTOR_DETAIL_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('mentor-detail-delete-dialog-manager')
export const MENTOR_LIST_EDIT_DIALOG_MANAGER = new InjectionToken<DialogManager<MentorDialogComponent>>('mentor-list-edit-dialog-manager')
export const MENTOR_LIST_DELETE_DIALOG_MANAGER = new InjectionToken<DialogManager<ConfimationDialogComponent>>('mentor-list-delete-dialog-manager')

export function mentorProvidersFactory() {
  return [
    ...detailDialogManagerProviders(
      'mentor',
      MENTOR_DETAIL_EDIT_DIALOG_MANAGER,
      MENTOR_DETAIL_DELETE_DIALOG_MANAGER,
      MentorDialogComponent,
      MENTOR_TABLE_CACHE,
      ['/mentormanager'],
      MENTOR_INSTANCE_CACHE,
      MENTOR_INSTANCE_CACHE_UPDATER
    ),
    ...listDialogManagerProviders<Mentor, MentorDialogComponent, TableCache<Mentor>>(
      'mentor',
      MENTOR_LIST_EDIT_DIALOG_MANAGER,
      MENTOR_LIST_DELETE_DIALOG_MANAGER,
      MentorDialogComponent,
      MENTOR_TABLE_CACHE
    ),
    {
      provide: MENTOR_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Mentor>) => new TableCache('MentorTableCache', dataSource),
      deps: [MENTOR_DATA_SOURCE]
    },
    {
      provide: MENTOR_SCHOOL_CHANGE_HANDLER,
      useFactory: (schoolChangeResetter: SchoolChangeDataSourceResetter<Mentor>, uriSupplier: UriSupplier, cache: Cache<Mentor>, tableCache: TableCache<Mentor>) =>
        new SingleItemCacheSchoolChangeHandler<Mentor>('MentorSchoolChangeHandler', schoolChangeResetter, uriSupplier, cache, tableCache),
      deps: [MENTOR_SCHOOL_CHANGE_RESETTER, MENTOR_URI_SUPPLIER, MENTOR_CACHE, MENTOR_TABLE_CACHE]
    },
  ]
}
