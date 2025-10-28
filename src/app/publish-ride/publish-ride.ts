import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-ride',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publish-ride.html',
  styleUrls: ['./publish-ride.css']
})
export class PublishRide implements OnInit {
  rideData = {
    from: '',
    to: '',
    date: '',
    startTime: '',
    totalSeats: 0,
    availableSeats: 0,
    amount: 0
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  private userIdKey = 'userId';
  private publisherIdKey = 'publisherId';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAndStorePublisherId();
  }

  /** 🔹 Fetch publisherId from backend and store in localStorage */
  fetchAndStorePublisherId() {
    const userId = localStorage.getItem(this.userIdKey);
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    this.http.get(`http://localhost:5205/api/v1/Admin/approved/${userId}`).subscribe({
      next: (res: any) => {
        if (res && res.publisherId) {
          localStorage.setItem(this.publisherIdKey, res.publisherId.toString());
          console.log(' Publisher ID saved:', res.publisherId);
        } else {
          console.warn(' Publisher ID not found in API response');
        }
      },
      error: (err) => {
        console.error('Failed to fetch publisher ID:', err);
      }
    });
  }

  /** 🔹 Create a new ride */
  onSubmit() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const publisherId = localStorage.getItem(this.publisherIdKey);
    console.log('Publisher ID from localStorage:', publisherId);

    if (!publisherId) {
      this.errorMessage = 'Publisher ID not found. Please reload or login again.';
      this.isSubmitting = false;
      return;
    }

    const payload = {
      rideId: 0,
      publisherId: parseInt(publisherId),
      from: this.rideData.from,
      to: this.rideData.to,
      date: this.rideData.date,
      startTime: this.rideData.startTime,
      totalSeats: this.rideData.totalSeats,
      availableSeats: this.rideData.availableSeats,
      amount: this.rideData.amount
    };

    this.http.post('http://localhost:5205/api/v1/Ride', payload).subscribe({
      next: () => {
        this.successMessage = 'Ride created successfully!';
        this.isSubmitting = false;
        this.resetForm();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to create ride. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  /** 🔹 Reset form fields */
  resetForm() {
    this.rideData = {
      from: '',
      to: '',
      date: '',
      startTime: '',
      totalSeats: 0,
      availableSeats: 0,
      amount: 0
    };
  }
}
