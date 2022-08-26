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

import {DataSource} from '../../../../implementation/data/data-source';
import {environment} from '../../../../../environments/environment';
import {SCHOOL_DATA_SOURCE} from '../../../shared/shared.module';
import {DatasourceManagerRemovable} from '../../../shared/services/datasource-manager/datasource-manager-removable';
import {School} from '../../../shared/models/school/school';

@Injectable()
export class SchoolCacheService extends DatasourceManagerRemovable<School> {

  readonly isLoading$: BehaviorSubject<boolean>;

  /**
   * Constructor
   * @param schoolService The SchoolService that is used for managing School instances.
   */
  constructor(@Inject(SCHOOL_DATA_SOURCE) private schoolDataSource: DataSource<School>) {
    super();
    this.isLoading$ = new BehaviorSubject(true);
  }

  get isLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  /**
   * Load backend data to table.
   */
  loadData = (): Promise<void> =>
    this.schoolDataSource.allValues()
      .then(schools => {
        this.isLoading$.next(false);
        this.dataSource.data = schools;
      })

  protected doRemoveItem = (items: School[]): Promise<void> =>
    this.schoolDataSource.removeSet(items)
      .then(this.loadData)

  private sortingDataAccessor = (item: School, property: string) => {
    switch (property) {
      case 'street1':
        return item.address.street1;
      case 'street2':
        return item.address.street2;
      case 'city':
        return item.address.city;
      case 'state':
        return item.address.state;
      case 'zip':
        return item.address.zip;
      default:
        return item[property];
    }
  }

  private uriFactory = (): string => `${environment.apiUri}/api/v1/schools`;

}
