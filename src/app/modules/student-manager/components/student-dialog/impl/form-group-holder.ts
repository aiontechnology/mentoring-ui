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

import {FormBuilder, FormGroup} from '@angular/forms';

export abstract class FormGroupHolder<T> {
  formGroup: FormGroup

  protected constructor(
    private item: T,
    protected formBuilder: FormBuilder,
  ) {}

  get value() {
    return this.formGroup.value
  }

  init() {
    this.generate(this.item)
    return this;
  }

  protected abstract generateFormGroup(item: T): FormGroup

  protected abstract updateFormGroup(item: T): void

  private generate(item: T): void {
    this.formGroup = this.generateFormGroup(item)
    if (item) {
      this.updateFormGroup(item)
    }
  }

}
