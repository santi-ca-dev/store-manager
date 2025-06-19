import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductTableComponent } from "../../components/search/product-table/product-table.component";
import { SearchBarComponent } from "../../components/search/search-bar/search-bar.component";
import { SideFilterComponent } from "../../components/search/side-filter/side-filter.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../components/admin/services/admin.service';

@Component({
  selector: 'app-search-page',
  imports: [
    CommonModule,
    FormsModule,
    SideFilterComponent,
    SearchBarComponent,
    ProductTableComponent
  ],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit {

  products: any[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  updatingProducts: { [id: number]: boolean } = {};

  categorias: string[] = [];
  categoriasSeleccionadas: string[] = [];

  constructor(
    private adminService: AdminService,
    private cd: ChangeDetectorRef
  ) {}

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

}
