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
import {AbstractRemovableTableCache} from '../../../../implementation/table-cache/abstract-removable-table-cache';
import {SCHOOL_SESSION_DATA_SOURCE} from '../../shared.module';
import {DataSource} from '../../../../implementation/data/data-source';

@Injectable()
export class SchoolSessionCacheService extends AbstractRemovableTableCache<SchoolSession> {

  readonly isLoading$: BehaviorSubject<boolean>;

  constructor(@Inject(SCHOOL_SESSION_DATA_SOURCE) private schoolSessionDataSource: DataSource<SchoolSession>) {
    super();
    this.isLoading$ = new BehaviorSubject(true);
  }

  get isLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  override loadData(): Promise<SchoolSession[]> {
    return this.schoolSessionDataSource.allValues()
      .then(schoolSessions => {
        this.isLoading$.next(false)
        this.tableDataSource.data = schoolSessions
        return schoolSessions
      })
  }

  protected override doRemoveItem(items: SchoolSession[]): Promise<SchoolSession[]> {
    return this.schoolSessionDataSource.removeSet(items)
      .then(this.loadData)
  }

}
