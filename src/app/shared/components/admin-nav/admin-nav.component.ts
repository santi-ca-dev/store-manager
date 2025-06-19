import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SupabaseService } from '../../services/supabase-service.service';

@Component({
  selector: 'app-admin-nav',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin-nav.component.html',
  styles: [
    `
      button {
        cursor: pointer;
      }
    `,
  ],
})

export class AdminNavComponent {
  mostrarSelectorUsuarios = false;
  users: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // Obtiene los registros de todos los usuarios de la tabla usuarios
  async cargarUsuarios() {
    const { data, error } = await this.supabaseService.client
      .from('usuarios')
      .select('id, nombre, apellido, role_id');

    if (!error && data) {
      this.users = data;
    }
  }

  // Cambia el rol de un usuario de user a admin
  async convertirAdmin(userId: string) {
    const { error } = await this.supabaseService.client
      .from('usuarios')
      .update({ role_id: 1 })
      .eq('id', userId);

    if (!error) {
      await this.cargarUsuarios();
    }
  }

  // Cambia el rol de un usuario de admin a user
  async convertirUser(userId: string) {
    const { error } = await this.supabaseService.client
      .from('usuarios')
      .update({ role_id: 2 })
      .eq('id', userId);

    if (!error) {
      await this.cargarUsuarios();
    }
  }
}
