/**
 * Copyright 2020 - 2021 Aion Technology LLC
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
import { Personnel } from '../../models/personnel/personnel';
import { DatasourceManagerRemovable } from 'src/app/modules/shared/services/datasource-manager/datasource-manager-removable';
import { PersonnelRepositoryService } from './personnel-repository.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PersonnelCacheService extends DatasourceManagerRemovable<Personnel>  {

  private isLoading$: BehaviorSubject<boolean>;

  /**
   * Constructor
   * @param personnelService The PersonnelService that is used for managing Personnel instances.
   */
  constructor(private personnelService: PersonnelRepositoryService) {
    super();
    this.isLoading$ = new BehaviorSubject(true);
  }

  /**
   * Load backend data to table.
   * @param schoolId UUID of the school to load data from.
   */
  establishDatasource(schoolId: string): void {
    this.personnelService.readAllPersonnel(schoolId);
    this.dataSource.data$ = this.personnelService.items.pipe(
      tap(() => {
        this.isLoading$.next(false);
        console.log('Creating new mentor datasource');
      })
    );
  }

  get isLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  protected doRemoveItem(items: Personnel[]): Promise<void> {
    return this.personnelService.deletePersonnel(items);
  }

}
