import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './userprofile.html',
  styleUrls: ['./userprofile.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  userId: number = 0; // will be set after login
  apiUrl = 'http://localhost:5205/api/User';
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
  }

  ngOnInit(): void {
    // Example: get ID from localStorage after login
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      this.userId = Number(storedId);
      this.fetchProfile();
    }
  }

  fetchProfile(): void {
    this.loading = true;
    this.http.get<any>(`${this.apiUrl}/${this.userId}`).subscribe({
      next: (data) => {
        this.profileForm.patchValue(data);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load profile.';
        this.loading = false;
      }
    });
  }

//add logout function
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    // Optionally, redirect to login page
    window.location.href = '/home';
  }





  enableEdit(): void {
    this.isEditing = true;
    this.profileForm.enable();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.fetchProfile();
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http.put(`${this.apiUrl}/${this.userId}`, this.profileForm.value, { headers })
        .subscribe({
          next: () => {
            this.isEditing = false;
            alert('Profile updated successfully!');
          },
          error: () => {
            alert('Error updating profile.');
          }
        });



         




    }
  }
  
}
