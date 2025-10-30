import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingOwnerEvents } from './parking-owner-events';

describe('ParkingOwnerEvents', () => {
  let component: ParkingOwnerEvents;
  let fixture: ComponentFixture<ParkingOwnerEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingOwnerEvents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingOwnerEvents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
