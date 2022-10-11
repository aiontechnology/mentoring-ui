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

import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DataSource} from '../data/data-source';
import {AbstractRemovableTableCache} from './abstract-removable-table-cache';

@Injectable()
export class TableCache<T> extends AbstractRemovableTableCache<T> {
  readonly isLoading$: BehaviorSubject<boolean>;

  constructor(private dataSource: DataSource<T>) {
    super();
    this.isLoading$ = new BehaviorSubject(true);
  }

  override loadData(): Promise<T[]> {
    return this.dataSource.allValues()
      .then(values => {
        this.isLoading$.next(false)
        this.tableDataSource.data = values
        return values
      });
  }

  protected doRemoveItem(items: T[]): Promise<T[]> {
    return this.dataSource.removeSet(items);
  }
}
