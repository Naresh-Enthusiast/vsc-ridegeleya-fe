import { Component, OnInit,AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface AdminData {
  publisherId: number;
  userId: number;
  license_Number: string;
  license_Photo: string;
  rcBook_Photo: string;
  vehicle_Color: string;
  vehicle_Model: string;
  status: string;
  availableseSeats: number;
  approvedAt: string;
}

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: number;
  email: string;
  dateOfBirth: string;
  nationalIdNumber: string;
  passwordHash: string;
}

interface DriverDetails {
  name: string;
  rating: number;
  license: string;
  vehicle: string;
  number: string;
  color: string;
  availableSeats: number;
  status: string;
  email: string;
  phone: number;
}


@Component({
  selector: 'app-driver-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracting.html',
  styleUrls: ['./tracting.css']
})
export class Tracting implements OnInit,AfterViewInit {
  private map!: L.Map;
private userMarker!: L.Marker;

   ngAfterViewInit(): void {
     this.initMap();
   }

    private initMap(): void {
    // Initialize map with default coordinates
    this.map = L.map('map').setView([12.9716, 77.5946], 13); // Bangalore default

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const userLocation = [lat, lng] as [number, number];

          // Set map view to user's current location
          this.map.setView(userLocation, 15);

          // Create a custom marker icon (like Google blue dot)
          const userIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/4879/4879608.png', // any symbol you like
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          });

          // Add marker to map
          this.userMarker = L.marker(userLocation, { icon: userIcon })
            .addTo(this.map)
            .bindPopup('<b>You are here!</b>')
            .openPopup();
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to fetch your location. Please allow location access.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
  driverDetails: DriverDetails | null = null;
  loading = true;
  error = false;
 

  userId = localStorage.getItem('publisherUserId') ? parseInt(localStorage.getItem('publisherUserId')!, 10) : 0;
  publisherId = localStorage.getItem('publisherId') ? parseInt(localStorage.getItem('publisherId')!, 10) : 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDriverDetails();
  }
  

  loadDriverDetails(): void {
    console.log('Loading driver details for publisherId:', this.publisherId, 'and userId:', this.userId);
    const adminUrl = `http://localhost:5205/api/v1/Admin/approved/44`;
    const userUrl = `http://localhost:5205/api/v1/User/44`;

    forkJoin({
      admin: this.http.get<AdminData>(adminUrl),
      user: this.http.get<UserData>(userUrl)
    }).subscribe({
      next: (response) => {
        this.driverDetails = {
          name: `${response.user.firstName} ${response.user.lastName}`,
          rating: 4.8,
          license: response.admin.license_Number,
          vehicle: response.admin.vehicle_Model,
          number: response.admin.license_Number.substring(0, 10).toUpperCase(),
          color: response.admin.vehicle_Color,
          availableSeats: localStorage.getItem('seats') ? parseInt(localStorage.getItem('seats')!, 10):0,
          status: response.admin.status,
          email: response.user.email,
          phone: response.user.phoneNumber
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading driver details:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  callDriver(): void {
    if (this.driverDetails) {
      window.location.href = `tel:${this.driverDetails.phone}`;
    }
  }
}