import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },

  {
    path: 'buscar-estacionamiento',
    loadComponent: () =>
      import('./pages/event-search/event-search.component').then(m => m.EventSearchComponent),
  },
  {
    path: 'select-parking',
    loadComponent: () =>
      import('./pages/select-parking/select-parking').then(m => m.SelectParkingComponent),
  },
  {
    path: 'pay-parking',
    loadComponent: () =>
      import('./pages/pay-parking/pay-parking/pay-parking').then(m => m.PayParkingComponent),
  },

  {
    path: 'owner/events',
    loadComponent: () =>
      import('./pages/parking-owner-events/parking-owner-events')
        .then(m => m.ParkingOwnerEventsComponent),
  },

  { path: '**', redirectTo: '' },
];
