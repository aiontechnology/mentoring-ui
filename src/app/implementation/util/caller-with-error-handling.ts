import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export class CallerWithErrorHandling<T, R> {

    callWithErrorHandling(that: any, func: (item: T) => Promise<T>, item: T, dialogRef: MatDialogRef<R>, snackBar: MatSnackBar): void {
        func.apply(that, [item])
            .then((value: T) => {
                dialogRef.close(value);
            })
            .catch((error: any) => {
                console.log('Server error', error);
                snackBar.open(error?.message, '', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                });
            });
    }

}