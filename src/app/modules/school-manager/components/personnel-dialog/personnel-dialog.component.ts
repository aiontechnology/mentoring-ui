import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonnelRepositoryService } from '../../services/personnel/personnel-repository.service';
import { Personnel } from '../../models/personnel/personnel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CallerWithErrorHandling } from 'src/app/implementation/util/caller-with-error-handling';

@Component({
  selector: 'ms-personnel-dialog',
  templateUrl: './personnel-dialog.component.html',
  styleUrls: ['./personnel-dialog.component.scss']
})
export class PersonnelDialogComponent {

  model: FormGroup;
  isUpdate = false;

  schoolId: string;

  private caller = new CallerWithErrorHandling<Personnel, PersonnelDialogComponent>();

  constructor(private dialogRef: MatDialogRef<PersonnelDialogComponent>,
              private personnelService: PersonnelRepositoryService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: any) {
    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(formBuilder, data?.model);
    this.schoolId = data.schoolId;
  }

  titles: any[] = [
    { value: 'SOCIAL_WORKER', valueView: 'Social Worker' },
    { value: 'PRINCIPAL', valueView: 'Principal' },
    { value: 'COUNSELOR', valueView: 'Counselor' },
    { value: 'STAFF', valueView: 'Staff' }
  ];

  save(): void {
    const newPersonnel = new Personnel(this.model.value);
    let func: (item: Personnel) => Promise<Personnel>;
    if (this.isUpdate) {
      console.log('Updating', this.model.value);
      newPersonnel._links = this.model.value.personnel._links;
      func = this.personnelService.updatePersonnel;
    } else {
      func = this.personnelService.curriedCreatePersonnel(this.schoolId);
    }
    this.caller.callWithErrorHandling(this.personnelService, func, newPersonnel, this.dialogRef, this.snackBar);
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: FormBuilder, personnel: Personnel): FormGroup {
    const formGroup = formBuilder.group({
      personnel,
      type: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      workPhone: null,
      cellPhone: null,
      email: [null, [Validators.email, Validators.maxLength(50)]]
    });
    if (this.isUpdate) {
      formGroup.setValue({
        personnel,
        type: personnel?.type,
        firstName: personnel?.firstName,
        lastName: personnel?.lastName,
        workPhone: personnel?.workPhone,
        cellPhone: personnel?.cellPhone,
        email: personnel?.email
      })
    }
    return formGroup;
  }

  private determineUpdate(formData: any): boolean {
    return formData.model !== undefined && formData.model !== null;
  }

}
