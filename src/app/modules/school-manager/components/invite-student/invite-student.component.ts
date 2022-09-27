import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Invitation} from '../../models/workflow/invitation';
import {INVITATION_DATA_SOURCE} from '../../../shared/shared.module';
import {DataSource} from '../../../../implementation/data/data-source';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'ms-invite-student',
  templateUrl: './invite-student.component.html',
  styleUrls: ['./invite-student.component.scss']
})
export class InviteStudentComponent implements OnInit {

  model: FormGroup;

  constructor(@Inject(INVITATION_DATA_SOURCE) private invitationDataSource: DataSource<Invitation>,
              private dialogRef: MatDialogRef<InviteStudentComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit(): void {
    this.model = this.createModel(this.formBuilder, this.data?.model);
  }

  save(): void {
    const invitation: Invitation = Invitation.of(this.model.value);
    this.invitationDataSource.add(invitation)
      .then(i => this.dialogRef.close(i));
  }

  dismiss(): void {
    this.dialogRef.close();
  }

  private createModel(formBuilder: FormBuilder, invitation: Invitation): FormGroup {
    return formBuilder.group({
      parent1FirstName: [invitation?.parent1FirstName, [Validators.required, Validators.maxLength(50)]],
      parent1LastName: [invitation?.parent1LastName, [Validators.required, Validators.maxLength(50)]],
      parent1EmailAddress: [invitation?.parent1EmailAddress, [Validators.required, Validators.maxLength(50)]],
      studentFirstName: [invitation?.studentFirstName, [Validators.required, Validators.maxLength(50)]],
      studentLastName: [invitation?.studentLastName, [Validators.required, Validators.maxLength(50)]],
    });
  }

}
