/*
 * Copyright 2021-2022 Aion Technology LLC
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
import {MetaDataService} from 'src/app/modules/shared/services/meta-data/meta-data.service';
import {DatasourceManager} from 'src/app/modules/shared/services/datasource-manager/datasource-manager';
import {InterestInbound} from '../../models/interest/interest-inbound';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class InterestCacheService extends DatasourceManager<InterestInbound> {

  readonly isLoading$: BehaviorSubject<boolean>;

  constructor(private metaDataService: MetaDataService) {
    super();
    this.isLoading$ = new BehaviorSubject(true);
  }

  get isLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  establishDatasource = (): void => {
    this.metaDataService.loadInterests()
      .then(interests => {
        this.isLoading$.next(false);
        return interests.map(i => ({
          name: i
        }) as InterestInbound);
      })
      .then(interests => this.dataSource.data = interests);
  }

}
