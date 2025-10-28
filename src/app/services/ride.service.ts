import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  private apiUrl = 'http://localhost:5205/api/v1/User/availability';
  private ratingUlr ='http://localhost:5205/api/v1/Ratings';

  constructor(private http: HttpClient) {}

  searchRides(rideData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, rideData, { headers });
  }

  getRides(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  
  // ➕ Add a new rating
  addRating(data: any): Observable<any> {
    return this.http.post(`${this.ratingUlr}/add`, data);
  }
  
  // 📦 Get all ratings for a ride  
  getRatings(rideId: number): Observable<any> {
    return this.http.get(`${this.ratingUlr}/${rideId}`);
  }
  // Get all ratings for a specific publisher (driver)
getRatingsByPublisher(publisherId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.ratingUlr}/${publisherId}`);
}
}
