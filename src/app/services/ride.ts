import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ride {

       
  publisherId?: number; 
  from: string;
  to: string;
  date: string;         
  startTime: string;
  totalSeats: number;
  availableSeats: number;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private apiUrl = 'http://localhost:5205/api/v1/Ride';

  constructor(private http: HttpClient) {}

  publishRide(ride: Ride): Observable<Ride> {
    return this.http.post<Ride>(this.apiUrl, ride);
  }
}
