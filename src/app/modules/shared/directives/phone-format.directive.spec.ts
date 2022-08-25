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

import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PhoneFormatDirective } from './phone-format.directive';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';

@Component({
  template: `<input msPhoneFormat [formControl]="testControl">`
})
class TestComponent {
  testControl = new UntypedFormControl('');
}

describe('PhoneFormatDirective', () => {

  let input: HTMLInputElement;

  beforeEach(() => {

    const fixture = TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [PhoneFormatDirective, TestComponent]
    })
    .createComponent(TestComponent);

    fixture.detectChanges();

    const element = fixture.debugElement.query(By.directive(PhoneFormatDirective));
    input = element.nativeElement as HTMLInputElement;

  });

  it('#formatInput should store empty string when no input is given', () => {

    input.value = '';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('');

  });

  it('#formatInput should mask integer input properly', () => {

    input.value = '1';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('(1)');

    input.value += '23';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('(123)');

    input.value += '4';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('(123) 4');

    input.value += '56';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('(123) 456');

    input.value += '7890';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('(123) 456-7890');

  });

  it('#formatInput should not store input greater than 10 digits', () => {

    input.value = '12345678901';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('(123) 456-7890');

  });

  it('#formatInput should not store non-numeric input', () => {

    input.value = '1abcdef+-=@#';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('(1)');

  });

});
