import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Ride, RideService } from '../services/ride';
import { AuthService } from '../services/auth';
import { FormsModule } from '@angular/forms';
import { compileNgModule } from '@angular/compiler';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publish-ride',
  templateUrl: './publish-ride.html',
  imports: [FormsModule,CommonModule],
  styleUrls: ['./publish-ride.css']
})
export class PublishRideComponent {
  ride: Ride = {
    from: '',
    to: '',
    date: '',
    startTime: '',
    totalSeats: 0,
    availableSeats: 0,
    amount: 0
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private rideService: RideService,
    private authService: AuthService,
    private router: Router
  ) {}

  postRide() {
    const publisherId = this.authService.getUserId();
    if (!publisherId) {
      this.router.navigate(['/login']);
      return;
    }

    const rideToSend = { ...this.ride, publisherId };

    this.rideService.publishRide(rideToSend).subscribe({
      next: (res) => {
        this.successMessage = 'Ride published successfully!';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Failed to publish ride!';
        this.successMessage = '';
      }
    });
  }
}
