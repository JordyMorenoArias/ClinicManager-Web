import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthLoginDTO } from '../../dtos/auth-login.dto';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [AsyncPipe, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public errorMessage$ = new BehaviorSubject<string | null>(null);

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
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage$.next(error.error?.message || 'An error occurred during login.');
        },
      });
    }
  }
}
