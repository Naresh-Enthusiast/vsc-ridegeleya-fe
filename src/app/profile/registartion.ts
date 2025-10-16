import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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

  ngOnInit(): void {
    // Pre-fill email from localStorage if available
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      this.registrationForm.patchValue({ email: storedEmail });
      // Optionally disable email field since it's verified
      // this.registrationForm.get('email')?.disable();
    }
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get f() {
    return this.registrationForm.controls;
  }

  // Helper method to check if field has error
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.registrationForm.get(fieldName);
    if (!field) return false;
    
    if (errorType) {
      return field.hasError(errorType) && (field.dirty || field.touched);
    }
    return field.invalid && (field.dirty || field.touched);
  }

  // Get specific error message
  getErrorMessage(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['email']) return 'Invalid email format';
    if (field.errors['minlength']) return `Minimum length is ${field.errors['minlength'].requiredLength}`;
    if (field.errors['pattern']) return 'Invalid format';
    
    return '';
  }

  onSubmit(): void {
    console.log('Form submitted');
    console.log('Form valid:', this.registrationForm.valid);
    console.log('Form value:', this.registrationForm.value);
    console.log('Form errors:', this.getFormValidationErrors());

    if (this.registrationForm.invalid) {
      console.log('Form is invalid, marking all fields as touched');
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
      
      // Show alert with validation errors
      const errors = this.getFormValidationErrors();
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    // Check password match separately
    if (this.registrationForm.errors?.['mismatch']) {
      alert('Passwords do not match!');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.submitSuccess = false;

    const formData = this.registrationForm.value;
    
    // Use stored email or form email
    const userEmail = localStorage.getItem('userEmail') || formData.email;
    
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      phoneNumber: parseInt(formData.phoneNumber),
      email: userEmail,
      dateOfBirth: formData.dateOfBirth,
      nationalIdNumber: formData.nationalIdNumber,
      passwordHash: formData.password,
      isAvailable: formData.isAvailable
    };

    console.log('Sending payload:', payload);

    this.http.post('http://localhost:5205/api/v1/User/register', payload)
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.isSubmitting = false;
          this.submitSuccess = true;
          
          alert('Registration successful!');

          this.registrationForm.reset({ isAvailable: true });
          
        },
        error: (error) => {
          console.log('Registration error:', error);
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'This email may already be registered.please use a different email.';
          
          console.error('Registration error:', error);
          window.location.href = '/profile';
      
        }
      });
  }

  // Helper method to get all validation errors
  getFormValidationErrors(): string[] {
    const errors: string[] = [];
    
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      if (control && control.errors) {
        Object.keys(control.errors).forEach(errorKey => {
          errors.push(`${key}: ${errorKey}`);
        });
      }
    });

    // Check form-level errors
    if (this.registrationForm.errors?.['mismatch']) {
      errors.push('Passwords do not match');
    }

    return errors;
  }
}
