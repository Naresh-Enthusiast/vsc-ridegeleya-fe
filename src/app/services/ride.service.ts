import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RideService {
  // Replace with your actual API URL
  private apiUrl = 'http://localhost:5205/api/User/availability'; // Update this URL

  constructor(private http: HttpClient) {}

  // POST method to search/create ride query
  searchRides(rideData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}`, rideData, { headers });
  }

  // Optional: GET method if you need to fetch rides
  getRides(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}