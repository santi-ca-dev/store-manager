import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable, { Styles } from 'jspdf-autotable';
import { SupabaseService } from '../../../../shared/services/supabase-service.service';

@Component({
  selector: 'app-boton-descargar-archivo-pdf',
  imports: [],
  templateUrl: './boton-descargar-archivo-pdf.component.html',
})
export class BotonDescargarArchivoPdfComponent {
  @Input() tableName!: string;

  constructor(private supabase: SupabaseService) {}

  // Función que se ejecuta al pulsar el botón de descargar PDF
  async exportPDF() {
    if (!this.tableName) {
      alert('No se ha especificado ninguna tabla.');
      return;
    }

    const { data } = await this.supabase.client
      .from(this.tableName)
      .select('*');

    if (!data || data.length === 0) {
      alert(`No hay datos en la tabla ${this.tableName}.`);
      return;
    }
    // Una vez tiene la tabla se dispone a generar el PDF
    this.generatePDF(data, this.tableName);
  }

  // Genera el documento PDF y lo desarga
  generatePDF(data: any[], tableName: string) {
    // Genera el documento PDF
    const doc = new jsPDF();
    doc.text(`Tabla: ${tableName}`, 14, 10);

    if (!data.length) {
      alert('No hay datos para exportar.');
      return;
    }
    // Revisa cuántos y cuales son las columnas y las almacena
    const headers = Object.keys(data[0]);

    // Convertir datos a formato compatible con autoTable
    const rows = data.map((row) =>
      headers.map((header) =>
        row[header] !== null && row[header] !== undefined
          ? row[header].toString()
          : ''
      )
    );

    // Ajusta dinámicamente el ancho según el contenido
    const columnWidths = this.calculateColumnWidths(headers, rows);

    // Crea la tabla a partir de las columnas, las filas en formato autoTable y las añade al documento PDF
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
      styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
      margin: { top: 20, left: 10, right: 10 },
      tableWidth: 'auto',
      columnStyles: columnWidths,
    });
    // Descarga el documento con el nombre de la tabla y el día actual
    const fileName = this.getFileName(tableName, 'pdf');
    doc.save(fileName);
  }

  // Función para generar el nombre del archivo
  getFileName(tableName: string, extension: string) {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${tableName}-${day}-${month}-${year}.${extension}`;
  }

  // Función para calcular el ancho de las columnas de la tabla en función del número de columnas y la extensión del texto de las filas
  calculateColumnWidths(headers: string[], rows: string[][]) {
    const maxColumnWidth = 43; // Máximo ancho permitido
    const minColumnWidth = 10; // Mínimo ancho permitido

    let columnWidths: { [key: string]: Partial<Styles> } = {};

    headers.forEach((header, index) => {
      let maxLength = header.length; // Empieza con el tamaño del encabezado

      // Recorre las filas y busca el texto más largo
      rows.forEach((row) => {
        maxLength = Math.max(maxLength, row[index]?.length || 0);
      });

      // Calcula el ancho basado en la longitud del texto
      let calculatedWidth = Math.min(
        maxColumnWidth,
        Math.max(minColumnWidth, maxLength * 2)
      );

      columnWidths[index.toString()] = { cellWidth: calculatedWidth };
    });

    return columnWidths;
  }
}
