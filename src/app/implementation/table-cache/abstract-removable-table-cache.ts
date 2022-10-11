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

import {AbstractTableCache} from './abstract-table-cache';

/**
 * Implemented by cache services that need to accommodate deleting multiple
 * selected table items (via http DELETE). The interests, school-book, and
 * school-game services do not need this, so they should inherit the parent
 * datasource-manager class.
 */
export abstract class AbstractRemovableTableCache<T> extends AbstractTableCache<T> {

  /**
   * Get the current list of items.
   */
  protected get data(): T[] {
    return this.tableDataSource.data;
  }

  abstract loadData(): Promise<T[]>

  /**
   * Remove the currently selected items.
   */
  removeSelectedOld(): Promise<void> {
    const selected = this.data.filter(item => this.selection.isSelected(item));
    const ret = this.doRemoveItem(selected);
    this.clearSelection();
    return Promise.resolve();
  }

  removeSelected(): Promise<T[]> {
    const selected = this.data.filter(item => this.selection.isSelected(item));
    return this.doRemoveItem(selected)
      .then(this.loadData);
  }

  protected abstract doRemoveItem(items: T[]): Promise<T[]>;
}
