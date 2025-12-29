import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibleScheduleComponent } from './bible-schedule.component';

describe('BibleScheduleComponent', () => {
  let component: BibleScheduleComponent;
  let fixture: ComponentFixture<BibleScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BibleScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibleScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
