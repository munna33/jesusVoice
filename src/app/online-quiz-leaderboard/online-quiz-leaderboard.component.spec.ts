import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineQuizLeaderboardComponent } from './online-quiz-leaderboard.component';

describe('OnlineQuizLeaderboardComponent', () => {
  let component: OnlineQuizLeaderboardComponent;
  let fixture: ComponentFixture<OnlineQuizLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineQuizLeaderboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineQuizLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
