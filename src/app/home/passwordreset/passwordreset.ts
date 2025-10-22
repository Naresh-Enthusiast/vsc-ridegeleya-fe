import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './passwordreset.html',
  styleUrls: ['./passwordreset.css']
})
export class ForgotPassword {
  step: 'email' | 'verify' = 'email';
  
  // Email step
  email: string = '';
  emailLoading: boolean = false;
  emailError: string = '';
  emailSuccess: boolean = false;
  
  // Verify step
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  verifyLoading: boolean = false;
  verifyError: string = '';
  verifySuccess: boolean = false;
  
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  private readonly API_BASE = 'http://localhost:5205/api/v1/User';

  constructor(private http: HttpClient) {}

  onSubmitEmail(): void {
    this.emailError = '';
    this.emailSuccess = false;

    if (!this.email || !this.validateEmail(this.email)) {
      this.emailError = 'Please enter a valid email address';
      return;
    }

    this.emailLoading = true;

    this.http.post(`${this.API_BASE}/forgot`, { email: this.email })
      .subscribe({
        next: (response) => {
          this.emailLoading = false;
          this.emailSuccess = true;
          setTimeout(() => {
            this.step = 'verify';
          }, 1500);
        },
        error: (error) => {
          this.emailLoading = false;
          this.emailError = error.error?.message || 'Failed to send OTP. Please try again.';
        }
      });
  }

  onSubmitVerify(): void {
    this.verifyError = '';
    this.verifySuccess = false;

    if (!this.otp) {
      this.verifyError = 'Please enter the OTP code';
      return;
    }

    if (!this.newPassword) {
      this.verifyError = 'Please enter a new password';
      return;
    }

    if (this.newPassword.length < 4) {
      this.verifyError = 'Password must be at least 4 characters long';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.verifyError = 'Passwords do not match';
      return;
    }

    this.verifyLoading = true;

    const payload = {
      email: this.email,
      otp: this.otp,
      newPassword: this.newPassword
    };

    this.http.post(`${this.API_BASE}/verify`, payload)
      .subscribe({
        next: (response) => {
          this.verifyLoading = false;
          this.verifySuccess = true;
          setTimeout(() => {
            // Redirect to login or handle success
            console.log('Password reset successful');
          }, 2000);
        },
        error: (error) => {
          this.verifyLoading = false;
          this.verifyError = error.error?.message || 'Failed to verify OTP. Please try again.';
        }
      });
  }

  backToEmail(): void {
    this.step = 'email';
    this.otp = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.verifyError = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}