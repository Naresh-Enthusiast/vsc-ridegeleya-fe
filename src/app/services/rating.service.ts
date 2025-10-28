import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl = 'http://localhost:5205/api/v1/Ratings';

  constructor(private http: HttpClient) {}

  // ➕ Add a new rating
  addRating(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, data);
  }

  // 📦 Get all ratings for a ride  
  getRatings(rideId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${rideId}`);
  }
  // Get all ratings for a specific publisher (driver)
getRatingsByPublisher(publisherId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.getRatings}/${publisherId}`);
}
}
