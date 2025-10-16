import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUserId: number | null = null;
  private baseUrl = 'http://localhost:5205/api/v1/Admin';


  constructor(private http: HttpClient) {}

  // Fake login for demo
  login(userId: number) {
    this.loggedInUserId = userId;
    localStorage.setItem('userId', userId.toString());
  }

  logout() {
    this.loggedInUserId = null;
    localStorage.removeItem('userId');
  }

  getUserId(): number | null {
    if (this.loggedInUserId) return this.loggedInUserId;

    const storedId = localStorage.getItem('userId');
    return storedId ? parseInt(storedId, 10) : null;
  }

  getPublisherId(): number | null {
    if (this.loggedInUserId) return this.loggedInUserId;

    const storedId = localStorage.getItem('userId');
    return storedId ? parseInt(storedId, 10) : null;
  }


  isLoggedIn(): boolean {
    return this.getUserId() !== null;
  }
  
  sendOtp(username: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-otp`, username, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  verifyOtp(username: string, otp: string): Observable<any> {
    const body = { username, otp };
    return this.http.post(`${this.baseUrl}/verify-otp`, body);
  }
}
