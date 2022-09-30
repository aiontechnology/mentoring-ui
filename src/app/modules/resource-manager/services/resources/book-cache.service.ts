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

import {DatasourceManagerRemovable} from 'src/app/modules/shared/services/datasource-manager/datasource-manager-removable';
import {Book} from 'src/app/modules/shared/models/book/book';
import {BehaviorSubject, Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {DataSource} from '../../../../implementation/data/data-source';
import {BOOK_DATA_SOURCE} from '../../../shared/shared.module';

@Injectable()
export class BookCacheService extends DatasourceManagerRemovable<Book> {

  readonly isLoading$: BehaviorSubject<boolean>;

  constructor(@Inject(BOOK_DATA_SOURCE) private bookDataSource: DataSource<Book>) {
    super();
    this.isLoading$ = new BehaviorSubject(true);
  }

  get isLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  loadData = (): Promise<void> =>
    this.bookDataSource.allValues()
      .then(books => {
        this.isLoading$.next(false);
        this.dataSource.data = books;
      })

  protected doRemoveItemOld = (items: Book[]): Promise<void> =>
    this.bookDataSource.removeSet(items)
      .then(this.loadData)

}
