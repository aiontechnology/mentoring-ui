/*
 * Copyright 2022-2023 Aion Technology LLC
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

import {MalformedUrlError} from '@implementation/errors/malformed-url-error';
import {Resettable} from '@implementation/state-management/resettable';

export type URI = string;

export class UriSupplier implements Resettable {

  /** A collection of string substitutions that can be found by a key */
  private substitutions: Map<string, string>
  /** A collection of string parameters to be added to the URI */
  private parameters: Map<string, string>

  constructor(private base: string) {
    this.reset()
  }

  /**
   * Apply the various substitutions and return the resulting URI string.
   * @param resourceId The optional resource ID to place at the end of the URI.
   */
  apply = (resourceId?: string): URI => {
    let uri = this.base
    uri = this.substitute(uri);
    uri = resourceId ? uri + `/${resourceId}` : uri
    uri = this.addParameters(uri)
    // console.log('Constructed URI', uri)
    return uri
  }

  /**
   * Reset the URI supplier so that it can be reused.
   * @return The UriSupplier.
   */
  reset = (): UriSupplier => {
    this.substitutions = new Map<string, string>()
    this.parameters = new Map<string, string>()
    return this
  }

  /**
   * Add a substitution.
   * @param key The key to substitute.
   * @param value The value to substitute.
   * @return The UriSupplier.
   */
  withSubstitution = (key: string, value: string): UriSupplier => {
    if (value === undefined || value === null) {
      throw new MalformedUrlError(`Invalid value provided for URI substitution: ${key}=${value}`)
    }
    this.substitutions.set(key, value)
    return this
  }

  /**
   * Remove the given key from the set of parameters.
   * @param key The key to remove.
   */
  removeParameter = (key: string) => {
    this.parameters.delete(key)
    return this
  }

  /**
   * Add a parameter
   * @param key The parameter key to add.
   * @param value The value of the parameter.
   * @return The UriSupplier.
   */
  withParameter = (key: string, value: string): UriSupplier => {
    if (value === undefined || value === null) {
      throw new MalformedUrlError(`Invalid value provided for URI parameter: ${key}=${value}`)
    }
    this.parameters.set(key, value)
    return this
  }

  /**
   * Perform all substitutions.
   * @param uri The URI to on which substitutions should be done.
   * @return The URI with all substitutions completed.
   */
  private substitute = (uri: string): string => {
    this.substitutions.forEach((value, key) => {
      uri = uri.replace(`{${key}}`, value)
    });
    if (uri.search('{.*}') != -1) {
      throw new MalformedUrlError(`URI malformed: ${uri}`, uri)
    }
    return uri
  }

  /**
   * Add all parameters.
   * @param uri The URI to which parameters should be added.
   * @return The URI with all parameters added.
   */
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
