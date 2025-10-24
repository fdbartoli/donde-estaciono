import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },

  // Login (lazy)
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },

  // Catch-all
  { path: '**', redirectTo: '' }
];
