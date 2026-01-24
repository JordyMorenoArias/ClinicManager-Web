import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthLoginDTO } from '../../dtos/auth-login.dto';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  public errorMessage: string = '';

  public loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  public login() {
    if (this.loginForm.valid) {
      const data: AuthLoginDTO = {
        username: this.loginForm.value.username!,
        password: this.loginForm.value.password!,
      };

      this.authService.login(data).subscribe({
        next: (response) => {
          console.log('Login successful', response.body);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'An error occurred during login.';
          this.cdr.detectChanges();
        },
      });
    }
  }
}
