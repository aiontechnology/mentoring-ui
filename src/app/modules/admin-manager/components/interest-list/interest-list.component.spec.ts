/*
 * Copyright 2021-2022 Aion Technology LLC
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

import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MenuStateService} from '../../../../services/menu-state.service';
import {InterestInbound} from '../../models/interest/interest-inbound';
import {InterestCacheService} from '../../services/interests/interest-cache.service';

import {InterestListComponent, postActionFactory} from './interest-list.component';

export class MockInterestCacheService {
  loadInterests(): void {}
  clearSelection(): void {}
}

@Component({
  selector: 'ms-selection-count-display',
  template: ''
})
export class MockSelectionDisplayComponent {
  @Input() selectionCount: number;
}

export class MockMenuState {
  add(command: any) {}
  clear() {}
}

describe('InterestListComponent', () => {
  let component: InterestListComponent;
  let loadInterestSpy: () => void;
  let fixture: ComponentFixture<InterestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterestListComponent, MockSelectionDisplayComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        {provide: InterestCacheService, useClass: MockInterestCacheService},
        {provide: MenuStateService, useClass: MockMenuState},
        {provide: MatDialog, useValue: {}},
        {provide: MatSnackBar, useValue: {}}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestListComponent);
    component = fixture.componentInstance;
    loadInterestSpy = spyOn(component.interestCacheService, 'loadInterests');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load interests', () => {
    expect(loadInterestSpy).toHaveBeenCalled();
  })
});

describe('postActionFactory', () => {
  it('should reload interests', () => {
    const mockCacheService = {
      loadInterests() {},
      jumpToItem(i: InterestInbound) {}
    }
    const loadInterestFnc = spyOn(mockCacheService, 'loadInterests')
    const jumpToItemFnc = spyOn(mockCacheService, 'jumpToItem');

    const factory = postActionFactory(mockCacheService as InterestCacheService);
    expect(factory).toBeTruthy();

    const interest = {} as InterestInbound;
    factory(interest);
    expect(loadInterestFnc).toHaveBeenCalled();
    expect(jumpToItemFnc).toHaveBeenCalledWith(interest);
  })
})
