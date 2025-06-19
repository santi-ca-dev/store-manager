import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BotonDescargarArchivoPdfComponent } from "./boton-descargar-archivo-pdf/boton-descargar-archivo-pdf.component";
import { BotonDescargarArchivo } from './boton-descargar-archivo/boton-descargar-archivo-csv.component';

@Component({
  selector: 'app-botones-descarga-archivos',
  imports: [BotonDescargarArchivo, BotonDescargarArchivoPdfComponent],
  templateUrl: './botones-descarga-archivos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotonesDescargaArchivos {

  @Input() tableName!: string;

}
