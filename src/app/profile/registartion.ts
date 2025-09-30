import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './registartion.html',
  styleUrls: ['./registartion.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(1)]],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      nationalIdNumber: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      isAvailable: [true]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  get f() {
    return this.registrationForm.controls;
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.submitSuccess = false;

    const formData = this.registrationForm.value;
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      phoneNumber: parseInt(formData.phoneNumber),
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
      nationalIdNumber: formData.nationalIdNumber,
      passwordHash: formData.password,
      isAvailable: formData.isAvailable
    };

    this.http.post('http://localhost:5205/api/User/register', payload)
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.registrationForm.reset({ isAvailable: true });
          console.log('Registration successful:', response);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          console.error('Registration error:', error);
        }
      });
  }
}