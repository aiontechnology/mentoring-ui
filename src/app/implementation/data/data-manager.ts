/*
 * Copyright 2022-2023 Aion Technology LLC
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

export interface DataManager<T> {

  /**
   * Add a value the collection of values that are managed by the DataManager.
   * @param value The value to add.
   * @return A promise of the value that was added.
   */
  add: (value: T) => Promise<T>;

  /**
   * Retrieve all values that are managed by the DataManager.
   * @return A promise of the values that are managed by the DataManager.
   */
  allValues: () => Promise<T[]>;

  /**
   * Retrieve the value that corresponds to the provided ID.
   * @param id The ID of the desired value.
   * @return A promise of the value that matches the given ID.
   */
  oneValue: (id: string) => Promise<T>;

  /**
   * Remove the given value from the set of values that are managed by the DataManager.
   * @param value The value to remove.
   * @return A promise of the value that was removed.
   */
  remove: (value: T) => Promise<T>;

  /**
   * Remove the values in the given array from the set of values that are managed by the DataManager.
   * @param values The values to remove.
   * @return A promise of the values that were removed.
   */
  removeSet: (values: T[]) => Promise<T[]>;

  /**
   * Update the given value in the DataManager.
   * @param value The value to update.
   * @return A promise of the updated value.
   */
  update: (value: T) => Promise<T>;

  /**
   * Update the values in the given array in the DataManager.
   * @param values The values to update.
   * @return A promise of the updated values.
   */
  updateSet: (values: T[]) => Promise<T[]>;

}
