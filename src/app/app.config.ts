import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { environment } from '../environments/environment';
import { FakeAuthService } from './auth/fake-auth.service';
import { FirebaseAuthService } from './auth/firebase-auth.service';
import { AUTH_PORT } from './auth/auth.token';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    { provide: AUTH_PORT, useClass: environment.useFakeAuth ? FakeAuthService : FirebaseAuthService },
  ],
};
