import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pay-parking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pay-parking.html',
  styleUrls: ['./pay-parking.scss'],
})
export class PayParkingComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  readonly pricePerHour = Number((history.state && history.state.price) ?? 5000);
  readonly minHours = 1;
  readonly maxHours = 24;

  hours = 1;
  get total() { return this.pricePerHour * this.hours; }

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    number: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  get f() { return this.form.controls; }

  incHours() {
    this.hours = Math.min(this.maxHours, this.hours + 1);
  }
  decHours() {
    this.hours = Math.max(this.minHours, this.hours - 1);
  }
  onHoursInput(e: Event) {
    const raw = Number((e.target as HTMLInputElement).value || this.minHours);
    this.hours = Math.max(this.minHours, Math.min(this.maxHours, Math.floor(raw)));
  }

  pay() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    alert('Pago aprobado. ¡Reserva confirmada!');
    this.router.navigateByUrl('/');
  }

  cancel() {
    this.router.navigateByUrl('/select-parking');
  }
}
