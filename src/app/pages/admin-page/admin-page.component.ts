import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminService } from '../../components/admin/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BotonDescargarArchivo } from '../../components/admin/botones-descarga-archivos/boton-descargar-archivo/boton-descargar-archivo-csv.component';
import { BotonDescargarArchivoPdfComponent } from '../../components/admin/botones-descarga-archivos/boton-descargar-archivo-pdf/boton-descargar-archivo-pdf.component';
import { Router } from '@angular/router';
import { SideFilterComponent } from "../../components/search/side-filter/side-filter.component";
import { SearchBarComponent } from "../../components/search/search-bar/search-bar.component";
import { ProductTableComponent } from "../../components/search/product-table/product-table.component";
import { AdminNavComponent } from '../../shared/components/admin-nav/admin-nav.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BotonDescargarArchivo,
    BotonDescargarArchivoPdfComponent,
    SideFilterComponent,
    SearchBarComponent,
    ProductTableComponent,
    AdminNavComponent
],
  templateUrl: './admin-page.component.html',
})
export class AdminPageComponent implements OnInit {

  products: any[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  updatingProducts: { [id: number]: boolean } = {};

  categorias: string[] = [];
  categoriasSeleccionadas: string[] = [];

  constructor(private adminService: AdminService, private route: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getAll().subscribe({
      next: (response) => {
        this.products = response.data || [];
        this.categorias = [...new Set(this.products.map(p => p.categoria))];
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al cargar productos: ' + err.message;
        this.loading = false;
      }
    });
  }

  filtrarCategoriasSeleccionadas(categoriasSeleccionadas: string[]): void {
    this.categoriasSeleccionadas = categoriasSeleccionadas;
  }

  updateSearchTerm(term: string) {
    this.searchTerm = term;
  }

  get filteredProducts() {
    return this.products.filter(product =>
      (this.categoriasSeleccionadas.length === 0 || this.categoriasSeleccionadas.includes(product.categoria)) &&
      (product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (product.descripcion && product.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())))
    );
  }

  updateQuantity(productId: number, change: number): void {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const newQuantity = product.cantidad + change;
    if (newQuantity < 0) return;

    this.updatingProducts[productId] = true;

    this.adminService.updateQuantity(productId, newQuantity).subscribe({
      next: () => {
        product.cantidad = newQuantity;
      },
      error: (err) => {
        console.error('Error actualizando cantidad:', err);
      },
      complete: () => {
        this.updatingProducts[productId] = false;
      }
    });
  }

  SeguirPath(ruta: string) {
    this.route.navigate([ruta]);
  }

  deleteProduct(id: number) {
    this.adminService.delete(id).subscribe({
      next: () => {
        alert("Producto eliminado");
        this.loadProducts();
      },
      error: (error) => {
        alert("Error al eliminar producto: " + error);
        this.loadProducts();
      }
    });
  }
  mostrarSidebar = false;

}

