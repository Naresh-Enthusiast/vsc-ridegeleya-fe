import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: 'map.html',
})
export class Map implements AfterViewInit {
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
}
