import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginComponent } from '../../login/login';


@Component({
  selector: 'app-select-parking',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './select-parking.html',
  styleUrls: ['./select-parking.scss'],
})
export class SelectParkingComponent {
  private router = inject(Router);

  mapSrc = 'assets/mapa_con_estacionamientos.png';
  showLogin = false;

  reservar() {
    this.showLogin = true;
    document.body.style.overflow = 'hidden';
  }

  closeLogin() {
    this.showLogin = false;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.showLogin) this.closeLogin();
  }
}
