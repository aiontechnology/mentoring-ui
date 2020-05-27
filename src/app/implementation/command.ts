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

import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

export abstract class Command {

    constructor(public title: string) {}

    group: string;
    isVisible = true;

    abstract execute(...args: any[]): void;

    abstract isEnabled(...args: any[]): boolean;

    protected openSnackBar(snackBar: MatSnackBar, message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
        return snackBar.open(message, action, {
            duration: 5000,
        });
    }

}

