import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPostAssessmentComponent } from './request-post-assessment.component';

describe('RequestPostAssessmentComponent', () => {
  let component: RequestPostAssessmentComponent;
  let fixture: ComponentFixture<RequestPostAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPostAssessmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPostAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
