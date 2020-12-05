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

import { Directive, ElementRef, AfterViewInit } from '@angular/core';

/*
 * TODO: Change this scrolling implementation. Current behavior works, but is not well defined.
 */
@Directive({
  selector: '[scrollTo]'
})
export class ScrollToDirective implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    setTimeout(() => this.el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

}
