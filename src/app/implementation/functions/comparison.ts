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

export function equalsById<T extends { id: string }>(obj1: T, obj2: T) {
  if (!obj1?.id || !obj2?.id) {
    return false
  }
  return obj1.id === obj2.id
}

export function equalsBySelfLink<T extends { selfLink: () => string }>(obj1: T, obj2: T) {
  if (!obj1?.selfLink || !obj2?.selfLink) {
    return false
  }
  return obj1?.selfLink === obj2?.selfLink
}
