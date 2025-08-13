import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyPuzzleLeaderboardComponent } from './weekly-puzzle-leaderboard.component';

describe('WeeklyPuzzleLeaderboardComponent', () => {
  let component: WeeklyPuzzleLeaderboardComponent;
  let fixture: ComponentFixture<WeeklyPuzzleLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyPuzzleLeaderboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyPuzzleLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
