import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.loadUser().then(() => {

      // Verifica si el usuario está autenticado
      if (!this.authService.isAuthenticated()) {
        this.snackBar.open('🚫 Ruta restringida. Permiso requerido.', 'Cerrar', {
          duration: 4000,
        });
        this.router.navigate(['/auth']);
        return false;
      }

      // Verifica el rol del usuario
      const requiredRole = next.data['role'];
      if (requiredRole && !this.isRoleAuthorized(requiredRole)) {
        this.snackBar.open('🚫 Ruta restringida. Permiso requerido.', 'Cerrar', {
          duration: 5000,
        });
        this.router.navigate(['/']);
        return false;
      }
      return true;
    });
  }

  private isRoleAuthorized(role: number): boolean {
    if (role === 1 && this.authService.isAdmin()) {
      return true;
    } else if (role === 2 && (this.authService.isUser() || this.authService.isAdmin())) {
      return true;
    }
    return false;
  }

}
