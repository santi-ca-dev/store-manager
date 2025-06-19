import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from '../../shared/services/supabase-service.service';
import { AuthService } from '../../shared/services/auth.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './auth-page.component.html',
  styles: [
    `
      a,
      button {
        cursor: pointer;
      }
      button:disabled {
        background-color: #7b2cc4;
        cursor: not-allowed;
        opacity: 0.6;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent implements OnInit {
  isSignUp = false;
  auth = inject(SupabaseService);
  loginError: string | null = null;
  isLoading = false;
  user: any = null;
  registerForm!: FormGroup;

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  // Inicializa el formulario
  ngOnInit(): void {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/),
      ]),
    });

    this.toggleMode();
  }

  // Alterna entre formulario de registro y de inicio de sesión
  cambiarModo() {
    this.isSignUp = !this.isSignUp;
    this.toggleMode();
  }

  // Alterna las validaciones según un formulario u otro
  toggleMode(): void {
    if (this.isSignUp) {
      this.registerForm.controls['name'].setValidators([
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/),
      ]);
      this.registerForm.controls['lastName'].setValidators([
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/),
      ]);
    } else {
      this.registerForm.controls['name'].clearValidators();
      this.registerForm.controls['lastName'].clearValidators();
    }
    this.registerForm.controls['name'].updateValueAndValidity();
    this.registerForm.controls['lastName'].updateValueAndValidity();
  }

  // Lógica para cuando se pulse el botón submit del formulario
  onSubmit() {
    const { email, password, name, lastName } = this.registerForm.value;

    if (!this.isSignUp) {
      this.isLoading = true;
      this.authHandler(email!, password!, '', '')
        .then(() => {
          this.snackBar.open('Inicio de sesión exitoso.', 'Cerrar', {
            duration: 5000,
          });
        })
        .catch((error) => {
          this.snackBar.open(
            'Hubo un error al iniciar sesión. Intenta nuevamente.',
            'Cerrar',
            {
              duration: 5000,
            }
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.isLoading = true;

      this.authHandler(email!, password!, name!, lastName!)
        .then(() => {
          this.snackBar.open(
            'Registro exitoso. Revise su correo para confirmar su cuenta.',
            'Cerrar',
            {
              duration: 5000,
            }
          );
        })
        .catch((error) => {
          this.snackBar.open(
            'Hubo un error al registrar. Intenta nuevamente.',
            'Cerrar',
            {
              duration: 5000,
            }
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  // Función para manejar la autenticación
  async authHandler(
    email: string,
    password: string,
    name: string,
    lastName: string
  ) {
    this.isLoading = true;

    try {
      if (this.isSignUp) {
        // Registro
        const { data: signUpData, error: signUpError } =
          await this.supabaseService.client.auth.signUp({
            email,
            password,
          });

        if (signUpError) throw new Error(signUpError.message);
        const user = signUpData.user;
        if (!user?.id)
          throw new Error('Error al obtener los datos del usuario');

        const { data: roleData, error: roleError } =
          await this.supabaseService.client
            .from('roles')
            .select('id')
            .eq('tipo', 'user')
            .single();

        if (roleError)
          throw new Error('Error al obtener el rol: ' + roleError.message);

        const { data: userData, error: insertError } =
          await this.supabaseService.client.from('usuarios').insert([
            {
              id: user.id,
              nombre: name,
              apellido: lastName,
              role_id: roleData.id,
              created_at: new Date().toISOString(),
            },
          ]);

        if (insertError)
          throw new Error(
            'Error al insertar el usuario en la tabla usuarios: ' +
              insertError.message
          );

        await this.authService.loadUser();

        this.isSignUp = false;
        return;
      } else {
        // Login
        this.loginError = null;

        const { error } =
          await this.supabaseService.client.auth.signInWithPassword({
            email,
            password,
          });

        if (error) throw new Error('Email o contraseña inválidos');

        await this.authService.loadUser();

        // Redirección según el rol
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      }
    } catch (err: any) {
      this.loginError = err.message || 'Ocurrió un error inesperado.';
      this.snackBar.open(
        this.loginError ?? 'Ocurrió un error inesperado.',
        'Cerrar',
        { duration: 5000 }
      );
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

}
