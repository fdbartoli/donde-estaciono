import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthPort, AuthUser } from './auth.port';

@Injectable({ providedIn: 'root' })
export class FakeAuthService implements AuthPort {
  private _user = new BehaviorSubject<AuthUser | null>(null);
  user$ = this._user.asObservable();

  async signInWithGoogle(): Promise<void> {
    this._user.next({
      uid: 'fake-google',
      email: 'demo@donde-estaciono.test',
      displayName: 'Usuario Demo',
      photoURL: null,
    });
  }

  async signInWithEmail(email: string, _password: string): Promise<void> {
    this._user.next({
      uid: 'fake-email',
      email,
      displayName: email.split('@')[0],
      photoURL: null,
    });
  }

  async signUpWithEmail(email: string, password: string): Promise<void> {
    await this.signInWithEmail(email, password);
  }

  async signOut(): Promise<void> {
    this._user.next(null);
  }
}
