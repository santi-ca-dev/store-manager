import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MasVendidosService {
  private supabase = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  );

  constructor() {}

  // Función para obtener los productos más vendidos
  async getMasVendidos() {
    const { data, error } = await this.supabase
      .from('productos')
      .select('*')
      .order('cantidad', { ascending: true })
      .limit(6);

    if (error) {
      console.error('Error al obtener productos más vendidos:', error);
      throw error;
    }

    return data;
  }
}
