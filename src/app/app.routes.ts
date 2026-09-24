import { inject } from '@angular/core';
import { CanActivateFn, Routes, Router } from '@angular/router';
import { Admin } from './admin/admin';
import { Inicio } from './inicio/inicio';
import { Login } from './login/login';
import { Principal } from './principal/principal';
import { SupabaseService } from './services/supabase';

const adminGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  try {
    const session = await supabaseService.getSession();

    if (!session) {
      return router.createUrlTree(['/inicio/login']);
    }

    const profile = await supabaseService.getCurrentProfile();

    if (profile?.role === 'admin') {
      return true;
    }

    return router.createUrlTree(['/principal']);
  } catch (error) {
    console.error('No se pudo validar acceso de administrador.', error);
    return router.createUrlTree(['/principal']);
  }
};

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'inicio/login', component: Login },
  { path: 'login', redirectTo: 'inicio/login', pathMatch: 'full' },
  { path: 'principal', component: Principal },
  { path: 'principal/equipos', component: Principal },
  { path: 'principal/espacios', component: Principal },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: '**', redirectTo: 'inicio' },
];
