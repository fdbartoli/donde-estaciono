import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    private router = inject(Router);

  goToSearch(): void {
    this.router.navigateByUrl('/buscar-estacionamiento');
  }

  goToAdmin(): void {
    this.router.navigateByUrl('/owner/events');
  }

}
