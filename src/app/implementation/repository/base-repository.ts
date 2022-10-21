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

import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable, Subject} from 'rxjs';
import {log} from 'src/app/implementation/shared/logging-decorator';
import {environment} from 'src/environments/environment';
import {tap} from 'rxjs/operators';
import {LinkService} from 'src/app/modules/shared/services/link-service/link.service';

export abstract class BaseRepository<T> {

  private dataStore: {
    items: T[];
  };

  constructor(protected path: string,
              private http: HttpClient) {
    this.dataStore = {items: []};
    this._items = new Subject<T[]>();
  }

  protected _items: Subject<T[]>;

  get items(): Observable<T[]> {
    return this._items;
  }

  protected get uriBase() {
    return environment.apiUri + this.path;
  }

  @log
  protected create(uri: string, newItem: T): Promise<T> {
    return new Promise((resolver) => {
      this.http.post(uri, newItem)
        .subscribe(data => {
          const i = this.fromJSON(data);
          this.dataStore.items.push(i);
          this.publishItems();
          resolver(i);
        });
    });
  }

  @log
  protected readAll(uri: string): void {
    this.http.get<any>(uri)
      .subscribe(data => {
        this.dataStore.items = [];
        if (data?.content) {
          for (const item of data.content) {
            const i = this.fromJSON(item);
            this.dataStore.items.push(i);
          }
        }
        this.publishItems();
      });
  }

  @log
  protected readOne(uri: string): void {
    this.http.get<any>(uri)
      .subscribe(data => {
        this.dataStore.items = [];
        const i = this.fromJSON(data);
        this.dataStore.items.push(i);
        this.publishItems();
      });
  }

  @log
  protected getById(id: string): T {
    for (const item of this.dataStore.items) {
      if (LinkService.selfLink(item).endsWith(id)) {
        return item;
      }
    }
    return null;
  }

  @log
  protected update(uri: string, item: T): Promise<T> {
    return new Promise((resolver) => {
      this.http.put(LinkService.selfLink(item), item)
        .subscribe(data => {
          const i = this.fromJSON(data);
          for (const index in this.dataStore.items) {
            if (LinkService.selfLink(this.dataStore.items[index]) === LinkService.selfLink(i)) {
              this.dataStore.items[index] = i;
              break;
            }
          }
          this.publishItems();
          resolver(i);
        });
    });
  }

  @log
  protected delete(items: T[]): Promise<void> {

    const observables$ = items.map((item) => {
      return this.http.delete(LinkService.selfLink(item))
        .pipe(
          tap(() => {
            const index = this.dataStore.items.indexOf(item);
            if (index !== -1) {
              this.dataStore.items.splice(index, 1);
            }
          })
        );
    });

    const deleteRequests$ = forkJoin({...observables$});

    return new Promise((resolver) => {
      deleteRequests$.subscribe(() => {
        this.publishItems();
        resolver();
      });
    });

  }

  protected abstract fromJSON(json: any): T;

  protected abstract newItem(): T;

  private publishItems(): void {
    this._items.next(this.dataStore.items);
  }

}
