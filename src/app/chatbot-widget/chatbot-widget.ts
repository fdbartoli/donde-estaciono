import { CommonModule } from '@angular/common';
import { Component, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Msg = { id: number; from: 'bot'|'user'|'typing'; text: string; at: number };

const LS_KEY = 'chatbot_widget_state_v1';

const MENU_PROMPT = `¡Hola! Soy el asistente de ¿Dónde estaciono?
¿Tu consulta es sobre:
A) Buscar estacionamiento
B) Ver/editar mi reserva
C) Cancelar una reserva
D) Acceso e ingreso (dirección/QR)
E) Soy propietario
Elegí una opción.`;

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-widget.html',
  styleUrls: ['./chatbot-widget.scss']
})
export class ChatbotWidgetComponent {
  open = signal(false);
  sending = signal(false);
  typing = signal(false);
  input = signal('');
  unread = signal(0);
  quickReplies = signal<string[]>([
    'A) Buscar estacionamiento',
    'B) Ver/editar mi reserva',
    'C) Cancelar reserva',
    'D) Acceso/QR',
    'E) Soy propietario'
  ]);

  private seq = 0;
  messages = signal<Msg[]>([
    { id: ++this.seq, from: 'bot', text: MENU_PROMPT, at: Date.now() }
  ]);

  constructor() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        this.open.set(!!s.open);
        this.unread.set(s.unread ?? 0);
        this.seq = s.seq ?? this.seq;
        this.messages.set((s.messages ?? []).map((m: Msg) => ({ ...m, at: m.at ?? Date.now() })));
      }
    } catch {
      /* TODO CREATE CATCH*/
    }

    effect(() => {
      localStorage.setItem(LS_KEY, JSON.stringify({
        open: this.open(),
        unread: this.unread(),
        seq: this.seq,
        messages: this.messages()
      }));
    });

    effect(() => {
      if (this.open()) this.unread.set(0);
    });
  }

  toggle() {
    this.open.set(!this.open());
    if (this.open()) setTimeout(() => this.scrollToEnd(), 0);
  }

  reset() {
    this.seq = 0;
    this.messages.set([
      { id: ++this.seq, from: 'bot', text: MENU_PROMPT, at: Date.now() }
    ]);
    this.input.set('');
    this.unread.set(0);
    setTimeout(() => this.scrollToEnd(), 0);
  }

  clickQuickReply(text: string) {
    this.input.set(text);
    this.send();
  }

  send() {
    const text = this.input().trim();
    if (!text || this.sending()) return;

    this.push('user', text);
    this.input.set('');
    this.sending.set(true);
    this.typing.set(true);

    setTimeout(() => {
      const reply = this.mockReply(text);
      this.push('bot', reply);
      this.sending.set(false);
      this.typing.set(false);

      if (!this.open()) this.unread.set(this.unread() + 1);
      this.scrollToEnd();
    }, 700);
  }

  private push(from: Msg['from'], text: string) {
    this.messages.update(list => [...list, { id: ++this.seq, from, text, at: Date.now() }]);
  }

  private scrollToEnd() {
    const box = document.querySelector('.chatbot-panel .messages');
    box?.scrollTo({ top: (box as HTMLElement).scrollHeight, behavior: 'smooth' });
  }

  private mockReply(userText: string): string {
    const t = userText.toLowerCase();

    if (t.includes('hola') || t.includes('buen') || t.includes('cómo funciona') || t.includes('como funciona') || t.includes('ayuda')) {
      return MENU_PROMPT;
    }

    const barrios = ['belgrano', 'palermo', 'caballito', 'recoleta', 'flores'];
    const barrio = barrios.find(b => t.includes(b));
    if (barrio || t.includes('cochera') || t.includes('estacionar') || t.includes('cerca')) {
      const b = barrio ?? 'tu zona';
      return this.fakeParkingResults(b);
    }

    if (t.includes('precio') || t.includes('costo') || t.includes('horario') || t.includes('tarifa')) {
      return 'Las tarifas dependen de la zona y la franja horaria. En zonas residenciales suelen ir de ARS 3000 a 7600 por hora; en zonas comerciales, de ARS 5000 a 8000. ¿Querés que busque en un barrio puntual?';
    }

    if (t.includes('multa') || t.includes('eventos') || t.includes('amarilla') || t.includes('grua')) {
      return 'Coldplay se presenta el 15 de noviembre en el Estadio River Plate ¡Asegurate tu estacionamiento!.';
    }

    return `Para ayudarte rápido, elegí una opción.\n\n${MENU_PROMPT}`;
  }

  private fakeParkingResults(barrio: string): string {
    const sample = [
      { nombre: 'Garage Rápido', dir: 'Av. Cabildo 1234', dist: '350 m', tarifa: 'ARS 1.800/h', horario: '24 hs' },
      { nombre: 'Estacionar Ya', dir: 'Juramento 987', dist: '520 m', tarifa: 'ARS 1.500/h', horario: '07–23' },
      { nombre: 'Cocheras Plaza', dir: 'Vuelta de Obligado 4321', dist: '800 m', tarifa: 'ARS 2.400/h', horario: '24 hs' }
    ];
    const lines = sample.map(s => `• ${s.nombre} — ${s.dir} — ${s.dist} — ${s.tarifa} — ${s.horario}`).join('\n');
    return `Resultados en ${barrio}:\n${lines}\n\n¿Querés que te guíe hasta alguna?`;
  }

  trackById(index: number, item: any): any {
    return item.id || index;
  }
}
