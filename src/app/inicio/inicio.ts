// src/app/inicio/inicio.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class Inicio {
  // Basado en tu justificación y "¿Qué resuelve tu proyecto?"
  beneficios = [
    {
      icono: '📝',
      titulo: 'Responsivas Digitales',
      descripcion: 'Elimina el daño anónimo. Cada equipo prestado queda registrado con la firma digital del responsable.'
    },
    {
      icono: '🏫',
      titulo: 'Reserva de Aulas Inteligente',
      descripcion: 'Visualiza disponibilidad en tiempo real y evita empalmes de horarios. Generación automática de actas.'
    },
    {
      icono: '📢',
      titulo: 'Cartelera Centralizada',
      descripcion: 'Mantente informado sobre eventos universitarios. Recibe invitaciones exclusivas o consulta la cartelera pública.'
    },
    {
      icono: '📦',
      titulo: 'Control de Inventario',
      descripcion: 'Historial exacto de equipos y materiales. Reporta daños y da seguimiento al desgaste físico.'
    }
  ];

  // Comparativa con otros sistemas (tu punto 3)
  comparativa = [
    { feature: 'Préstamo de Equipos', webcheckout: true, booked: false, calendar: false, nuestro: true },
    { feature: 'Reserva de Salas', webcheckout: false, booked: true, calendar: true, nuestro: true },
    { feature: 'Actas Automáticas', webcheckout: false, booked: false, calendar: false, nuestro: true },
    { feature: 'Reporte de Daños', webcheckout: false, booked: false, calendar: false, nuestro: true },
    { feature: 'Cartelera de Eventos', webcheckout: false, booked: false, calendar: false, nuestro: true },
    { feature: 'Costo', webcheckout: 'Alto', booked: 'Gratis (Limitado)', calendar: 'Suscripción', nuestro: 'Institucional' }
  ];
}