import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonnelService } from '../../services/personnel/personnel.service';
import { Personnel } from '../../models/personnel/personnel';

@Component({
  selector: 'ms-personnel-dialog',
  templateUrl: './personnel-dialog.component.html',
  styleUrls: ['./personnel-dialog.component.scss']
})
export class PersonnelDialogComponent {

  model: FormGroup;
  schoolId: string;

  constructor(private dialogRef: MatDialogRef<PersonnelDialogComponent>,
              private personnelService: PersonnelService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data: any) {
    this.model = this.createModel(formBuilder);
    this.schoolId = data.schoolId;
  }

  titles: any[] = [
    { value: 'SOCIAL_WORKER', valueView: 'Social Worker' },
    { value: 'PRINCIPAL', valueView: 'Principal' },
    { value: 'COUNSELOR', valueView: 'Counselor' },
    { value: 'STAFF', valueView: 'Staff' }
  ];

  save(): void {
    const newPersonnel = this.model.value as Personnel;
    this.personnelService.addPersonnel(this.schoolId, newPersonnel).then(p => {
      this.dialogRef.close(p);
    });
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  private createModel(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      type: '',
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      workPhone: '',
      cellPhone: '',
      email: ''
    });
  }

}
