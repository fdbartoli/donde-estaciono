import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header';
import { filter } from 'rxjs';
import { ChatbotWidgetComponent } from "./chatbot-widget/chatbot-widget";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ChatbotWidgetComponent],
  template: `
    <app-header />
    <router-outlet />
    <app-chatbot-widget />
  `,
})
export class App {
    private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const html = document.documentElement;
        const body = document.body;

        body.classList.remove('cdk-global-scrollblock', 'modal-open', 'no-scroll');
        html.classList.remove('cdk-global-scrollblock');

        body.style.overflow = '';
        html.style.overflow = '';
        body.style.position = '';
        body.style.width = '';
      });
  }
}
