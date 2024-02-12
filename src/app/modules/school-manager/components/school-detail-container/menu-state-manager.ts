/*
 * Copyright 2022-2024 Aion Technology LLC
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

import {UserLoginService} from '@implementation/security/user-login.service';
import {MenuStateService} from '@implementation/services/menu-state.service';
import {SCHOOL_GROUP} from '@modules-shared/other/shared-constants';
import {PERSONNEL_GROUP, PROGRAM_ADMIN_GROUP, SCHOOL_BOOK_GROUP, SCHOOL_GAME_GROUP, TEACHER_GROUP} from '../../school-manager.module';

export const setState = (index: number, menuState: MenuStateService, userLoginService: UserLoginService): void => {
  menuState.makeAllInvisible();
  if (userLoginService.isSystemAdmin) {
    switch (index) {
      case 0:
        menuState.makeGroupVisible(SCHOOL_GROUP)
        break;
      case 1:
        menuState.makeGroupVisible(PROGRAM_ADMIN_GROUP)
        break;
      case 2:
        menuState.makeGroupVisible(TEACHER_GROUP)
        break;
      case 3:
        menuState.makeGroupVisible(PERSONNEL_GROUP)
        break;
      case 4:
        menuState.makeGroupVisible(SCHOOL_BOOK_GROUP)
        break;
      case 5:
        menuState.makeGroupVisible(SCHOOL_GAME_GROUP)
        break;
    }
  } else {
    switch (index) {
      case 0:
        menuState.makeGroupVisible(SCHOOL_GROUP)
        break;
      case 1:
        menuState.makeGroupVisible(TEACHER_GROUP)
        break;
      case 2:
        menuState.makeGroupVisible(PERSONNEL_GROUP)
        break;
      case 3:
        menuState.makeGroupVisible(SCHOOL_BOOK_GROUP)
        break;
      case 4:
        menuState.makeGroupVisible(SCHOOL_GAME_GROUP)
        break;
    }
  }
};
