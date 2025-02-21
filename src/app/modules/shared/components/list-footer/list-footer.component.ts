/*
 * Copyright 2022-2023 Aion Technology LLC
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

import {Component, Input, ViewChild} from '@angular/core';
import {MatLegacyPaginator as MatPaginator} from '@angular/material/legacy-paginator';
import {TableCache} from '../../../../implementation/table-cache/table-cache';

@Component({
  selector: 'ms-list-footer',
  templateUrl: './list-footer.component.html',
  styleUrls: ['./list-footer.component.scss']
})
export class ListFooterComponent {

  @Input() tableCache: TableCache<any>
  @Input() staticPageSize: number

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator) {
      this.tableCache.paginator = paginator
    }
  }

}
