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

import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AbstractRemovableTableCache} from 'src/app/implementation/table-cache/abstract-removable-table-cache';
import {DataSource} from '../../../../implementation/data/data-source';
import {MENTOR_DATA_SOURCE} from '../../../shared/shared.module';
import {Mentor} from '../../models/mentor/mentor';

@Injectable()
export class MentorCacheService extends AbstractRemovableTableCache<Mentor> {

  readonly isLoading$: BehaviorSubject<boolean>;

  constructor(@Inject(MENTOR_DATA_SOURCE) private mentorDataSource: DataSource<Mentor>) {
    super();
    this.isLoading$ = new BehaviorSubject(true);
  }

  get isLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  override loadData(): Promise<Mentor[]> {
    return this.mentorDataSource.allValues()
      .then(mentors => {
        this.isLoading$.next(false);
        this.tableDataSource.data = mentors;
        return mentors;
      })
  }

  protected override doRemoveItem(items: Mentor[]): Promise<Mentor[]> {
    return this.mentorDataSource.removeSet(items)
      .then(this.loadData)
  }

}
