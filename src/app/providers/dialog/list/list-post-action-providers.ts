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

import {InjectionToken, INJECTOR, Injector} from '@angular/core';
import {TableCache} from '../../../implementation/table-cache/table-cache';
import {AnyConsumer} from '../../../implementation/types/types';

export function listPostActionProviders<MODEL_TYPE, SERVICE_TYPE extends TableCache<MODEL_TYPE>>(
  name: InjectionToken<AnyConsumer>,
  serviceToken: InjectionToken<SERVICE_TYPE>
): any[] {
  return [
    {
      provide: name,
      useFactory: (injector: Injector) => {
        const service: SERVICE_TYPE = injector.get(serviceToken)
        return (item) => service.loadData()
          .then(() => {
            service.clearSelection();
            if (item) {
              service.jumpToItem(item);
            }
          })
      },
      deps: [INJECTOR]
    },
  ]
}
