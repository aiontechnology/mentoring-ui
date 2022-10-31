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

import {BehaviorSubject, Observable, Subject} from 'rxjs';

export abstract class Publisher<T> {
  private subject1: BehaviorSubject<T> = new BehaviorSubject<T>(null)
  private subject2: Subject<T> = new Subject<T>()

  protected publish(item: T) {
    this.subject1.next(item)
    this.subject2.next(item)
  }

  get observable(): Observable<T> {
    return this.subject1
  }

  get newOnly(): Observable<T> {
    return this.subject2
  }
}
