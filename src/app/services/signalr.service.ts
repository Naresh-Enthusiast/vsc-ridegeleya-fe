import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRServices {
  private hubConnection!: signalR.HubConnection;

  // 🔹 Start connection (userId optional — only for publisher)
  startConnection(userId?: number): void {
    let url = 'http://localhost:5205/notificationHub';
    if (userId) {
      url += `?userId=${userId}`;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url, { withCredentials: true })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() =>
        console.log(
          `✅ SignalR connected to /notificationHub ${
            userId ? 'for user ' + userId : '(admin connection)'
          }`
        )
      )
      .catch(err => console.error('❌ SignalR connection error:', err));
  }

  // 🔔 Admin → Publisher events
  onPublisherApproved(callback: (requestId: number) => void): void {
    this.hubConnection.on('PublisherRequestApproved', callback);
  }

  onPublisherRejected(callback: (requestId: number) => void): void {
    this.hubConnection.on('PublisherRequestRejected', callback);
  }

  // 🔔 Publisher → Admin event (for new requests)
  onNewPublisherRequest(callback: (request: any) => void): void {
    this.hubConnection.on('NewPublisherRequest', callback);
  }

  // 🧪 Optional test method
  sendNotification(message: string): void {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection
        .send('SendNotification', message)
        .then(() => console.log('📨 Test notification sent:', message))
        .catch(err => console.error('❌ SignalR send error:', err));
    } else {
      console.warn('⚠️ SignalR not connected. Cannot send notification.');
    }
  }

  // 🔌 Stop the connection safely
  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection
        .stop()
        .then(() => console.log('🔌 SignalR connection stopped.'))
        .catch(err => console.error('❌ Error stopping SignalR connection:', err));
    }
  }
}
