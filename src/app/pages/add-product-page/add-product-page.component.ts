import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../shared/services/supabase-service.service';
import { RouterModule } from '@angular/router';
import { AdminNavComponent } from '../../shared/components/admin-nav/admin-nav.component';

@Component({
  selector: 'app-add-product-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavComponent ],
  templateUrl: './add-product-page.component.html',
})
export class AddProductPageComponent {
  producto = {
    nombre: '',
    descripcion: '',
    categoria: '',
    cantidad: '',
    precio: '',
    imagen: ''
  };

  mensaje = '';
  error = '';

  constructor(private supabase: SupabaseService,) { }

  //Función para añadir productos a la tabla con campos requeridos
  async addProduct() {
    const required = ['nombre', 'descripcion', 'categoria', 'precio'];
    this.mensaje = '';
    this.error = '';

    for (const campo of required) {
      if (!this.producto[campo as keyof typeof this.producto]) {
        this.error = `❌ El campo "${campo}" es obligatorio.`;
        return;
      }
    }

    try {
      const { data, error } = await this.supabase.client
        .from('productos')
        .insert([this.producto]);

      if (error) throw error;
      console.log('Producto insertado: ', data);

      this.mensaje = '✅ Producto añadido correctamente.';
      this.producto = {
        nombre: '',
        descripcion: '',
        categoria: '',
        cantidad: '',
        precio: '',
        imagen: ''
      };
    } catch (e: any) {
      this.error = '❌ ' + e.message;
    }
  }
}


