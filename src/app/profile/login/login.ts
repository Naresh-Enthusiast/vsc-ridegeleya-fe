
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [ CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  standalone: true,
  styleUrl: './login.css'
})


export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';
  private apiUrl = 'http://localhost:5205/api/User/login';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.http.post(this.apiUrl, loginData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Login successful!';
        
        // Store token if provided in response
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        
        // Store user data if needed
        if (response.user) {
          localStorage.setItem('userData', JSON.stringify(response.user));
        }

        // Remember me functionality
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('rememberEmail', this.loginForm.value.email);
        } else {
          localStorage.removeItem('rememberEmail');
        }

        // Redirect after successful login (adjust route as needed)
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Invalid login credentials';
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your connection.';
         } else if (error.status === 404) {
          this.errorMessage = 'Login credentials wrong OR Your account does not exist.';
        } else {
          this.errorMessage = error.error?.message || 'Login credentials wrong. Please try again.';
        }
        
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

