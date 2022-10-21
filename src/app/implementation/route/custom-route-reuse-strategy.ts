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

import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, Map<string, DetachedRouteHandle>>();

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const moduleRoutes = this.storedRoutes.get(route?.component?.name);
    return moduleRoutes?.get(route?.routeConfig?.path);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const moduleRoutes = this.storedRoutes.get(route?.component?.name);
    return moduleRoutes?.has(route?.routeConfig?.path);
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (route?.component?.name === 'ResourceListComponent' && route?.routeConfig?.path === '') {
      return true;
    }
    return false;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return (future.routeConfig === curr.routeConfig);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    let moduleRoutes = this.storedRoutes.get(route?.component?.name);
    if (moduleRoutes === undefined || moduleRoutes === null) {
      moduleRoutes = new Map<string, DetachedRouteHandle>();
      this.storedRoutes.set(route?.component?.name, moduleRoutes);
    }
    moduleRoutes.set(route?.routeConfig?.path, handle);
  }
}
