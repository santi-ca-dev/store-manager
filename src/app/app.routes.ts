import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home-page/home-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { AddProductPageComponent } from './pages/add-product-page/add-product-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [AuthGuard],
    data: { role: 1 },
  },
  {
    path: 'user',
    component: UserPageComponent,
    canActivate: [AuthGuard],
    data: { role: 2 },
  },
  {
    path: 'search',
    component: SearchPageComponent,
  },
  {
    path: 'auth',
    component: AuthPageComponent,
  },
  {
    path: 'add-product',
    component: AddProductPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
