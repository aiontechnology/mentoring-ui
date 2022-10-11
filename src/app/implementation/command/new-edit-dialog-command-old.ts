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

import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Command} from './command';

export abstract class NewEditDialogCommandOld<T> extends Command {

  protected constructor(title: string,
                        group: string,
                        private navigationBase: string[],
                        private postAction: (newItem: T) => void,
                        private router: Router,
                        private snackBar: MatSnackBar,
                        private snackBarMessage: string) {
    super(title, group, false);
  }

  protected override doPostExecute(dialog: MatDialogRef<any>) {
    dialog.afterClosed().subscribe(result => {
      if (this.navigationBase) {
        this.openSnackBar(this.snackBar, this.snackBarMessage, 'Navigate').onAction()
          .subscribe(() => {
            this.router.navigate([...this.navigationBase, result.id]);
          });
      } else {
        this.openSnackBar(this.snackBar, this.snackBarMessage, '');
      }
      this.postAction(result);
    });
  }

}
