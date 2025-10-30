import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LocationService } from '../services/Location.service'; 

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

  filteredFromLocations: string[] = [];
  filteredToLocations: string[] = [];

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  private userIdKey = 'userId';
  private publisherIdKey = 'publisherId';

  constructor(private http: HttpClient, private locationService: LocationService) {}

  ngOnInit() {
    this.fetchAndStorePublisherId();
  }

  /**Fetch publisherId from backend and store in localStorage */
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
          console.log('Publisher ID saved:', res.publisherId);
        } else {
          console.warn('Publisher ID not found in API response');
        }
      },
      error: (err) => {
        console.error('Failed to fetch publisher ID:', err);
      }
    });
  }

  /**Handle "From" input with live suggestions */
  onFromInput(query: string): void {
    this.rideData.from = query;
    if (!query || query.length < 2) {
      this.filteredFromLocations = [];
      return;
    }

    this.locationService.getLocations(query).subscribe({
      next: (data: any) => {
        this.filteredFromLocations = data.geonames
          ? data.geonames.map((loc: any) => `${loc.name}, ${loc.countryName}`)
          : [];
      },
      error: (err: any) => console.error('Error fetching "From" locations:', err)
    });
  }

  /**Handle "To" input with live suggestions */
  onToInput(query: string): void {
    this.rideData.to = query;
    if (!query || query.length < 2) {
      this.filteredToLocations = [];
      return;
    }

    this.locationService.getLocations(query).subscribe({
      next: (data: any) => {
        this.filteredToLocations = data.geonames
          ? data.geonames.map((loc: any) => `${loc.name}, ${loc.countryName}`)
          : [];
      },
      error: (err: any) => console.error('Error fetching "To" locations:', err)
    });
  }

  /**User selects a suggestion */
  selectFromLocation(location: string) {
    this.rideData.from = location;
    this.filteredFromLocations = [];
  }

  selectToLocation(location: string) {
    this.rideData.to = location;
    this.filteredToLocations = [];
  }

  /**Create a new ride */
  onSubmit() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const publisherId = localStorage.getItem(this.publisherIdKey);

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
        console.error('Ride creation failed:', error);
        this.errorMessage = error.error?.message || 'Failed to create ride. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  /**Reset form */
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
    this.filteredFromLocations = [];
    this.filteredToLocations = [];
  }
}
