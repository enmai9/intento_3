// src/app/foot/footer/footer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './foot.html',
  styleUrls: ['./foot.css']
})
export class Foot {
  currentYear: number = new Date().getFullYear();

  // Datos de contacto (puedes cambiarlos por los reales de tu universidad)
  contactInfo = {
    email: 'prestamos@universidad.edu',
    phone: '+52 123 456 7890',
    address: 'Av. Universidad #123, Ciudad Universitaria'
  };
}