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

import { DropListData } from './drop-list-data';
import { Book } from 'src/app/implementation/models/book/book';

/**
 * DropListBook manages the stored book data.
 * It adds tag filtering to DropListData.
 */
export class DropListBooks extends DropListData {

  private tagFilter: string;
  private titleFilter: string;

  constructor(data: Book[] = []) {
    super(data);
    this.tagFilter = '';
    this.titleFilter = '';
  }

  applyTagFilter(filterValue: string): void {
    this.tagFilter = filterValue ?? '';
    this.applyFilter();
  }

  applyTitleFilter(filterValue: string): void {
    this.titleFilter = this.cleanInput(filterValue);
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.tagFilter === '' && this.titleFilter === '') {
      this.filteredData = this.data.slice();
    } else{
      this.filteredData = this.data.filter((value) => {
        return (((value as Book).tag === this.tagFilter) || (this.tagFilter === '')) &&
          (value.displayName.includes(this.titleFilter));
      });
    }
  }

}
