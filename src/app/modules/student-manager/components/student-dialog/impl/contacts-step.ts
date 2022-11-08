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

import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {emailAddressValidator} from '../../../../../implementation/form-validation/email-address-validator';
import {phoneValidator} from '../../../../../implementation/form-validation/phone-validator';
import {Student} from '../../../../../implementation/models/student/student';
import {FormGroupHolder} from './form-group-holder';
import {noContactMethodValidator} from './no-contact-method-validator';

export class ContactsStep extends FormGroupHolder<Student> {
  static EMERGENCY_CONTACT = 'emergencyContact'
  static PARENTS = 'parents'
  contactMethods: string[] = ['Phone', 'Email', 'Either'];

  constructor(
    student: Student,
    formBuilder: FormBuilder
  ) {
    super(student, formBuilder)
  }

  get hasEmergencyContact(): boolean {
    return this.emergencyContact !== null
  }

  get contactsIsFull(): boolean {
    return this.parentsIsFull && this.hasEmergencyContact
  }

  get parentsIsFull(): boolean {
    return this.parents.length >= 2
  }

  get contactsIsEmpty(): boolean {
    return this.parents.length === 0 && !this.hasEmergencyContact;
  }

  override get value(): any {
    const contacts: any[] = this.parents.value || []
    if(this.emergencyContact) {
      contacts.push(this.emergencyContact.value)
    }
    return {
      contacts: contacts,
    }
  }

  private get emergencyContact(): FormGroup {
    return this.formGroup.get(ContactsStep.EMERGENCY_CONTACT) as FormGroup
  }

  private get parents(): FormArray {
    return this.formGroup.get(ContactsStep.PARENTS) as FormArray
  }

  addEmergencyContact(): FormGroup {
    const emergencyContactFormGroup = this.createContactForm(true)
    this.formGroup.addControl(ContactsStep.EMERGENCY_CONTACT, emergencyContactFormGroup)
    return emergencyContactFormGroup
  }

  removeEmergencyContact() {
    this.formGroup.removeControl(ContactsStep.EMERGENCY_CONTACT)
  }

  addParent(): FormGroup {
    const parentFormGroup = this.createContactForm(false)
    this.parents.push(parentFormGroup)
    return parentFormGroup
  }

  removeParent(index: number) {
    this.parents.removeAt(index)
  }

  protected generateFormGroup(item: Student): FormGroup {
    return this.formBuilder.group({
      parents: this.formBuilder.array([])
    })
  }

  protected updateFormGroup(student: Student): void {
    student?.contacts
      .filter(contact => !contact.isEmergencyContact)
      .map(contact => this.addParent().setValue(contact))

    student?.contacts
      .filter(contact => contact.isEmergencyContact)
      .map(contact => this.addEmergencyContact().setValue(contact))
  }

  private createContactForm(isEmergencyContact: boolean): FormGroup {
    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      label: [null, [Validators.maxLength(50)]],
      phone: [null, phoneValidator()],
      email: [null, [emailAddressValidator(), Validators.maxLength(50)]],
      preferredContactMethod: null,
      isEmergencyContact,
      comment: ['']
    }, {
      validators: noContactMethodValidator()
    })
  }
}
