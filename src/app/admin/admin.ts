import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  users: any[] = [];
  items: any[] = [];
  loans: any[] = [];
  loading = false;

  async ngOnInit(): Promise<void> {
    this.loading = true;

    try {
      const session = await this.supabaseService.getSession();

      if (!session) {
        await this.router.navigate(['/inicio/login']);
        return;
      }

      const profile = await this.supabaseService.getCurrentProfile();

      if (profile?.role !== 'admin') {
        await this.router.navigate(['/principal']);
        return;
      }

      this.users = await this.supabaseService.getProfiles();
      this.items = await this.supabaseService.getItems();
      this.loans = await this.supabaseService.getLoans();
    } catch (error) {
      console.error('No se pudo cargar el panel de administrador.', error);
      await this.router.navigate(['/principal']);
    } finally {
      this.loading = false;
    }
  }
}
