import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-publish-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publish-request.html',
  styleUrl: './publish-request.css'
})
export class PublisherRequestComponent implements OnInit {
  publisherForm: FormGroup;
  isSubmitting = false;
  userId: number = 0;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';
  licensePhotoPreview: string | null = null;
  rcBookPhotoPreview: string | null = null;

  private apiUrl = 'http://localhost:5205/api/v1/PublisherRequest/apply';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.publisherForm = this.fb.group({
      publisherId: [0],
      userId: ['', Validators.required],   // will be filled automatically
      license_Number: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      license_Photo: [''],
      rcBook_Photo: [''],
      vehicle_Color: ['', Validators.required],
      vehicle_Model: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      this.userId = Number(storedId);
      // ✅ set it in the form automatically
      this.publisherForm.patchValue({ userId: this.userId });
    }
  }

  onLicensePhotoSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.convertToBase64(file, 'license_Photo');

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.licensePhotoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onRcBookPhotoSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.convertToBase64(file, 'rcBook_Photo');

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.rcBookPhotoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  private convertToBase64(file: File, fieldName: string): void {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      this.publisherForm.patchValue({
        [fieldName]: base64
      });
    };
    reader.readAsDataURL(file);
  }

  removeLicensePhoto(): void {
    this.licensePhotoPreview = null;
    this.publisherForm.patchValue({ license_Photo: '' });
  }

  removeRcBookPhoto(): void {
    this.rcBookPhotoPreview = null;
    this.publisherForm.patchValue({ rcBook_Photo: '' });
  }

  onSubmit(): void {
    if (this.publisherForm.valid) {
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.submitError = false;

      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(this.apiUrl, this.publisherForm.value, { headers })
        .subscribe({
          next: (response) => {
            console.log('Success:', response);
            this.submitSuccess = true;
            this.isSubmitting = false;

            this.publisherForm.reset({
              publisherId: 0,
              userId: this.userId   // ✅ keep userId after reset
            });
            this.licensePhotoPreview = null;
            this.rcBookPhotoPreview = null;
          },
          error: (error) => {
            console.error('Error:', error);
            this.submitError = true;
            this.errorMessage = error.error?.message || 'An error occurred while submitting the form.';
            this.isSubmitting = false;
          }
        });
    } else {
      Object.keys(this.publisherForm.controls).forEach(key => {
        this.publisherForm.get(key)?.markAsTouched();
      });
    }
  }

  get f() {
    return this.publisherForm.controls;
  }
}
