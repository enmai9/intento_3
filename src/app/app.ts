import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Head } from './head/head';
import { Foot } from './foot/foot';
import { SupabaseService } from './services/supabase';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Head, Foot],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('proy_1');
  private readonly supabaseService = inject(SupabaseService);

  async ngOnInit(): Promise<void> {
    try {
      const session = await this.supabaseService.getSession();
      if (session) {
        console.log('✅ Sesión activa en Supabase:', session.user.email);
      }
    } catch (error) {
      console.warn('Supabase aún no está listo o no hay sesión activa.', error);
    }
  }
}

