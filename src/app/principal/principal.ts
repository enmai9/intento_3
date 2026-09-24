import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './principal.html',
  styleUrl: './principal.css',
})
export class Principal implements OnInit {
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  items: any[] = [];
  loading = false;
  errorMessage = '';
  currentType: 'equipment' | 'space' = 'equipment';

  stats = [
    { label: 'Equipos activos', value: 24 },
    { label: 'Espacios libres', value: 10 },
    { label: 'Préstamos hoy', value: 7 },
  ];

  quickActions = [
    { title: 'Solicitar equipo', text: 'Equipos de laboratorio, audio y oficina.', icon: '💻' },
    { title: 'Reservar aula', text: 'Espacios para tutorías o presentaciones.', icon: '🏫' },
    { title: 'Ver historial', text: 'Revisa tus reservas y solicitudes.', icon: '📋' },
  ];

  featuredItems = [
    { name: 'Laptop Dell Latitude', type: 'Equipo', badge: 'Alta demanda' },
    { name: 'Proyector Epson', type: 'Equipo', badge: 'Disponible' },
    { name: 'Aula 204', type: 'Espacio', badge: 'Libre hoy' },
  ];

  get totalDisponibles(): number {
    return this.items.filter((item) => item.status === 'available').length;
  }

  async ngOnInit(): Promise<void> {
    this.route.url.subscribe(() => {
      const currentUrl = this.router.url;
      this.currentType = currentUrl.includes('/espacios') ? 'space' : 'equipment';
      this.loadItems();
    });
  }

  async loadItems(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      this.items = await this.supabaseService.getItems(this.currentType);
    } catch (error: any) {
      this.errorMessage = 'No se pudieron cargar los elementos.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      available: 'Disponible',
      loaned: 'Prestado',
      maintenance: 'Mantenimiento',
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      returned: 'Devuelto',
    };

    return labels[status] ?? status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      available: 'bg-emerald-100 text-emerald-700',
      loaned: 'bg-amber-100 text-amber-700',
      maintenance: 'bg-slate-200 text-slate-700',
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-sky-100 text-sky-700',
      rejected: 'bg-red-100 text-red-700',
      returned: 'bg-gray-100 text-gray-700',
    };

    return classes[status] ?? 'bg-slate-100 text-slate-700';
  }

  async solicitarItem(item: any): Promise<void> {
    const session = await this.supabaseService.getSession();

    if (!session) {
      await this.router.navigate(['/inicio/login']);
      return;
    }

    try {
      await this.supabaseService.createLoan({
        user_id: session.user.id,
        item_id: item.id,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 86400000).toISOString(),
        status: 'pending',
      });

      alert('Solicitud enviada correctamente.');
      await this.loadItems();
    } catch (error: any) {
      console.error(error);
      alert('No se pudo enviar la solicitud.');
    }
  }
}

