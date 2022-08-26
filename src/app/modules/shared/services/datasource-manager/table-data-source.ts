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

import {MatTableDataSource} from '@angular/material/table';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

/**
 * Handles table data emitted from the server. It does this
 * by using a single subscription for the table data.
 */
export class TableDataSource<T> extends MatTableDataSource<T> {

  data$: Observable<T[]>;
  subscription$: Subscription;

  constructor() {
    super([]);
  }

  connect(): BehaviorSubject<T[]> {
    // this.subscription$ = this.data$.subscribe(t => this.data = t);
    return super.connect();
  }

  disconnect() {
    // this.subscription$.unsubscribe();
    super.disconnect();
  }
}
