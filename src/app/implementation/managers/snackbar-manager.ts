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

import {MatLegacySnackBar as MatSnackBar, MatLegacySnackBarRef as MatSnackBarRef, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition, LegacySimpleSnackBar as SimpleSnackBar} from '@angular/material/legacy-snack-bar';

export class SnackbarManager {
  constructor(private snackBar: MatSnackBar,
              private config = {
                panelClass: 'normal-snackbar',
                verticalPosition: 'top' as MatSnackBarVerticalPosition,
                duration: 5000,
              }) {
  }

  open(message: string, action = ''): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, this.config);
  }

}
