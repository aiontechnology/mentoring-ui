/**
 * Copyright 2020 - 2021 Aion Technology LLC
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

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from 'src/app/modules/shared/models/book/book';
import { BookRepositoryService } from 'src/app/modules/shared/services/resources/book-repository.service';
import { Grade } from 'src/app/modules/shared/types/grade';
import { resourceGrades } from 'src/app/modules/shared/constants/resourceGrades';
import { MetaDataService } from 'src/app/modules/shared/services/meta-data/meta-data.service';
import { Observable } from 'rxjs';
import { resourceLocations } from 'src/app/modules/shared/constants/locations';

@Component({
  selector: 'ms-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.scss']
})
export class BookDialogComponent implements OnInit {

  model: FormGroup;
  isUpdate = false;

  grades: Grade[] = resourceGrades;
  locations: { [key: string]: string };
  interestList$: Observable<string[]>;
  leadershipTraitList$: Observable<string[]>;
  leadershipSkillList$: Observable<string[]>;
  phonogramList$: Observable<string[]>;
  behaviorList$: Observable<string[]>;
  tagsList$: Observable<string[]>;

  constructor(private dialogRef: MatDialogRef<BookDialogComponent>,
              private bookService: BookRepositoryService,
              private metaDataService: MetaDataService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {

    this.isUpdate = this.determineUpdate(data);
    this.model = this.createModel(this.formBuilder, this.data?.model);
    this.locations = resourceLocations;

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

  save(): void {

    const newBook = new Book(this.model.value);
    let value: Promise<Book>;

    console.log('Saving book', newBook);
    if (this.isUpdate) {
      console.log('Updating', this.model.value);
      newBook._links = this.model.value.book._links;
      value = this.bookService.updateBook(newBook);
    } else {
      value = this.bookService.createBook(newBook);
    }

    value.then((b: Book) => {
      this.dialogRef.close(b);
    });

  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

  // Used for the keyvalue pipe, to keep location properties in their default order.
  unsorted(): number {
    return 0;
  }

  private createModel(formBuilder: FormBuilder, book: Book): FormGroup {
    console.log('Book', book);
    const formGroup: FormGroup = formBuilder.group({
      book,
      title: ['', [Validators.required, Validators.maxLength(100)]],
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
    if (this.isUpdate) {
      formGroup.setValue({
        book,
        title: book?.title,
        author: book?.author,
        gradeLevel: book?.gradeLevel?.toString(),
        location: book?.location?.toString(),
        interests: book?.interests,
        leadershipSkills: book?.leadershipSkills,
        leadershipTraits: book?.leadershipTraits,
        phonograms: book?.phonograms,
        behaviors: book?.behaviors,
        tag: book?.tag
      });
    }
    return formGroup;
  }

  private determineUpdate(formData: any): boolean {
    return formData !== undefined && formData !== null;
  }

}
