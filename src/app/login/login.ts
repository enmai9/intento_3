// src/app/inicio/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  // Modo del formulario: 'login' o 'registro'
  modo: 'login' | 'registro' = 'login';

  // Datos del formulario
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  nombreCompleto: string = '';

  // Estados de la UI
  cargando: boolean = false;
  errorMensaje: string = '';
  exitoMensaje: string = '';
  mostrarPassword: boolean = false;

  // Cambiar entre login y registro
  cambiarModo(nuevoModo: 'login' | 'registro') {
    this.modo = nuevoModo;
    this.errorMensaje = '';
    this.exitoMensaje = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.nombreCompleto = '';
  }

  // Alternar visibilidad de la contraseña
  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // Validaciones básicas
  private validarFormulario(): boolean {
    if (!this.email || !this.password) {
      this.errorMensaje = 'Por favor, completa todos los campos.';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMensaje = 'Ingresa un correo electrónico válido.';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMensaje = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }

    if (this.modo === 'registro') {
      if (this.password !== this.confirmPassword) {
        this.errorMensaje = 'Las contraseñas no coinciden.';
        return false;
      }
      if (!this.nombreCompleto.trim()) {
        this.errorMensaje = 'Ingresa tu nombre completo.';
        return false;
      }
    }

    return true;
  }

  // === INICIAR SESIÓN ===
  async onSubmit() {
    this.errorMensaje = '';
    this.exitoMensaje = '';

    if (!this.validarFormulario()) return;

    this.cargando = true;

    try {
      if (this.modo === 'login') {
        const { data, error } = await this.supabaseService.signIn(this.email, this.password);

        if (error) throw error;

        if (data.session) {
          // Login exitoso → redirigir al panel principal
          this.router.navigate(['/principal']);
        }
      } else {
        // === REGISTRO ===
        const { data, error } = await this.supabaseService.signUp(this.email, this.password);

        if (error) throw error;

        // Guardar el nombre completo en la tabla 'profiles'
        if (data.user) {
          try {
            await this.supabaseService.createProfile(
              data.user.id,
              this.email,
              this.nombreCompleto,
            );
          } catch (profileError) {
            console.error('Error al crear perfil:', profileError);
          }
        }

        // Si Supabase requiere confirmación por email
        if (data.user && !data.session) {
          this.exitoMensaje = '¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.';
        } else {
          // Si no requiere confirmación, ya está logueado
          this.router.navigate(['/principal']);
        }
      }
    } catch (error: any) {
      console.error('Error de autenticación:', error);
      
      // Traducir errores comunes de Supabase
      if (error.message?.includes('Invalid login credentials')) {
        this.errorMensaje = 'Correo o contraseña incorrectos.';
      } else if (error.message?.includes('User already registered')) {
        this.errorMensaje = 'Este correo ya está registrado. Intenta iniciar sesión.';
      } else if (error.message?.includes('Email not confirmed')) {
        this.errorMensaje = 'Debes confirmar tu correo antes de iniciar sesión.';
      } else {
        this.errorMensaje = error.message || 'Ocurrió un error. Intenta de nuevo.';
      }
    } finally {
      this.cargando = false;
    }
  }
}