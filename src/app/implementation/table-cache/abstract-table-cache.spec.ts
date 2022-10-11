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

import { AbstractTableCache } from './abstract-table-cache';

const MOCK_TABLE_ENTRIES: number[] = [];

function populateMockTableEntries(): void {
  for (let i = 0; i < 51; i++) {
    MOCK_TABLE_ENTRIES.push(i);
  }
}

class MockCacheService extends AbstractTableCache<number> {

  constructor() {
    super();
    this.establishMockDatasource();
  }

  establishMockDatasource(): void {
    this.tableDataSource.data = MOCK_TABLE_ENTRIES;
  }

  doRemoveItem(items: number[]): void { }

}

describe('DatasourceManager', () => {

  let mockCacheService: MockCacheService;

  beforeAll(() => {
    populateMockTableEntries();
  });

  beforeEach(() => {
    mockCacheService = new MockCacheService();
    spyOnProperty(mockCacheService as any, 'sortedData', 'get').and.returnValue(MOCK_TABLE_ENTRIES);
    spyOn(mockCacheService as any, 'jumpToPage');
  });

  it('#jumpToItem should jump to the correct page number (pages should start indexing from 0)', () => {

    // The default page size is 10.
    mockCacheService.jumpToItem(0);
    expect((mockCacheService as any).jumpToPage).toHaveBeenCalledWith(0);

    mockCacheService.jumpToItem(9);
    expect((mockCacheService as any).jumpToPage).toHaveBeenCalledWith(0);

    mockCacheService.jumpToItem(10);
    expect((mockCacheService as any).jumpToPage).toHaveBeenCalledWith(1);

    mockCacheService.pageSize = 20;
    mockCacheService.jumpToItem(0);
    expect((mockCacheService as any).jumpToPage).toHaveBeenCalledWith(0);

    mockCacheService.jumpToItem(19);
    expect((mockCacheService as any).jumpToPage).toHaveBeenCalledWith(0);

    mockCacheService.jumpToItem(20);
    expect((mockCacheService as any).jumpToPage).toHaveBeenCalledWith(1);

    mockCacheService.pageSize = 50;
    mockCacheService.jumpToItem(0);
    expect((mockCacheService as any).jumpToPage).toHaveBeenCalledWith(0);

    mockCacheService.jumpToItem(49);
    expect((mockCacheService as any).jumpToPage).toHaveBeenCalledWith(0);

    mockCacheService.jumpToItem(50);
    expect((mockCacheService as any).jumpToPage).toHaveBeenCalledWith(1);

  });

  it('#jumpToItem should not jump to a new page when an entry cannot be found', () => {
    mockCacheService.jumpToItem(51);
    expect((mockCacheService as any).jumpToPage).not.toHaveBeenCalled();
  });

});
