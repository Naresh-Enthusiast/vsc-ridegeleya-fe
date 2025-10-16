import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-detail.html',
   standalone: true, // ✅ (important if your app uses standalone components)
  imports: [DatePipe, NgIf, NgFor, FormsModule], // ✅ add DatePipe here
  styleUrls: ['./booking-detail.css'],
})
export class BookingDetails {
  @Input()  ride: any; // Passed from ride list
  seatsToBook: number = 1;
  bookingInProgress = false;

  constructor(private http: HttpClient, private router: Router) {}

  bookRide() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login first!');
      return;
    }

    const rideId = this.ride?.id;
    if (!rideId) {
      alert('Invalid ride details!');
      return;
    }

    const apiUrl = `http://localhost:5205/api/v1/Booking?userId=${userId}&rideId=${rideId}&seats=${this.seatsToBook}`;
    this.bookingInProgress = true;

    this.http.post(apiUrl, {}).subscribe({
      next: (res) => {
        alert('🎉 Ride booked successfully!');
        this.router.navigate(['/booking-confirmation']);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Failed to book the ride. Please try again.');
      },
      complete: () => (this.bookingInProgress = false),
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
