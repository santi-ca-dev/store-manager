import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../shared/services/supabase-service.service';
import { AdminNavComponent } from '../../shared/components/admin-nav/admin-nav.component';
import { MatIconModule } from '@angular/material/icon';
import { UserNavComponent } from '../../shared/components/user-nav/admin-nav.component';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, AdminNavComponent, MatIconModule, UserNavComponent],
  templateUrl: './user-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent implements OnInit {
  usuarioActivo: any = null;
  correoUsuario: string = '';

  constructor(private supabase: SupabaseService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      const sessionUser = await this.supabase.getUser();
      if (!sessionUser?.id) return;

      this.correoUsuario = sessionUser.email ?? '';

      const { data, error } = await this.supabase.client
        .from('usuarios')
        .select('nombre, apellido, roles (tipo)')
        .eq('id', sessionUser.id)
        .single();

      if (error) throw error;

      this.usuarioActivo = data;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  }
}

