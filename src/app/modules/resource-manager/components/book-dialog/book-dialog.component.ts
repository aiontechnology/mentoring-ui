/*
 * Copyright 2020-2022 Aion Technology LLC
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

import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {resourceLocations} from 'src/app/implementation/constants/locations';
import {resourceGrades} from 'src/app/implementation/constants/resourceGrades';
import {Book} from 'src/app/implementation/models/book/book';
import {Grade} from 'src/app/implementation/types/grade';
import {MetaDataService} from 'src/app/modules/shared/services/meta-data/meta-data.service';
import {AbstractDialogComponent} from '../../../../implementation/component/abstract-dialog-component';
import {DataSource} from '../../../../implementation/data/data-source';
import {BOOK_DATA_SOURCE} from '../../../../providers/global-book-providers-factory';

@Component({
  selector: 'ms-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.scss']
})
export class BookDialogComponent extends AbstractDialogComponent<Book, BookDialogComponent> implements OnInit {
  grades: Grade[] = resourceGrades;
  locations: { [key: string]: string } = resourceLocations;
  interestList$: Observable<string[]>;
  leadershipTraitList$: Observable<string[]>;
  leadershipSkillList$: Observable<string[]>;
  phonogramList$: Observable<string[]>;
  behaviorList$: Observable<string[]>;
  tagsList$: Observable<string[]>;

  constructor(
    // for super
    @Inject(MAT_DIALOG_DATA) data: any,
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<BookDialogComponent>,
    @Inject(BOOK_DATA_SOURCE) bookDataSource: DataSource<Book>,
    // other
    private metaDataService: MetaDataService,
  ) {
    super(data?.model as Book, formBuilder, dialogRef, bookDataSource)
  }

  ngOnInit(): void {
    this.metaDataService.loadInterests();
    this.interestList$ = this.metaDataService.interests;

    this.metaDataService.loadLeadershipTraits();
    this.leadershipTraitList$ = this.metaDataService.leadershipTraits;

    this.metaDataService.loadLeadershipSkills();
    this.leadershipSkillList$ = this.metaDataService.leadershipSkills;

    this.metaDataService.loadPhonograms();
    this.phonogramList$ = this.metaDataService.phonograms;

    this.metaDataService.loadBehaviors();
    this.behaviorList$ = this.metaDataService.behaviors;

    this.metaDataService.loadTags();
    this.tagsList$ = this.metaDataService.tags;
  }

  // Used for the keyvalue pipe, to keep location properties in their default order.
  unsorted(): number {
    return 0;
  }

  protected toModel(formValue: any): Book {
    const book: Book = new Book(formValue);
    if (this.isUpdate) {
      book.links = formValue.book.links
    }
    return book;
  }

  protected doCreateFormGroup(formBuilder: FormBuilder, book: Book): FormGroup {
    return formBuilder.group({
      book,
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(255)]],
      author: ['', [Validators.required, Validators.maxLength(30)]],
      gradeLevel: ['', Validators.required],
      location: ['OFFLINE', Validators.required],
      interests: [],
      leadershipTraits: [],
      leadershipSkills: [],
      phonograms: [],
      behaviors: [],
      tag: ['']
    });
  }

  protected doUpdateFormGroup(formGroup: FormGroup, book: Book): void {
    formGroup.setValue({
      book,
      title: book?.title,
      description: book?.description,
      author: book?.author,
      gradeLevel: book?.gradeLevel?.toString(),
      location: book?.location?.toString(),
      interests: book?.interests,
      leadershipSkills: book?.leadershipSkills,
      leadershipTraits: book?.leadershipTraits,
      phonograms: book?.phonograms,
      behaviors: book?.behaviors,
      tag: book?.tag
    })
  }
}
