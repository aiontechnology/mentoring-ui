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

import {UriSupplier} from '../data/uri-supplier';
import {School} from '../models/school/school';
import {MultiItemCache} from './multi-item-cache';
import {MultiItemCacheSchoolChangeHandler} from './multi-item-cache-school-change-handler';
import {SchoolChangeDataSourceResetter} from './school-change-data-source-resetter';
import {SingleItemCache} from './single-item-cache';

export class MultiItemCacheSchoolChangeLoader<T> extends MultiItemCacheSchoolChangeHandler<T> {
  constructor(
    // for super
    label: string,
    schoolChangeDataSourceResetter: SchoolChangeDataSourceResetter<T>,
    uriSupplier: UriSupplier,
    // other
    private multiItemCache: MultiItemCache<T>,
  ) {
    super(label, schoolChangeDataSourceResetter, uriSupplier)
  }

  protected handleSchoolChange = (school: School): void => {
    this.multiItemCache.reset()
    this.multiItemCache.load()
      .then(() => console.log(`${this.label}: Loaded for school`, school))
  }
}
