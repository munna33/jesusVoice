import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizManagmentComponent } from './quiz-managment.component';

describe('QuizManagmentComponent', () => {
  let component: QuizManagmentComponent;
  let fixture: ComponentFixture<QuizManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizManagmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
