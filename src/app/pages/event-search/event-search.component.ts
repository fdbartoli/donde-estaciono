import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';


type EventResult = {
  id: string | number;
  name: string;
  city?: string;
  venue?: string;
  date?: string | Date;   // ISO string o Date
  banner?: string;
};

@Component({
  selector: 'app-event-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-search.component.html',
  styleUrls: ['./event-search.component.scss'],
})
export class EventSearchComponent {
  private fb = inject(FormBuilder);
   private router = inject(Router);

  private readonly MOCK_EVENTS: EventResult[] = [
    {
      id: 1,
      name: 'Coldplay - Music of the Spheres',
      city: 'Buenos Aires',
      venue: 'River Plate',
      date: '2025-11-21',
      banner: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Feria del Libro',
      city: 'Buenos Aires',
      venue: 'La Rural',
      date: '2025-05-10',
      banner: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Dua Lipa Tour',
      city: 'CABA',
      venue: 'Movistar Arena',
      date: '2025-09-15',
      banner: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 4,
      name: 'La Renga',
      city: 'Córdoba',
      venue: 'Estadio Kempes',
      date: '2025-12-02',
      banner: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 5,
      name: 'The Weeknd',
      city: 'Rosario',
      venue: 'Anfiteatro Municipal',
      date: '2025-08-09',
      banner: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop'
    }
  ];

  form = this.fb.group({
    query: ['', Validators.required],
    city: [''],
    date: [''],
  });

  submitted = false;
  loading = false;
  results: EventResult[] = [];

  get queryCtrl() {
    return this.form.get('query')!;
  }

  async submit() {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;


    const { query, city, date } = this.form.value;

    const norm = (s: string) =>
      s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const matchesDate = (evDate?: string | Date, picked?: string) => {
      if (!picked) return true;
      if (!evDate) return false;
      const d1 = new Date(evDate);
      const d2 = new Date(picked);
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    };

    const q = norm(query ?? '');
    const c = norm(city ?? '');

    const filtered = this.MOCK_EVENTS.filter(e => {
      const nameOk = norm(e.name).includes(q);
      const cityVenueOk =
        !c ||
        norm(e.city ?? '').includes(c) ||
        norm(e.venue ?? '').includes(c);
      const dateOk = matchesDate(e.date, date ?? undefined);
      return nameOk && cityVenueOk && dateOk;
    });

    this.results = [...filtered];
    this.loading = false;
  }

  clear() {
    this.form.reset();
    this.submitted = false;
    this.results = [];
  }

  trackById(_: number, e: EventResult) {
    return e.id;
  }
  
  
  goToParking(e: any) {
    this.router.navigate(['/select-parking'], { state: { event: e } });
  }

}
