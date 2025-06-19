import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { SupabaseService } from '../../../shared/services/supabase-service.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private supabase: SupabaseService) { }

  getAll():Observable<any> {
    return from(this.supabase.client
      .from('productos')
      .select('*'));
  }

  // Obtener por ID
  getById(id: number): Observable<any> {
    return from(this.supabase.client
      .from('productos')
      .select('*')
      .eq('id', id)
      .single());
  }

  // Insertar nuevo registro
  create(item: any): Observable<any> {
    return from(this.supabase.client
      .from('productos')
      .insert([item]));
  }

  // Actualizar registro
  update(id: number, updates: any): Observable<any> {
    return from(this.supabase.client
      .from('productos')
      .update(updates)
      .eq('id', id));
  }

  updateQuantity(id: number, newQuantity: number): Observable<any> {
    return from(this.supabase.client
      .from('productos')
      .update({ cantidad: newQuantity })
      .eq('id', id));
  }

  // Eliminar registro
  delete(id: number){
    return from(this.supabase.client
      .from('productos')
      .delete()
      .eq('id', id));
      this.getAll();
  }
}
