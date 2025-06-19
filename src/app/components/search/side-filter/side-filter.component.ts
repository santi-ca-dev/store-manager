import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-side-filter',
  imports: [NgFor],
  templateUrl: './side-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideFilterComponent {
  @Input() categorias: string[] = [];
  @Output() categoriaSeleccionada = new EventEmitter<string[]>(); // 🔹 Emitimos un array de strings correctamente
  categoriasSeleccionadas: string[] = [];

  onCheckboxChange(event: Event, categoria: string) {
    const checked = (event.target as HTMLInputElement).checked; // 🔹 Convertimos el evento a tipo checkbox correctamente
    if (checked) {
      this.categoriasSeleccionadas.push(categoria);
    } else {
      this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(c => c !== categoria);
    }
    this.categoriaSeleccionada.emit([...this.categoriasSeleccionadas]); // 🔹 Emitimos una copia del array correctamente
  }
}
