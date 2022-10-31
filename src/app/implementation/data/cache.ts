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

import {forkJoin} from 'rxjs'
import {IdService} from '../../modules/shared/services/id-service/id.service'
import {Resettable} from '../state-management/resettable';
import {DataManager} from './data-manager'

export class Cache<T> implements DataManager<T>, Resettable {
  private values: T[]
  private valueMap: Map<string, T>

  constructor(
    private label: string,
  ) {}

  get isLoaded() {
    return this.values !== undefined
  }

  /**
   * Add the given value to the array. The value is stored such that it can be retrieved by its id.
   * @param value The value to add to the cache.
   */
  add = (value: T): Promise<T> =>
    new Promise((resolve, reject) => {
      if (this.isLoaded) {
        this.values.push(value)
        this.valueMap.set(IdService.calculateId(value), value)
        resolve(value)
      } else {
        reject('Unable to add to cache. Cache is not initialized')
      }
    })

  /**
   * Retrieve all values that are currently stored in the cache.
   */
  allValues = (): Promise<T[]> =>
    new Promise((resolve, reject) => {
      if (this.isLoaded) {
        resolve(this.values)
      } else {
        reject('Unable to retrieve all values. Cache is not initialized')
      }
    })

  /**
   * Retrieve the value with the given id if it exists.
   * @param id The id of the desired value.
   */
  oneValue = (id: string): Promise<T> =>
    new Promise((resolve, reject) => {
      if (this.isLoaded) {
        resolve(this.valueMap.get(id))
      } else {
        resolve(undefined)
      }
    })

  /**
   * Replace the cache values with the given array of values.
   * @param values The values to set the cache with.
   */
  put = (values: T[]): void => {
    this.values = values;
    this.valueMap = new Map<string, T>()
    values.forEach(value => this.valueMap.set(IdService.calculateId(value), value))
  }

  /**
   * Remove the given object from the cache.
   * @param value The value to remove from the cache.
   */
  remove = (value: T): Promise<T> =>
    new Promise((resolve, reject) => {
      if (this.isLoaded) {
        const index = this.values.findIndex(v => IdService.calculateId(v) === IdService.calculateId(value))
        if (index !== -1) {
          this.values.splice(index, 1)
        }
        this.valueMap.delete(IdService.calculateId(value))
        resolve(value);
      } else {
        reject('Unable to remove a value. Cache is not initialized')
      }
    })

  removeSet = (values: T[]): Promise<T[]> => {
    const promises = values.map(this.remove)
    const joinedPromises = forkJoin({...promises})
    return new Promise(resolve =>
      joinedPromises.subscribe(() => resolve(values)))
  }

  reset = (): void => {
    console.log(`${this.label}: Resetting`)
    this.values = undefined
    this.valueMap = undefined
  }

  /**
   * Update the given value in the cache.
   * @param value The value to update.
   */
  update = (value: T): Promise<T> =>
    new Promise((resolve, reject) => {
      if (this.isLoaded) {
        const index = this.values.findIndex(v => IdService.calculateId(v) === IdService.calculateId(value))
        this.values[index] = value
        this.valueMap.set(IdService.calculateId(value), value)
        resolve(value);
      } else {
        reject('Unable to update a value. Cache is not initialized')
      }
    })

  updateSet = (values: T[]): Promise<T[]> => {
    this.put(values)
    return Promise.resolve(values)
  }
}
