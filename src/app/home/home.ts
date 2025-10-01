import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar';
import { LoginComponent } from "../profile/login/login";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, LoginComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  locations: string[] = ['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi'];

  rideQuery = {
    from: '',
    to: '',
    date: '',
    passengers: 1,
    time: ''
  };

   showLoginModal = false;

  constructor() {
    // Listen for navbar event
    window.addEventListener('openLoginModal', () => {
      this.showLoginModal = true;
    });
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  rides: any[] = [];

  searchRides() {
    console.log('Searching with:', this.rideQuery);
    // later call API
    this.rides = [
      { from: 'Hyderabad', to: 'Bangalore', date: this.rideQuery.date, time: this.rideQuery.time, availableSeats: 3 }
    ];
  }
}
