import { Component, OnInit } from '@angular/core';
import { MasVendidosService } from '../services/mas-vendidos-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mas-vendidos',
  templateUrl: './mas-vendidos.component.html',
  imports: [CommonModule],
})
export class MasVendidosComponent implements OnInit {
  masVendidos: any[] = [];

  constructor(private masVendidosService: MasVendidosService) {}

  ngOnInit(): void {
    this.obtenerMasVendidos();
  }

  // Función para obtener los productos más vendidos
  async obtenerMasVendidos() {
    try {
      this.masVendidos = await this.masVendidosService.getMasVendidos();
    } catch (error) {
      console.error('Error al obtener los productos más vendidos:', error);
    }
  }
}
