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

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LinksHolder } from './links-holder';

export abstract class BaseRepository<T extends LinksHolder<any>> {

    protected _items: BehaviorSubject<T[]>;

    private dataStore: {
        items: T[];
    };

    constructor(protected path: string, private http: HttpClient) {
        this.dataStore = { items: [] };
        this._items = new BehaviorSubject<T[]>([]);
    }

    get items(): Observable<T[]> {
        return this._items;
    }

    protected create(uri: string, newItem: T): Promise<T> {
        console.log('Creating', uri);
        return new Promise((resolver, reject) => {
            console.log('Adding item:', uri, newItem);
            this.http.post(uri, newItem)
                .subscribe(data => {
                    const i = this.fromJSON(data);
                    this.dataStore.items.push(i);
                    this.publishItems();
                    resolver(i);
                }, error => {
                    console.error('Failed to create new item');
                });
        });
    }

    protected readAll(uri: string): void {
        console.log('Loading all', uri);
        this.http.get<any>(uri)
            .subscribe(data => {
                this.dataStore.items = [];
                if (data?._embedded) {
                    const collectionKey = Object.keys(data?._embedded)[0];
                    for (const item of data?._embedded[collectionKey]) {
                        const i = this.fromJSON(item);
                        this.dataStore.items.push(i);
                    }
                }
                this.logCache();
                this.publishItems();
            });
    }

    protected readOne(id: string): T {
        for (const item of this.dataStore.items) {
            if (item.getSelfLink().endsWith(id)) {
                console.log('Found an item', item);
                return item;
            }
        }
        return null;
    }

    protected update(uri: string, item: T): Promise<T> {
        console.log('Updating', uri);
        return new Promise((resolver, reject) => {
            this.http.put(item.getSelfLink(), item)
                .subscribe(data => {
                    console.log('Recieved item: ', data);
                    const i = this.fromJSON(data);
                    for (const index in this.dataStore.items) {
                        if (this.dataStore.items[index].getSelfLink() === i.getSelfLink()) {
                            console.log('Replacing item: ', this.dataStore.items[index], i);
                            this.dataStore.items[index] = i;
                            break;
                        }
                    }
                    this.publishItems();
                    resolver(i);
                }, error => {
                    console.error('Failed to update item');
                });
        });
    }

    protected delete(items: T[]) {
        items.forEach(item => {
            console.log('Deleting', item);
            this.http.delete(item.getSelfLink(), {})
                .subscribe(data => {
                    const index: number = this.dataStore.items.indexOf(item);
                    if (index !== -1) {
                        this.dataStore.items.splice(index, 1);
                    }
                    this.publishItems();
                });
        });
    }

    protected abstract fromJSON(json: any): T;

    protected abstract newItem(): T;

    protected get uriBase() {
        return environment.apiUri + this.path;
    }

    private logCache(): void {
        for (const item of this.dataStore.items) {
            console.log('Cache entry: ', item);
        }
    }

    private publishItems(): void {
        this._items.next(Object.assign({}, this.dataStore).items);
    }

    private stripLinks(item: T): T {
        return Object.assign(this.newItem(), item).clearLinks();
    }

}
