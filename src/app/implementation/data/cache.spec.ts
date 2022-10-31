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

import {Cache} from './cache';

// describe('Cache', () => {
//   let cache: Cache<{ id, val: string }>;
//
//   beforeEach(() => {
//     cache = new Cache<{ id, val: string }>();
//     cache[`values`] = [{id: 'key1', val: 'val1'}, {id: 'key2', val: 'val2'}];
//     cache[`valueMap`] = new Map<string, { id; val: string }>();
//     cache[`valueMap`].set('key1', {id: 'key1', val: 'val1'});
//     cache[`valueMap`].set('key2', {id: 'key2', val: 'val2'});
//   });
//
//   /** Test add */
//   it('should add to cache', done => {
//     const id = 'test_id';
//     const model = {id, val: 'val'};
//     cache.add(model)
//       .then(value => {
//         expect(value).toEqual(model);
//         expect(cache[`values`].length).toBe(3);
//         expect(cache[`values`]).toContain(model);
//         expect(cache[`valueMap`].size).toEqual(3);
//         expect(cache[`valueMap`].get(id)).toEqual(model);
//         done();
//       });
//   });
//
//   it('should raise error if cache is not initialized', done => {
//     const emptyCache = new Cache();
//     emptyCache.add({id: 'key'})
//       .then(() => fail('Expected an error'))
//       .catch(error => {
//         expect(error).toEqual('Unable to add to cache. Cache is not initialized');
//         done();
//       });
//   });
//
//   /** Test allValues */
//   it('should return all cached values', done => {
//     cache.allValues()
//       .then(values => {
//         expect(values.length).toBe(2);
//         expect(values).toContain({id: 'key1', val: 'val1'});
//         expect(values).toContain({id: 'key2', val: 'val2'});
//         done();
//       });
//   });
//
//   it('should raise error if cache is not initialized', done => {
//     const emptyCache = new Cache();
//     emptyCache.allValues()
//       .then(() => fail('Expected error'))
//       .catch(error => {
//         expect(error).toEqual('Unable to retrieve all values. Cache is not initialized');
//         done();
//       });
//   });
//
//   /** Test oneValue */
//   it('should return one cached value', done => {
//     cache.oneValue('key2')
//       .then(value => {
//         expect(value).toEqual({id: 'key2', val: 'val2'});
//         done();
//       });
//   });
//
//   it('should return undefined', done => {
//     cache.oneValue('invalidKey')
//       .then(value => {
//         expect(value).toBeUndefined();
//         done();
//       });
//   });
//
//   it('should raise error if cache is not initialized', done => {
//     const emptyCache = new Cache();
//     emptyCache.oneValue('key')
//       .then(() => fail('Expected error'))
//       .catch(error => {
//         expect(error).toEqual('Unable to retrieve a value. Cache is not initialized');
//         done();
//       });
//   });
//
//   /** Test put */
//   it('should put a set of values', () => {
//     cache.put([{id: 'key3', val: 'val3'}]);
//     expect(cache[`values`].length).toBe(1);
//     expect(cache[`values`]).toContain({id: 'key3', val: 'val3'});
//     expect(cache[`valueMap`].size).toBe(1);
//     expect(cache[`valueMap`].get('key3')).toEqual({id: 'key3', val: 'val3'});
//   });
//
//   /** Test remove */
//   it('should remove a value', done => {
//     cache.remove({id: 'key1', val: 'val1'})
//       .then(value => {
//         expect(value).toEqual({id: 'key1', val: 'val1'});
//         expect(cache[`values`].length).toBe(1);
//         expect(cache[`valueMap`].size).toBe(1);
//         done();
//       });
//   });
//
//   it('should raise error if cache is not initialized', done => {
//     const emptyCache = new Cache();
//     emptyCache.remove({id: 'key1'})
//       .then(() => fail('Expected error'))
//       .catch(error => {
//         expect(error).toEqual('Unable to remove a value. Cache is not initialized');
//         done();
//       });
//   });
//
//   /** Test remove set */
//   it('should remove multiple values', done => {
//     cache.removeSet([{id: 'key1', val: 'val1'}, {id: 'key2', val: 'val2'}])
//       .then(() => {
//         expect(cache[`values`].length).toBe(0);
//         expect(cache[`valueMap`].size).toBe(0);
//         done();
//       });
//   });
//
//   /** Test reset */
//   it('should reset the cache', () => {
//     cache.reset();
//     expect(cache[`values`]).toBeUndefined();
//     expect(cache[`valueMap`]).toBeUndefined();
//   });
//
//   /** Test update */
//   it('should update a value', done => {
//     cache.update({id: 'key1', val: 'updated'})
//       .then(value => {
//         expect(value).toEqual({id: 'key1', val: 'updated'});
//         expect(cache[`values`].length).toBe(2);
//         expect(cache[`values`]).toContain({id: 'key1', val: 'updated'});
//         expect(cache[`values`]).toContain({id: 'key2', val: 'val2'});
//         expect(cache[`valueMap`].size).toBe(2);
//         expect(cache[`valueMap`].get('key1')).toEqual({id: 'key1', val: 'updated'});
//         expect(cache[`valueMap`].get('key2')).toEqual({id: 'key2', val: 'val2'});
//         done();
//       });
//   });
//
//   it('should raise error if cache is not initialized', done => {
//     const emptyCache = new Cache();
//     emptyCache.update({id: 'key1'})
//       .then(() => fail('Expected error'))
//       .catch(error => {
//         expect(error).toEqual('Unable to update a value. Cache is not initialized');
//         done();
//       });
//   });
//
// });
