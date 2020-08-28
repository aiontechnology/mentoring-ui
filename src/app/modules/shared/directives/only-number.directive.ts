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

import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[msOnlyNumber]'
})
export class OnlyNumberDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (['Backspace', 'Tab', 'Enter', 'Escape'].indexOf(event.code) !== -1 ||
      (event.code === 'KeyA' && (event.ctrlKey || event.metaKey)) || // ctrl-a
      (event.code === 'KeyC' && (event.ctrlKey || event.metaKey)) || // ctrl-c
      (event.code === 'KeyV' && (event.ctrlKey || event.metaKey)) || // ctrl-v
      (event.code === 'KeyX' && (event.ctrlKey || event.metaKey)) || // ctrol-x
      event.code === 'ArrowLeft' ||
      event.code === 'ArrowRight') {
      console.log('Allowing', event);
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
      console.log('Denying', event);
      event.preventDefault();
    }

    console.log('Allowing', event);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event) {
    setTimeout(() => {
      const numberRegEx = /^[0-9]+$/;
      if (!numberRegEx.test(this.el.nativeElement.value)) {
        this.el.nativeElement.value = '';
        event.preventDefault();
      }
    }, 100);
  }

}
