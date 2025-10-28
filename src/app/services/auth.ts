import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5205/api/v1/Admin';
  private userIdKey = 'userId';
  private publisherIdKey = 'publisherId';

  constructor(private http: HttpClient) {}

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  getPublisherId(): string | null {
    return localStorage.getItem(this.publisherIdKey);
  }

  setPublisherId(id: number): void {
    localStorage.setItem(this.publisherIdKey, id.toString());
  }

  fetchAndSetPublisherId() {
    const userId = this.getUserId();
    if (!userId) return;

    this.http.get(`${this.baseUrl}/approved/${userId}`).subscribe({
      next: (res: any) => {
        // Assuming response contains publisherId
        if (res && res.publisherId) {
          this.setPublisherId(res.publisherId);
          console.log('Publisher ID saved:', res.publisherId);
        }
      },
      error: (err) => {
        console.error('Failed to fetch publisher ID', err);
      }
    });
  }
}

