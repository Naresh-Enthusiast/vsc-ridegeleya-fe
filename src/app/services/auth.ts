import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUserId: number | null = null;

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
}
