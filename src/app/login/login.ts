import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AUTH_PORT } from '../auth/auth.token';
import { AuthPort } from '../auth/auth.port';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private auth = inject<AuthPort>(AUTH_PORT);
  private router = inject(Router);

  email = '';
  password = '';
  remember = false;

  async google() {
    await this.auth.signInWithGoogle();
    this.router.navigateByUrl('/');
  }
  async emailLogin() {
    await this.auth.signInWithEmail(this.email, this.password);
    this.router.navigateByUrl('/');
  }
  async emailSignup() {
    await this.auth.signUpWithEmail(this.email, this.password);
    this.router.navigateByUrl('/');
  }

  forgotPassword(e: Event) {
    e.preventDefault();
    // TODO: implementar flujo de 
  }
}
