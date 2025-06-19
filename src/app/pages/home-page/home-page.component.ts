import { Component } from '@angular/core';
import { MasVendidosComponent } from '../../components/home/mas-vendidos-component/mas-vendidos.component';

@Component({
  selector: 'app-home',
  imports: [MasVendidosComponent],
  templateUrl: './home-page.component.html',
})
export class HomeComponent {}
