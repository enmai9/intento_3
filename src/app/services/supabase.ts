import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  Session,
  SupabaseClient,
  createClient,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public supabase: SupabaseClient;

  private readonly fallbackProfiles = [
    { id: 'admin-user', email: 'admin@universidad.edu', full_name: 'Administrador', role: 'admin' },
    { id: 'user-1', email: 'alumno@universidad.edu', full_name: 'Alumno Demo', role: 'user' },
  ];

  private readonly fallbackItems = [
    { id: 1, name: 'Laptop Dell Latitude', status: 'available', type: 'equipment', categories: { name: 'Laptop', type: 'equipment' } },
    { id: 2, name: 'Proyector Epson', status: 'available', type: 'equipment', categories: { name: 'Proyector', type: 'equipment' } },
    { id: 3, name: 'Micrófono Rode', status: 'loaned', type: 'equipment', categories: { name: 'Audio', type: 'equipment' } },
    { id: 4, name: 'Aula 204', status: 'available', type: 'space', categories: { name: 'Aula', type: 'space' } },
    { id: 5, name: 'Sala de reuniones', status: 'pending', type: 'space', categories: { name: 'Sala', type: 'space' } },
  ];

  private readonly fallbackLoans = [
    { id: 1, user_id: 'user-1', item_id: 1, start_date: '2026-09-22', end_date: '2026-09-24', status: 'pending' },
    { id: 2, user_id: 'admin-user', item_id: 4, start_date: '2026-09-21', end_date: '2026-09-23', status: 'approved' },
  ];

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  async getSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return data.session;
  }

  async getCurrentProfile() {
    const session = await this.getSession();

    if (!session?.user?.id) {
      return null;
    }

    return this.getProfile(session.user.id);
  }

  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  async signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }

  async createProfile(userId: string, email: string, fullName: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          email,
          full_name: fullName || null,
          role: 'user',
        },
        { onConflict: 'id' },
      )
      .select();

    if (error) {
      throw error;
    }

    return data?.[0] ?? null;
  }

  async getProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async getItems(type?: 'equipment' | 'space') {
    try {
      const { data, error } = await this.supabase
        .from('items')
        .select('*, categories(name, type)')
        .order('name');

      if (error) {
        throw error;
      }

      const items = data ?? [];

      if (!type) {
        return items;
      }

      return items.filter((item: any) => {
        const itemType = item.type ?? item.categories?.type ?? item.category_type;
        return itemType === type;
      });
    } catch (error) {
      console.warn('No se pudo leer items desde Supabase. Usando datos simulados.', error);
      return this.fallbackItems.filter((item) => !type || item.type === type);
    }
  }

  async getProfiles() {
    try {
      const { data, error } = await this.supabase.from('profiles').select('*');

      if (error) {
        throw error;
      }

      return data ?? [];
    } catch (error) {
      console.warn('No se pudo leer profiles desde Supabase. Usando datos simulados.', error);
      return this.fallbackProfiles;
    }
  }

  async getLoans() {
    try {
      const { data, error } = await this.supabase.from('loans').select('*');

      if (error) {
        throw error;
      }

      return data ?? [];
    } catch (error) {
      console.warn('No se pudo leer loans desde Supabase. Usando datos simulados.', error);
      return this.fallbackLoans;
    }
  }

  async createLoan(payload: {
    user_id: string;
    item_id: number;
    start_date: string;
    end_date: string;
    status?: string;
  }) {
    try {
      const { data, error } = await this.supabase.from('loans').insert(payload).select();

      if (error) {
        throw error;
      }

      return data?.[0] ?? null;
    } catch (error) {
      console.warn('Supabase rechazó la solicitud. Guardando en modo local.', error);
      const fallbackLoan = {
        id: Date.now(),
        ...payload,
        status: payload.status ?? 'pending',
      };
      this.fallbackLoans.unshift(fallbackLoan);
      return fallbackLoan;
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }
}