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

import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SchoolSession} from '../../models/school/schoolsession';
import {DatasourceManagerRemovable} from '../datasource-manager/datasource-manager-removable';
import {SCHOOL_SESSION_DATA_SOURCE} from '../../shared.module';
import {DataSource} from '../../../../implementation/data/data-source';

@Injectable()
export class SchoolSessionCacheService extends DatasourceManagerRemovable<SchoolSession> {

  readonly isLoading$: BehaviorSubject<boolean>;

  constructor(@Inject(SCHOOL_SESSION_DATA_SOURCE) private schoolSessionDataSource: DataSource<SchoolSession>) {
    super();
    this.isLoading$ = new BehaviorSubject(true);
  }

  get isLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  loadData = (): Promise<void> =>
    this.schoolSessionDataSource.allValues()
      .then(schoolSessions => {
        this.isLoading$.next(false);
        this.dataSource.data = schoolSessions;
      })

  protected doRemoveItem = (items: SchoolSession[]): Promise<void> =>
    this.schoolSessionDataSource.removeSet(items)
      .then(this.loadData)

}
