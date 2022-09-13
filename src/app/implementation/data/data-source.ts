/*
 * Copyright 2022 Aion Technology LLC
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

import {Injectable} from '@angular/core';
import {Repository} from './repository';
import {Cache} from './cache';
import {DataManager} from './data-manager';

/**
 * Acts as a datasource for objects of the given type. Data can be fetched from the cache if it is available or from the backend via REST
 * calls.
 */
@Injectable()
export class DataSource<T> implements DataManager<T> {

  constructor(private repository: Repository<T>,
              private cache?: Cache<T>) {
  }

  add = (value: T): Promise<T> => {
    if (this.cache) {
      return this.loadCache()
        .then(() => this.repository.add(value)
          .then(this.cache.add));
    } else {
      return this.repository.add(value);
    }
  }

  allValues = (): Promise<T[]> =>
    this.loadCache()
      .then(() => this.cache.allValues())

  oneValue = (id: string): Promise<T> =>
    this.loadCache()
      .then(() => this.cache.oneValue(id))

  remove = (value: T): Promise<T> =>
    this.loadCache()
      .then(() => this.repository.remove(value)
        .then(() => this.cache.remove(value)))

  removeSet = (values: T[]): Promise<T[]> =>
    this.loadCache()
      .then(() => this.repository.removeSet(values)
        .then(this.cache.removeSet))

  reset = (): void =>
    this.cache?.reset()

  update = (value: T): Promise<T> =>
    this.loadCache()
      .then(() => this.repository.update(value)
        .then(this.cache.update))

  private loadCache = (): Promise<void> =>
    new Promise(resolve => {
      if (!this.cache || this.cache.isLoaded) {
        resolve();
      } else {
        this.repository.allValues()
          .then(values => {
            this.cache.put(values);
            resolve();
          });
      }
    })

}
