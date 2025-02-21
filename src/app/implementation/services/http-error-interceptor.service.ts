/*
 * Copyright 2021-2024 Aion Technology LLC
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

import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router'
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

/**
 * Handles error responses from server.
 */
@Injectable()
export class HttpErrorInterceptorService {

  constructor(private router: Router,
              private snackBar: MatSnackBar) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(

      catchError((error: HttpErrorResponse) => {

        let errorMsg: string;
        const serverMsg = error?.error?.message;

        if (serverMsg) {
          errorMsg = serverMsg;
          console.error('server-side error:', errorMsg);
        } else {
          switch (error.status) {
            case 401:
              this.router.navigate(['/login']);
              break;
            case 404:
              break;
            default:
              errorMsg = `Error: ${error.status} - ${error.message}`;
          }
        }

        if (errorMsg) {
          this.displayError(errorMsg);
        }

        return throwError(error);

      })

    );

  }

  private displayError(e: string): void {
    this.snackBar.open(e, '', {
      duration: 7500,
      horizontalPosition: 'center',
      panelClass: 'error-snackbar',
      verticalPosition: 'bottom'
    });
  }

}
