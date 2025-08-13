import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamResultsModalPopupComponent } from './exam-results-modal-popup.component';

describe('ExamResultsModalPopupComponent', () => {
  let component: ExamResultsModalPopupComponent;
  let fixture: ComponentFixture<ExamResultsModalPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamResultsModalPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamResultsModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
