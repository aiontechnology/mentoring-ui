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

import { SelectionManager } from '../../../school-manager/services/selection-manager';
import { TableDataSource } from './table-data-source';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export abstract class DatasourceManager<T> extends SelectionManager<T> {

    /** Datasource that is used by the table in the main-content component */
    dataSource: TableDataSource<T>;

    /** Binds to the filter input control. Used to clear the control when requested. */
    filterBinding: string;

    /** Number of schools to display on a page */
    pageSize: number;

    /** The page that currently being displayed. */
    private currentPage: number;

    constructor() {
        super();
        this.dataSource = new TableDataSource<T>();
        this.pageSize = 10;
        this.currentPage = 0;
    }

    /**
     * Apply a filter to the table datasource
     * @param filterValue The value to use as a filter
     */
    applyFilter(filterValue: string): void {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
        this.clearSelection();
    }

    /**
     * Clear the filter. Clear both the data source filter and the input binding
     */
    clearFilter(): void {
        this.dataSource.filter = '';
        this.filterBinding = '';
    }

    protected get dataSize(): number {
        return this.filteredData.length;
    }

    /**
     * Get the value of the data source filter.
     */
    get filter() {
        return this.dataSource.filter;
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

    /**
     * Move to the specified page.
     * @param index Page number to jump to.
     */
    private jumpToPage(index: number): void {
        this.dataSource.paginator.pageIndex = index;
        this.dataSource.paginator.page.next({
            pageIndex: index,
            pageSize: this.pageSize,
            length: this.dataSource.paginator.length
        });
    }

    private get sortedData(): T[] {
        return this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort);
    }

    protected get filteredData(): T[] {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.dataSource.filteredData.slice(startIndex, endIndex);
    }

    /**
     * Set the paginator for the current DataSource
     */
    set paginator(paginator: MatPaginator) {
        this.dataSource.paginator = paginator;
        this.dataSource.paginator.page.subscribe((pageEvent: PageEvent) => {
            this.currentPage = pageEvent.pageIndex;
            this.pageSize = pageEvent.pageSize;
            this.clearSelection();
        });
    }

    /**
     * Set the sort of the current DataSource
     */
    set sort(sort: MatSort) {
        this.dataSource.sort = sort;
    }

}
