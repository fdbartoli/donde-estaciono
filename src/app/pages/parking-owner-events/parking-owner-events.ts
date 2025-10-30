import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type EventStatus = 'draft' | 'published' | 'finished';

export interface ParkingEvent {
  id: string;
  name: string;
  venue: string;
  date: string;        // ISO yyyy-MM-dd
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  price: number;       // ARS
  totalSpots: number;
  availableSpots: number;
  status: EventStatus;
  notes?: string;
}

const LS_KEY = 'owner_events_v1';

@Component({
  selector: 'app-parking-owner-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parking-owner-events.html',
  styleUrls: ['./parking-owner-events.scss']
})
export class ParkingOwnerEventsComponent {
  q = signal('');
  status = signal<'all' | EventStatus>('all');
  from = signal<string>('');
  to = signal<string>('');

  events = signal<ParkingEvent[]>(this.load());
  selected = signal<ParkingEvent | null>(null);
  panelOpen = signal(false);
  isEditing = signal(false);

  constructor() {
    if (this.events().length === 0) {
      const sample: ParkingEvent[] = [
        {
          id: crypto.randomUUID(),
          name: 'Noche de Teatro',
          venue: 'Garage Rápido - Av. Cabildo 1234',
          date: this.addDays(1),
          startTime: '19:00',
          endTime: '23:30',
          price: 2500,
          totalSpots: 60,
          availableSpots: 42,
          status: 'published',
          notes: 'Descuento 10% para vecinos'
        },
        {
          id: crypto.randomUUID(),
          name: 'Partido Estadio',
          venue: 'Cocheras Plaza - Obligado 4321',
          date: this.addDays(3),
          startTime: '17:30',
          endTime: '22:00',
          price: 3200,
          totalSpots: 120,
          availableSpots: 12,
          status: 'published'
        },
        {
          id: crypto.randomUUID(),
          name: 'Feria de Emprendedores',
          venue: 'Estacionar Ya - Juramento 987',
          date: this.addDays(6),
          startTime: '10:00',
          endTime: '18:00',
          price: 1800,
          totalSpots: 40,
          availableSpots: 40,
          status: 'draft'
        }
      ];
      this.events.set(sample);
      this.persist();
    }
  }

  filtered = computed(() => {
    const list = this.events();
    const q = this.q().toLowerCase().trim();
    const status = this.status();
    const from = this.from();
    const to = this.to();

    return list
      .filter(e => {
        if (status !== 'all' && e.status !== status) return false;
        if (q) {
          const hay = `${e.name} ${e.venue}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (from && e.date < from) return false;
        if (to && e.date > to) return false;
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  });

  adjustAvailable(ev: ParkingEvent, delta: number) {
    const n = Math.max(0, Math.min(ev.totalSpots, ev.availableSpots + delta));
    ev.availableSpots = n;
    if (ev.availableSpots === 0 && ev.status === 'published') ev.status = 'finished';
    this.commit();
  }

  togglePublish(ev: ParkingEvent) {
    if (ev.status === 'published') {
      ev.status = 'draft';
    } else {
      ev.status = 'published';
    }
    this.commit();
  }

  duplicate(ev: ParkingEvent) {
    const copy: ParkingEvent = {
      ...ev,
      id: crypto.randomUUID(),
      name: ev.name + ' (copia)',
      status: 'draft'
    };
    this.events.update(arr => [copy, ...arr]);
    this.persist();
  }

remove(ev: ParkingEvent) {
  alert(`Vas a eliminar "${ev.name}". Esta acción es permanente y no se puede deshacer.`);
  if (!confirm(`Confirmá para eliminar "${ev.name}" de forma permanente.`)) return;
  this.events.update(arr => arr.filter(x => x.id !== ev.id));
  this.persist();
}

  openCreate() {
    this.isEditing.set(false);
    this.selected.set({
      id: crypto.randomUUID(),
      name: '',
      venue: '',
      date: this.todayISO(),
      startTime: '19:00',
      endTime: '23:00',
      price: 0,
      totalSpots: 0,
      availableSpots: 0,
      status: 'draft',
      notes: ''
    });
    this.panelOpen.set(true);
  }

  openEdit(ev: ParkingEvent) {
    this.isEditing.set(true);
    this.selected.set({ ...ev });
    this.panelOpen.set(true);
  }

  cancelPanel() {
    this.panelOpen.set(false);
    this.selected.set(null);
  }

  save() {
    const ev = this.selected();
    if (!ev) return;

    if (!ev.name.trim() || !ev.venue.trim()) {
      alert('Completá “Evento” y “Lugar”.');
      return;
    }
    if (ev.totalSpots < 0 || ev.availableSpots < 0) {
      alert('Los cupos no pueden ser negativos.');
      return;
    }
    if (ev.availableSpots > ev.totalSpots) {
      alert('Disponibles no puede superar el total.');
      return;
    }

    if (this.isEditing()) {
      this.events.update(arr => arr.map(x => (x.id === ev.id ? { ...ev } : x)));
    } else {
      this.events.update(arr => [{ ...ev }, ...arr]);
    }

    this.persist();
    this.cancelPanel();
  }

  // Helpers
  occupancyPct(ev: ParkingEvent) {
    if (ev.totalSpots <= 0) return 0;
    return Math.round(((ev.totalSpots - ev.availableSpots) / ev.totalSpots) * 100);
  }

  badge(ev: ParkingEvent) {
    return ev.status === 'draft' ? 'Borrador' : ev.status === 'published' ? 'Publicado' : 'Finalizado';
  }

  private commit() {
    this.events.update(arr => [...arr]);
    this.persist();
  }

  private persist() {
    localStorage.setItem(LS_KEY, JSON.stringify(this.events()));
  }

  private load(): ParkingEvent[] {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) as ParkingEvent[] : [];
    } catch {
      return [];
    }
  }

  private todayISO() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }
  private addDays(n: number) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }

    trackById(index: number, item: any): any {
    return item.id;
  }
}

