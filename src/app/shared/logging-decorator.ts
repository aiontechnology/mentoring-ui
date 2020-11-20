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

/**
 * Method deocorator that surrounds a method call with log messages.
 *
 * @param target The target object.
 * @param propertyKey The name of the property (method) that is being decorated.
 * @param descriptor The descriptor of the property (method).
 */
export function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    const originalFunc = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const method = `${target.constructor.name}.${propertyKey}`;
        console.log(`=> ${method}(${args.join(', ')})`);
        const result = originalFunc.apply(this, args);
        if (result !== undefined) {
            console.log(`<= ${method} - ${result}`);
        } else {
            console.log(`<= ${method}`);
        }
        return result;
    };

}
