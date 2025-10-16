import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './userprofile.html',
  styleUrls: ['./userprofile.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  userId: number = 0;
  apiUrl = 'http://localhost:5205/api/v1/User';
  loading = true;
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.profileForm = this.fb.group({
      id: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: [''],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: [''],
      nationalIdNumber: [''],
      passwordHash: [''],
      isAvailable: [true]
    });

    // Initially disable form (read-only)
    this.profileForm.disable();
  }

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    // Redirect if no token (unauthenticated)
    if (!token) {
      window.location.href = '/home';
      return;
    }

    if (storedId) {
      this.userId = Number(storedId);
      this.fetchProfile();
    }
  }

  // Fetch profile with Authorization header
  fetchProfile(): void {
    this.loading = true;

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(`${this.apiUrl}/${this.userId}`, { headers }).subscribe({
      next: (data) => {
        this.profileForm.patchValue(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Profile load error:', err);
        this.errorMessage = err.status === 401
          ? 'Unauthorized. Please login again.'
          : 'Failed to load profile.';
        this.loading = false;

        if (err.status === 401) {
          this.logout();
        }
      }
    });
  }

  // Logout function
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberEmail');
    window.location.href = '/home'; // redirect to login/home page
  }

  enableEdit(): void {
    this.isEditing = true;
    this.profileForm.enable();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.profileForm.disable();
    this.fetchProfile();
  }

  // save with Authorization header
  saveProfile(): void {
    if (this.profileForm.valid) {
      const token = localStorage.getItem('authToken');

      if (!token) {
        alert('Unauthorized. Please login again.');
        this.logout();
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      this.http.put(`${this.apiUrl}/${this.userId}`, this.profileForm.value, { headers })
        .subscribe({
          next: () => {
            this.isEditing = false;
            this.profileForm.disable();
            alert('Profile updated successfully!');
          },
          error: (err) => {
            console.error('Profile update error:', err);
            if (err.status === 401) {
              alert('Session expired. Please login again.');
              this.logout();
            } else {
              alert('Error updating profile.');
            }
          }
        });
    }
  }
}
