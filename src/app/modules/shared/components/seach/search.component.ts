/*
 * Copyright 2022-2024 Aion Technology LLC
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

import {Location} from '@angular/common';
import {Component, Input} from '@angular/core';
import {TableCache} from '@implementation/table-cache/table-cache';

@Component({
  selector: 'ms-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  @Input() tableCache: TableCache<any>

  private readonly URL_PREFIX = 'http://localhost'
  private readonly FILTER_KEY = 'filter'

  constructor(
    private location: Location
  ) {}

  public bindSearchValue(value: string): void {
    this.tableCache.applyFilter(value)
    this.updateUrl()
  }

  public clearSearchValue(): void {
    this.tableCache.clearFilter()
    this.updateUrl()
  }

  private updateUrl(): void {
    const path = new URL(this.URL_PREFIX + this.location.path(true))
    path.searchParams.delete(this.FILTER_KEY)
    if (this.tableCache.filterBinding != null && this.tableCache.filterBinding != '') {
      path.searchParams.append(this.FILTER_KEY, this.tableCache.filterBinding);
    }
    let p = path.toString()
    let newPath = p.replace(this.URL_PREFIX, '')
    this.location.replaceState(newPath)
  }

}
