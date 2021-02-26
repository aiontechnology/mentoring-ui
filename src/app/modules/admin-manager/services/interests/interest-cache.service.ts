/**
 * Copyright 2021 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { MetaDataService } from 'src/app/modules/shared/services/meta-data/meta-data.service';
import { DatasourceManager } from 'src/app/modules/shared/services/datasource-manager';
import { InterestInbound } from '../../models/interest/interest-inbound';
import { map } from 'rxjs/operators';

@Injectable()
export class InterestCacheService extends DatasourceManager<InterestInbound> {

  constructor(private metaDataService: MetaDataService) {
    super();
  }

  establishDatasource(): void {
    this.metaDataService.loadInterests();
    this.dataSource.data$ = this.metaDataService.interests.pipe(
      map((interest): InterestInbound[] => {
        console.log('Creating new interests datasource');
        return interest.map((i): InterestInbound => ({ name: i }));
      })
    );
  }

  protected doRemoveItem(items: InterestInbound[]): void { }

}
