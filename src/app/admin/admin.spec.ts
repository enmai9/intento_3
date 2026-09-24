import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SupabaseService } from '../services/supabase';
import { Admin } from './admin';

describe('Admin', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;
  let router: Router;

  beforeEach(async () => {
    const supabaseService = {
      getSession: vi.fn().mockResolvedValue({ user: { id: 'user-1' } }),
      getCurrentProfile: vi.fn().mockResolvedValue({ role: 'user' }),
      getProfiles: vi.fn().mockResolvedValue([]),
      getItems: vi.fn().mockResolvedValue([]),
      getLoans: vi.fn().mockResolvedValue([]),
    } as unknown as SupabaseService;

    await TestBed.configureTestingModule({
      imports: [Admin, RouterTestingModule],
      providers: [{ provide: SupabaseService, useValue: supabaseService }],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect non-admin users to principal', async () => {
    await component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/principal']);
  });
});
