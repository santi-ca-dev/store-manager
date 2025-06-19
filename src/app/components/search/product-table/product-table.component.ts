import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-table',
  imports: [],
  templateUrl: './product-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTableComponent {
  @Input() products: any[] = [];
  @Input() updatingProducts: { [id: number]: boolean } = {};
  @Input() showActions: boolean = true; // Se asegura de que siempre tenga un valor

  @Output() updateQuantity = new EventEmitter<{ productId: number; change: number }>();
  @Output() deleteProduct = new EventEmitter<number>();

  onUpdateQuantity(productId: number, change: number) {
    this.updateQuantity.emit({ productId, change });
  }

  onDeleteProduct(productId: number) {
    this.deleteProduct.emit(productId);
  }

  trackByProductId(index: number, product: any) {
    return product.id;
  }
}
