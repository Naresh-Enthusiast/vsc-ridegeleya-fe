import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  private apiUrl = 'http://localhost:5205/api/v1/User/availability';

  constructor(private http: HttpClient) {}

  searchRides(rideData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, rideData, { headers });
  }

  getRides(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
