import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineFinalExamLeaderBoardComponent } from './online-final-exam-leader-board.component';

describe('OnlineFinalExamLeaderBoardComponent', () => {
  let component: OnlineFinalExamLeaderBoardComponent;
  let fixture: ComponentFixture<OnlineFinalExamLeaderBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineFinalExamLeaderBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineFinalExamLeaderBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
