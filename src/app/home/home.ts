import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar';
import { LoginComponent } from "../profile/login/login";
import { RideService } from '../services/ride.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SignalRServices } from '../services/signalr.service'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, LoginComponent, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  
  userId: number = 0;
  incomingBooking: any = null;

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

  constructor(
    private rideService: RideService,
    private http: HttpClient,
    private signalRService: SignalRServices 
  ) {
    window.addEventListener('openLoginModal', () => {
      this.showLoginModal = true;
    });
  }

  //Initialize userId and SignalR connection
  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    const seats = localStorage.getItem('seats');
    const rideId = localStorage.getItem('rideId');
    if (rideId) {
      this.rideQuery.passengers = parseInt(rideId, 10);
    }
    if (seats) {
      this.rideQuery.passengers = parseInt(seats, 10);
    }

    console.log('Retrieved seats from localStorage:', this.rideQuery.passengers);
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    } else {
      
      this.userId = Math.floor(Math.random() * 1000) + 1;
      localStorage.setItem('userId', this.userId.toString());
    }

    console.log('Current userId:', this.userId);

    // Start SignalR connection for this user
    this.signalRService.startConnection(this.userId);

    // Listen for booking requests or responses
    this.signalRService.bookingRequests$.subscribe((data) => {
      if (data) {
        console.log('Received booking request:', data);
        this.incomingBooking = data;
      }
    });

    this.signalRService.rideResponses$.subscribe((data) => {
      if (data) {
        console.log('Received ride response:', data);
        alert(`Your booking was ${data.status} by publisher.`);
      }
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

  getRideKeys(ride: any): string[] {
    return Object.keys(ride);
  }

  formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
  }

  // Updated booking logic
  bookRide(ride: any) {
    try {

      const rideId = ride.rideId || ride.RideId || ride.id;
      const publisherId = ride.publisherId || ride.PublisherId;

      if (!rideId) {
        console.error('rideId not found in search results:', ride);
        alert('Ride ID not found. Please try again.');
        return;
      }


      let userId = parseInt(localStorage.getItem('userId') || '0', 10);
      if (!userId || userId === 0) {
        userId = this.userId || Math.floor(Math.random() * 1000) + 1;
        localStorage.setItem('userId', userId.toString());
      }


      const seats = this.rideQuery.passengers || 1;


      localStorage.setItem('rideId', rideId.toString());
      localStorage.setItem('seats', seats.toString());
      localStorage.setItem('userId', userId.toString());

      console.log('Booking parameters ready:', { rideId, userId, seats, publisherId });


      const bookingUrl = `http://localhost:5205/api/v1/Booking?userId=${userId}&rideId=${rideId}&seats=${seats}`;
      const publisherUserIdUrl = `http://localhost:5205/api/v1/Booking/publisher/details?publisherId=${publisherId}`;

      this.http.post(bookingUrl, null, { responseType: 'json' }).subscribe({
        next: (response) => {
          console.log('Ride booked successfully:', response);

          
          const publisherUserIdUrl = `http://localhost:5205/api/v1/Booking/publisher/details/${publisherId}`;

          this.http.get<any>(publisherUserIdUrl).subscribe({
            next: (pubResponse) => {
              const publisherUserId = pubResponse.user.id;
              console.log('Publisher userId:', publisherUserId);

            
              localStorage.setItem('publisherUserId', publisherUserId.toString());

             
              this.signalRService.UserBookedRide(publisherUserId, userId, rideId);
              console.log(`Notified publisher (${publisherUserId}) about booking.`);

              alert(`Booking confirmed for ride ${rideId}!`);
            },
            error: (err) => {
              console.error('Failed to retrieve publisher userId:', err);
              alert('Failed to retrieve publisher info.');
            }
          });

        },
        error: (err) => {
          console.error('Booking failed:', err);
          if (err.status === 400) {
            alert('Invalid booking data. Please check ride or user info.');
          } else if (err.status === 0) {
            alert('Could not reach backend API. Check if it’s running.');
          } else {
            alert('Failed to book ride. Please try again later.');
          }
        }
      });

    } catch (ex) {
      console.error('Unexpected error while booking:', ex);
      alert('Something went wrong while booking. Please try again.');
    }
  }

  respondToBooking(status: string) {
    if (!this.incomingBooking) return;

    const { userId, rideId } = this.incomingBooking;

   
    this.signalRService.PublisherResponded(userId, rideId, status);

    console.log(`Publisher responded with ${status} for ride ${rideId}`);

    alert(`You have ${status} the booking request.`);
    this.incomingBooking = null; 
  }

}