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

import {MalformedUrlError} from '../errors/malformed-url-error';
import {Resettable} from '../state-management/resettable';

export type URI = string;

export class UriSupplier implements Resettable {

  private substitutions
  private parameters

  constructor(private base: string) {
    this.reset()
  }

  apply = (resourceId?: string): URI => {
    let uri = this.base
    uri = this.substitute(uri);
    uri = resourceId ? uri + `/${resourceId}` : uri
    uri = this.addParameters(uri)
    console.log('Constructed URI', uri)
    return uri
  }

  reset = (): UriSupplier => {
    this.substitutions = new Map<string, string>()
    this.parameters = new Map<string, string>()
    return this
  }

  removeSubstitution = (key: string) => {
    this.substitutions.delete(key)
    return this
  }

  withSubstitution = (key: string, value: string): UriSupplier => {
    if(value === undefined || value === null) {
      throw new MalformedUrlError(`Invalid value provided for URI substitution: ${key}=${value}`)
    }
    this.substitutions.set(key, value)
    return this
  }

  removeParameter = (key: string) => {
    this.parameters.delete(key)
    return this
  }

  withParameter = (key: string, value: string): UriSupplier => {
    if(value === undefined || value === null) {
      throw new MalformedUrlError(`Invalid value provided for URI parameter: ${key}=${value}`)
    }
    this.parameters.set(key, value)
    return this
  }

  private substitute = (uri: string): string => {
    this.substitutions.forEach((value, key) => {
      uri = uri.replace(`{${key}}`, value)
    });
    if(uri.search('{.*}') != -1) {
      throw new MalformedUrlError(`URI malformed: ${uri}`, uri)
    }
    return uri
  }

  private addParameters = (uri: string): string => {
    let isFirst = true
    this.parameters.forEach((value, key) => {
      uri += isFirst ? '?' : '&'
      uri += `${key}=${value}`
      isFirst = false
    });
    return uri
  }

}
