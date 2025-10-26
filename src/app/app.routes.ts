import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },

  {
    path: 'buscar-estacionamiento',
    loadComponent: () =>
      import('./pages/event-search/event-search.component').then(m => m.EventSearchComponent),
  },

  { path: '**', redirectTo: '' },
];
