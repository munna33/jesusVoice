import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineQuizChaptersComponent } from './online-quiz-chapters.component';

describe('OnlineQuizChaptersComponent', () => {
  let component: OnlineQuizChaptersComponent;
  let fixture: ComponentFixture<OnlineQuizChaptersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineQuizChaptersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineQuizChaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
