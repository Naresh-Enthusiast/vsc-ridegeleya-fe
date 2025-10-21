import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRServices {
  private hubConnection!: signalR.HubConnection;

  
  startConnection(userId?: number): void {
    let url = 'http://localhost:5205/notificationHub';
    if (userId) {
      url += `?userId=${userId}`;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(`✅ SignalR connected to /notificationHub${userId ? ' for user ' + userId : ''}`))
      .catch(err => console.error('❌ SignalR connection error', err));
  }

  // Listen when Admin approves a request
  onPublisherApproved(callback: (requestId: number) => void): void {
    this.hubConnection.on('PublisherRequestApproved', callback);
  }

  // Listen when Admin rejects a request
  onPublisherRejected(callback: (requestId: number) => void): void {
    this.hubConnection.on('PublisherRequestRejected', callback);
  }

  // Optional: send a test notification
  sendNotification(message: string): void {
    if (this.hubConnection) {
      this.hubConnection.send('SendNotification', message)
        .catch(err => console.error('❌ SignalR send error', err));
    }
  }
}
