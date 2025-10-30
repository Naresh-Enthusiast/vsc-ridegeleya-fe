import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private apiUrl = 'http://localhost:5205/api/v1/User/availability';
  private ratingUrl = 'http://localhost:5205/api/v1/Ratings';

  constructor(private http: HttpClient) {}

  /** Search for rides */
  searchRides(rideData: any): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any[]>(this.apiUrl, rideData, { headers });
  }

  /** Get all rides */
  getRides(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** Get ratings by publisher */
  getRatingsByPublisher(publisherId: number): Observable<any[]> {
    console.log('Fetching ratings for publisherId:', publisherId);
    return this.http.get<any[]>(`${this.ratingUrl}/publisher/${publisherId}`);
  }
}
