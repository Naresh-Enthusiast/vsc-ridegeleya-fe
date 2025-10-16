import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5205/api/v1/Admin';

  constructor(private http: HttpClient) {}

  // Admin login
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // Get all publisher requests
  getPublisherRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/publisher-requests`);
  }

  // Approve a request
  approve(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/approve`, { id: requestId });
  }

  // Reject a request
  reject(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/reject`, { id: requestId });
  }
}
