import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationidModalComponent } from './registrationid-modal.component';

describe('RegistrationidModalComponent', () => {
  let component: RegistrationidModalComponent;
  let fixture: ComponentFixture<RegistrationidModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationidModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationidModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
