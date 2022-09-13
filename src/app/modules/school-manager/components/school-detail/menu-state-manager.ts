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

import {UserSessionService} from '../../../../services/user-session.service';
import {MenuStateService} from '../../../../services/menu-state.service';

export const setState = (index: number, menuState: MenuStateService, userSession: UserSessionService): void => {
  menuState.makeAllVisible();
  if (userSession.isSysAdmin) {
    switch (index) {
      case 0:
        menuState.makeGroupInvisible('teacher');
        menuState.makeGroupInvisible('program-admin');
        menuState.makeGroupInvisible('personnel');
        menuState.makeGroupInvisible('school-book');
        menuState.makeGroupInvisible('school-game');
        break;
      case 1:
        menuState.makeGroupInvisible('school');
        menuState.makeGroupInvisible('teacher');
        menuState.makeGroupInvisible('personnel');
        menuState.makeGroupInvisible('school-book');
        menuState.makeGroupInvisible('school-game');
        break;
      case 2:
        menuState.makeGroupInvisible('school');
        menuState.makeGroupInvisible('program-admin');
        menuState.makeGroupInvisible('personnel');
        menuState.makeGroupInvisible('school-book');
        menuState.makeGroupInvisible('school-game');
        break;
      case 3:
        menuState.makeGroupInvisible('school');
        menuState.makeGroupInvisible('program-admin');
        menuState.makeGroupInvisible('teacher');
        menuState.makeGroupInvisible('school-book');
        menuState.makeGroupInvisible('school-game');
        break;
      case 4:
        menuState.makeGroupInvisible('school');
        menuState.makeGroupInvisible('program-admin');
        menuState.makeGroupInvisible('personnel');
        menuState.makeGroupInvisible('teacher');
        menuState.makeGroupInvisible('school-game');
        break;
      case 5:
        menuState.makeGroupInvisible('school');
        menuState.makeGroupInvisible('program-admin');
        menuState.makeGroupInvisible('personnel');
        menuState.makeGroupInvisible('teacher');
        menuState.makeGroupInvisible('school-book');
        break;
    }
  } else {
    switch (index) {
      case 0:
        menuState.makeGroupInvisible('teacher');
        menuState.makeGroupInvisible('program-admin');
        menuState.makeGroupInvisible('personnel');
        menuState.makeGroupInvisible('school-book');
        menuState.makeGroupInvisible('school-game');
        break;
      case 1:
        menuState.makeGroupInvisible('personnel');
        menuState.makeGroupInvisible('school-book');
        menuState.makeGroupInvisible('school-game');
        break;
      case 2:
        menuState.makeGroupInvisible('teacher');
        menuState.makeGroupInvisible('school-book');
        menuState.makeGroupInvisible('school-game');
        break;
      case 3:
        menuState.makeGroupInvisible('teacher');
        menuState.makeGroupInvisible('personnel');
        menuState.makeGroupInvisible('school-game');
        break;
      case 4:
        menuState.makeGroupInvisible('teacher');
        menuState.makeGroupInvisible('personnel');
        menuState.makeGroupInvisible('school-book');
        break;
    }
  }
};
