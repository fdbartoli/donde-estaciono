import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayParking } from './pay-parking';

describe('PayParking', () => {
  let component: PayParking;
  let fixture: ComponentFixture<PayParking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayParking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayParking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
