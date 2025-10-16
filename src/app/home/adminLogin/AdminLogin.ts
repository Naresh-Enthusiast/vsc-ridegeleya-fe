import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PublisherRequest } from '../publish-request/publish-request';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, PublisherRequest, FormsModule, PublisherRequest],
  templateUrl: './AdminLogin.html',
  styleUrls: ['./AdminLogin.css']
})
export class AdminLogin {
  username: string = '';
  otp: string = '';
  otpSent = false;

  private baseUrl = 'http://localhost:5205/api/v1/Admin';

  // constructor(private http: HttpClient) {}

    constructor(private http: HttpClient, private router: Router) {}

  sendOtp() {
    if (!this.username) {
      alert('Please enter your email.');
      return;
    }

    this.http.post(`${this.baseUrl}/send-otp`, { email: this.username }, { responseType: 'text' })
      .subscribe({
        next: res => {
          alert('OTP sent successfully!');
          this.otpSent = true;
        },
        error: err => {
          console.error('Error sending OTP:', err);
          alert('Failed to send OTP. Please check your email and try again.');
        }
      });
  }

  verifyOtp() {
  if (!this.otp) {
    alert('Please enter the OTP.');
    return;
  }

  this.http.post(`${this.baseUrl}/verify-otp`, { Username: this.username, OTP: this.otp }, { responseType: 'text' })
    .subscribe({
      next: res => {
        alert('OTP verified successfully! Login successful.');
        localStorage.setItem('adminEmail', this.username); // for AuthGuard
        console.log('Navigating to publisher requests...');
        this.router.navigate(['admin/publisher-requests']);
      },
      error: err => {
        console.error('Error verifying OTP:', err);
        alert('Invalid OTP. Please try again.');
      }
    }); 
  }
}

