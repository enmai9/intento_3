import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Head } from './head';
import { SupabaseService } from '../services/supabase';

describe('Head', () => {
  let component: Head;
  let fixture: ComponentFixture<Head>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Head],
      providers: [
        provideRouter([]),
        {
          provide: SupabaseService,
          useValue: {
            getSession: async () => null,
            onAuthStateChange: () => ({
              data: { subscription: null },
            }),
            signOut: async () => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Head);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});