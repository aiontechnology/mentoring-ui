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

import {DataSource} from '../../../implementation/data/data-source';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {detailProvidersFactory} from '../../../providers/detail-menus-providers-factory';
import {MENTOR_DATA_SOURCE, MENTOR_INSTANCE_CACHE} from '../../../providers/global-mentor-providers-factory';
import {listProvidersFactory} from '../../../providers/list-menus-providers-factory';
import {MentorDialogComponent} from '../components/mentor-dialog/mentor-dialog.component';
import {MENTOR_DETAIL_MENU, MENTOR_GROUP, MENTOR_LIST_MENU, MENTOR_TABLE_CACHE} from '../mentor-manager.module';
import {Mentor} from '../models/mentor/mentor';

export function mentorProvidersFactory() {
  return [
    ...listProvidersFactory<Mentor, MentorDialogComponent, TableCache<Mentor>>(MENTOR_LIST_MENU, MENTOR_GROUP, 'Mentor',
      MentorDialogComponent, MENTOR_TABLE_CACHE),
    ...detailProvidersFactory<Mentor, MentorDialogComponent, TableCache<Mentor>>(MENTOR_DETAIL_MENU, MENTOR_GROUP, 'Mentor',
      ['/mentormanager'], MentorDialogComponent, MENTOR_TABLE_CACHE, MENTOR_INSTANCE_CACHE),
    {
      provide: MENTOR_TABLE_CACHE,
      useFactory: (dataSource: DataSource<Mentor>) => new TableCache(dataSource),
      deps: [MENTOR_DATA_SOURCE]
    },
  ]
}
