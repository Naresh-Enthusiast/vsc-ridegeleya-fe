import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar';
import { LoginComponent } from "../profile/login/login";
import { RideService } from '../services/ride.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SignalRServices } from '../services/signalr.service';
import { RatingService } from '../services/rating.service'; // ✅ Import RatingService
import { Rating } from './rating/rating';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    LoginComponent,
    HttpClientModule,
    Rating,
    RouterLink
  ],
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
    private ratingService: RatingService, // ✅ Inject RatingService
    private http: HttpClient,
    private signalRService: SignalRServices
  ) {
    window.addEventListener('openLoginModal', () => {
      this.showLoginModal = true;
    });
  }

  ngOnInit(): void {
    this.initializeUser();
    this.setupSignalR();
  }

  // ✅ Initialize user
  private initializeUser(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    } else {
      this.userId = Math.floor(Math.random() * 1000) + 1;
      localStorage.setItem('userId', this.userId.toString());
    }
    console.log('Current userId:', this.userId);
  }

  // ✅ Setup SignalR
  private setupSignalR(): void {
    this.signalRService.startConnection(this.userId);

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

  // ✅ Location filter
  filterLocations(type: 'from' | 'to') {
    const query = (type === 'from' ? this.rideQuery.from : this.rideQuery.to).trim().toLowerCase();
    if (!query) {
      type === 'from' ? this.filteredFromLocations = [] : this.filteredToLocations = [];
      return;
    }

    const filtered = this.allLocations.filter(loc =>
      loc.toLowerCase().startsWith(query)
    );

    if (type === 'from') this.filteredFromLocations = filtered;
    else this.filteredToLocations = filtered;
  }

  // ✅ Search rides
  searchRides() {
    this.hasSearched = true;
    this.errorMessage = '';
    this.rides = [];

    this.rideService.searchRides(this.rideQuery).subscribe({
      next: (response) => {
        console.log('API Response:', response);

        if (Array.isArray(response) && response.length > 0) {
          this.rides = response;
          this.loadRatingsForRides(); // ✅ Load ratings after rides
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

  // ✅ Load ratings for each ride
  loadRatingsForRides() {
    this.rides.forEach(ride => {
      this.rideService.getRatingsByPublisher(ride.publisherId).subscribe({
        next: ratings => {
          if (ratings.length > 0) {
            const avg = ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;
            ride.avgRating = avg;
          } else {
            ride.avgRating = 0;
          }
        },
        error: err => console.error('Error loading ratings:', err)
      });
    });
  }

  getRideKeys(ride: any): string[] {
    return Object.keys(ride);
  }

  formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
  }

  // ✅ Booking Logic
  bookRide(ride: any) {
    try {
      const rideId = ride.rideId || ride.RideId || ride.id;
      const publisherId = ride.publisherId || ride.PublisherId;

      if (!rideId || !publisherId) {
        alert('Ride or Publisher ID missing.');
        return;
      }

      let userId = parseInt(localStorage.getItem('userId') || '0', 10);
      if (!userId) {
        userId = this.userId;
        localStorage.setItem('userId', userId.toString());
      }

      const seats = this.rideQuery.passengers || 1;
      const bookingUrl = `http://localhost:5205/api/v1/Booking?userId=${userId}&rideId=${rideId}&seats=${seats}`;

      this.http.post(bookingUrl, null).subscribe({
        next: (response) => {
          console.log('Ride booked successfully:', response);

          // Get publisher's SignalR user ID
          const publisherUserIdUrl = `http://localhost:5205/api/v1/Booking/publisher/details/${publisherId}`;
          this.http.get<any>(publisherUserIdUrl).subscribe({
            next: (pubResponse) => {
              const publisherUserId = pubResponse.user.id;
              console.log('Publisher userId:', publisherUserId);

              localStorage.setItem('publisherUserId', publisherUserId.toString());
              this.signalRService.UserBookedRide(publisherUserId, userId, rideId);
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
          alert('Failed to book ride. Please try again later.');
        }
      });
    } catch (ex) {
      console.error('Unexpected error while booking:', ex);
      alert('Something went wrong while booking. Please try again.');
    }
  }

  // ✅ Publisher response
  respondToBooking(status: string) {
    if (!this.incomingBooking) return;

    const { userId, rideId } = this.incomingBooking;
    this.signalRService.PublisherResponded(userId, rideId, status);
    alert(`You have ${status} the booking request.`);
    this.incomingBooking = null;
  }
}
