/*
 * Copyright 2020-2023 Aion Technology LLC
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

import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Resettable} from '../state-management/resettable';
import {SelectionManager} from './selection-manager';

export abstract class AbstractTableCache<T> extends SelectionManager<T> implements Resettable {

  /** Datasource that is used by the table in the main-content component */
  tableDataSource: MatTableDataSource<T> = new MatTableDataSource<T>()

  /** Binds to the filter input control. Used to clear the control when requested. */
  filterBinding: string;

  /** Number of schools to display on a page */
  pageSize: number;

  /** The page that currently being displayed. */
  private currentPage: number;

  protected constructor(
    private label: string,
  ) {
    super();
    this.currentPage = 0;
  }


  /**
   * Get the value of the data source filter.
   */
  get filter() {
    return this.tableDataSource.filter;
  }

  /**
   * Set the paginator for the current DataSource
   */
  set paginator(paginator: MatPaginator) {
    this.tableDataSource.paginator = paginator
    this.pageSize = paginator.pageSize
    this.tableDataSource.paginator.page.subscribe((pageEvent: PageEvent) => {
      this.currentPage = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
      this.clearSelection();
    });
  }

  /**
   * Set the sort of the current DataSource
   */
  set sort(sort: MatSort) {
    this.tableDataSource.sort = sort;
  }

  protected get dataSize(): number {
    return this.filteredData.length;
  }

  protected get filteredData(): T[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.tableDataSource.filteredData.slice(startIndex, endIndex);
  }

  private get sortedData(): T[] {
    return this.tableDataSource.sortData(this.tableDataSource.filteredData, this.tableDataSource.sort);
  }

  loadData(): Promise<T[]> {
    return Promise.resolve([])
  }

  /**
   * Apply a filter to the table datasource
   * @param filterValue The value to use as a filter
   */
  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.tableDataSource.filter = filterValue;
    this.clearSelection();
  }

  /**
   * Clear the filter. Clear both the data source filter and the input binding
   */
  clearFilter(): void {
    this.tableDataSource.filter = '';
    this.filterBinding = '';
  }

  /**
   * Move to the page that has the specified table data.
   * @param value An item in the table.
   */
  jumpToItem(value: T): void {
    const index = this.sortedData.findIndex(item => {
      return JSON.stringify(item) === JSON.stringify(value);
    });
    if (index === -1) {
      return;
    }
    const page = Math.floor(index / this.pageSize);
    this.jumpToPage(page);
  }

  reset(): void {
    this.tableDataSource = new MatTableDataSource<T>()
  }

  /**
   * Move to the specified page.
   * @param index Page number to jump to.
   */
  private jumpToPage(index: number): void {
    this.tableDataSource.paginator.pageIndex = index;
    this.tableDataSource.paginator.page.next({
      pageIndex: index,
      pageSize: this.pageSize,
      length: this.tableDataSource.paginator.length
    });
  }

}
