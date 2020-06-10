/**
 * Copyright 2020 Aion Technology LLC
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

import { SelectionModel } from '@angular/cdk/collections';
import { take, mergeAll, filter, toArray } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Class to manage the selection of a collection of model objects.
 */
export abstract class SelectionManager<T> {

    /** Manages the selection(s) of schools in the main-content table */
    selection = new SelectionModel<T>(true, []);

    clearSelection(): void {
        this.selection.clear();
    }

    getFirstSelection(): T {
        console.log('Getting first selection', this.selection);
        return this.selection.selected[0];
    }

    get selectionCount(): number {
        return this.selection.selected.length;
    }

    /**
     * Whether the number of selected elements matches the total number of rows.
     */
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        return numSelected === this.getDataSize();
    }

    /**
     * Selects all rows if they are not all selected; otherwise clear selection.
     */
    masterToggle(): void {
        this.isAllSelected() ?
            this.clearSelection() :
            this.getFilteredData().forEach(row => this.selection.select(row));
    }

    /**
     * Remove the currently selected items.
     */
    removeSelected(): void {
        this.getDataObservable().pipe(
            take(1),
            mergeAll(),
            filter(item => this.selection.isSelected(item)),
            toArray()
        ).subscribe(selected => {
            this.doRemoveItem(selected);
            this.clearSelection();
        });
    }

    /**
     * Allow the concrete class to do whatever is necessary to remove the array of items.
     * @param items The items to remove.
     */
    protected abstract doRemoveItem(items: T[]): void;

    /**
     * Get an Observable that contains the current list of items.
     */
    protected abstract getDataObservable(): Observable<T[]>;

    /**
     * Get the number of items in the data collection.
     */
    protected abstract getDataSize(): number;

    /**
     * Get the items from the filtered collection.
     */
    protected abstract getFilteredData(): T[];

}
