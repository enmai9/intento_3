import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './head.html',
  styleUrl: './head.css',
})
export class Head implements OnInit {
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  userEmail: string | null = null;
  isAdmin = false;
  isMenuOpen = false;

  async ngOnInit(): Promise<void> {
    try {
      const session = await this.supabaseService.getSession();
      this.userEmail = session?.user?.email ?? null;
      await this.updateUserRole(session?.user?.id ?? null);

      this.supabaseService.onAuthStateChange(async (_event, session) => {
        this.userEmail = session?.user?.email ?? null;
        await this.updateUserRole(session?.user?.id ?? null);
      });
    } catch (error) {
      console.warn('No hay sesión activa para el header.', error);
      this.userEmail = null;
      this.isAdmin = false;
    }
  }

  private async updateUserRole(userId: string | null): Promise<void> {
    if (!userId) {
      this.isAdmin = false;
      return;
    }

    try {
      const profile = await this.supabaseService.getProfile(userId);
      this.isAdmin = profile?.role === 'admin';
    } catch (error) {
      console.warn('No se pudo cargar el rol del usuario.', error);
      this.isAdmin = false;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  async logout(): Promise<void> {
    try {
      await this.supabaseService.signOut();
      this.userEmail = null;
      this.isAdmin = false;
      await this.router.navigate(['/inicio']);
    } catch (error) {
      console.error('Error cerrando sesión', error);
    }
  }
}
