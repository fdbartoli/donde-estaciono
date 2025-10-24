import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AUTH_PORT } from './auth.token';
import { AuthPort } from './auth.port';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const auth = inject<AuthPort>(AUTH_PORT);
  const router = inject(Router);
  return auth.user$.pipe(
    take(1),
    map(u => (u ? true : router.createUrlTree(['/login'])))
  );
};
