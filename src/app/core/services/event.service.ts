import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface EventItem {
  id: string;
  name: string;
  city: string;
  venue: string;
  date: string;   // ISO (YYYY-MM-DD)
  banner?: string;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private url = 'assets/mocks/events.json';

  list(): Observable<EventItem[]> {
    return this.http.get<EventItem[]>(this.url);
  }

  search(q: string, city?: string, date?: string): Observable<EventItem[]> {
    const qNorm = (q ?? '').trim().toLowerCase();
    const cityNorm = (city ?? '').trim().toLowerCase();
    const dateNorm = (date ?? '').trim();

    return this.list().pipe(
      map(items =>
        items.filter(e => {
          const nameOk = qNorm ? e.name.toLowerCase().includes(qNorm) : true;
          const cityOk = cityNorm ? e.city.toLowerCase().includes(cityNorm) : true;
          const dateOk = dateNorm ? e.date === dateNorm : true;
          return nameOk && cityOk && dateOk;
        })
      )
    );
  }
}
