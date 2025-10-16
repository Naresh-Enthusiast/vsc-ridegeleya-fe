import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-verify',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './otp-verify.html',
  styleUrl: './otp-verify.css'
})
export class OtpVerify {

  email: string = '';
  otp: string = '';
  otpSent: boolean = false;
  loading: boolean = false;
  
  private apiUrl = 'http://localhost:5205/api/v1/User';

  constructor(private http: HttpClient) {}

  sendOtp() {
    if (!this.email) {
      alert('Please enter your email address');
      return;
    }

    if (!this.validateEmail(this.email)) {
      alert('Please enter a valid email address');
      return;
    }

    this.loading = true;
    const url = `${this.apiUrl}/send-otp?email=${encodeURIComponent(this.email)}`;

    this.http.post(url, {}).subscribe({
      next: (response) => {
        this.loading = false;
        this.otpSent = true;
        alert('OTP sent successfully! Please check your email.');
      },
      error: (error) => {
        this.loading = false;
        alert('Failed to send OTP. Please try again.');
        console.error('Error sending OTP:', error);
      }
    });
  }

  verifyOtp() {
    if (!this.otp) {
      alert('Please enter the OTP');
      return;
    }

    this.loading = true;
    const url = `${this.apiUrl}/verify-otp`;
    const payload = {
      email: this.email,
      otp: this.otp
    };

    this.http.post(url, payload).subscribe({
      next: (response) => {
        this.loading = false;
        localStorage.setItem('userEmail', this.email);
        alert('OTP verified successfully!');
        window.location.href = '/register';
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        alert('Invalid OTP. Please try again.');
        console.error('Error verifying OTP:', error);
      }
    });
  }

  resetForm() {
    this.email = '';
    this.otp = '';
    this.otpSent = false;
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  resendOtp() {
    this.otp = '';
    this.sendOtp();
  }
}
