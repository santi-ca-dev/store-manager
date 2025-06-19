import { Component, Input } from '@angular/core';
import { SupabaseService } from '../../../../shared/services/supabase-service.service';


@Component({
  selector: 'app-boton-descargar-archivo-csv',
  imports: [],
  templateUrl: './boton-descargar-archivo-csv.component.html',
})
export class BotonDescargarArchivo {

  // Recibe el nombre de la tabla desde el componente padre
  @Input() tableName!: string;

  constructor(private supabase: SupabaseService) { }

// Función que se llama al pulsar el botón que gestiona la descarga del archivo CSV
  async exportFile() {
    if(!this.tableName) {
      alert('No se ha especificado ninguna tabla.');
      return;
    }

    // Obtiene los data en formato CSV personalizado
    const csvData = await this.getCsvfromDb(this.tableName);

    if (!csvData) {
      alert('No se pudo descargar el CSV.');
      return;
    }

    //Crea el nombre del archivo con la tabla y la fecha de hoy
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const fileName = `${this.tableName}-${day}-${month}-${year}.csv`;

    //Descarga el archivo
    this.downloadFile(csvData, fileName);
  }


// Descarga la tabla en formato JSON, lo cambia a CSV y le añade el separador para que el programa que lea el archivo entienda cómo separar cada elemento
  async getCsvfromDb(table: string) {
    // Obtiene los datos en formato JSON
    const { data, error } = await this.supabase.client
      .from(table)
      .select('*');

    if (error) {
      alert(`Ha habido un error: al descargar la tabla ${table}: ` + error.message);
      return null;
    }
    // Los cambia a CSV antes de devolver los datos
    return this.transformToCsv(data);
  }

// Se cambia el formato a CSV y le añade el separador
  transformToCsv(data: any[]): string {
    if (!data.length) return '';

    const separator = ',';
    const headers = Object.keys(data[0]).join(separator);
    const rows = data.map(obj =>
      Object.values(obj)
        .map(val =>
           // Escapar comillas dobles y saltos de línea
          `"${String(val).replace(/"/g, '""').replace(/\n/g, ' ')}"`
        )
        .join(separator)
    ).join('\n');

    return `sep=${separator}\n${headers}\n${rows}`;
  }


// Genera el archivo de descarga con blob y lo descarga
  downloadFile(fileContent: string, fileName: string) {
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }



}
