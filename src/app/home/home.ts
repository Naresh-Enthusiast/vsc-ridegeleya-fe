import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar';
import { LoginComponent } from "../profile/login/login";
import { RideService } from '../services/ride.service'; // ✅ import service
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, LoginComponent, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  rideQuery = {
    from: '',
    to: '',
    date: '',
    passengers: 1,
    time: ''
  };

  allLocations: string[] = [
    'Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi',
    'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Coimbatore'
  ];

  filteredFromLocations: string[] = [];
  filteredToLocations: string[] = [];
  showLoginModal = false;
  rides: any[] = [];
  errorMessage: string = '';
  hasSearched: boolean = false; 

  constructor(private rideService: RideService) {
    window.addEventListener('openLoginModal', () => {
      this.showLoginModal = true;
    });
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  filterLocations(type: 'from' | 'to') {
    const query =
      type === 'from'
        ? this.rideQuery.from.trim().toLowerCase()
        : this.rideQuery.to.trim().toLowerCase();

    if (!query) {
      if (type === 'from') this.filteredFromLocations = [];
      else this.filteredToLocations = [];
      return;
    }

    const filtered = this.allLocations.filter((loc) =>
      loc.toLowerCase().startsWith(query)
    );

    if (type === 'from') this.filteredFromLocations = filtered;
    else this.filteredToLocations = filtered;
  }

  
  searchRides() {
    this.hasSearched = true;
    this.errorMessage = '';
    this.rides = [];

    this.rideService.searchRides(this.rideQuery).subscribe({
      next: (response) => {
        console.log('API Response:', response);

        if (response && Array.isArray(response) && response.length > 0) {
          this.rides = response;
        } else {
          this.errorMessage = 'No rides available for the selected route.';
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorMessage = 'Something went wrong. Please try again later.';
      }
    });
  }

  // Helper methods for displaying key-value pairs
  getRideKeys(ride: any): string[] {
    return Object.keys(ride);
  }

  formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
  }
  bookRide(ride: any) {
  console.log('Booking ride:', ride);
  alert(`Booking confirmed for ride from ${ride.from || ride.From} to ${ride.to || ride.To}!`);
}

}
