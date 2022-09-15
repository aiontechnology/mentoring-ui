import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRegistrationThanksComponent } from './student-registration-thanks.component';

describe('StudentRegistrationThanksComponent', () => {
  let component: StudentRegistrationThanksComponent;
  let fixture: ComponentFixture<StudentRegistrationThanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentRegistrationThanksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentRegistrationThanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
