import { Injectable } from '@angular/core';
import { SupabaseService } from '../../shared/services/supabase-service.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user: any = null;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.loadUser();
  }

  async loadUser() {
    const {
      data: { user },
    } = await this.supabaseService.client.auth.getUser();
    this.user = user;

    if (user) {
      const { data, error } = await this.supabaseService.client
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error) {
        this.user = { ...user, ...data };
      }
    }
  }

  async signOut() {
    await this.supabaseService.client.auth.signOut();
    this.user = null;
    this.router.navigate(['/auth']);
  }

  isAdmin(): boolean {
    return this.user && this.user.role_id === 1;
  }

  isUser(): boolean {
    return this.user && this.user.role_id === 2;
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }
}
