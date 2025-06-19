import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavComponent } from './shared/components/nav/nav.component';
import { FooterComponent } from './shared/components/footer/footer.component';
// import { ProductListComponent } from './product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    NavComponent,
    FooterComponent,
    // ProductListComponent,
    HttpClientModule,
    RouterOutlet,
    RouterModule,
  ],
})
export class AppComponent {
  title = 'store-manager';

  ngOnInit(): void {
    initFlowbite(); // Inicializa Flowbite
  }
}
