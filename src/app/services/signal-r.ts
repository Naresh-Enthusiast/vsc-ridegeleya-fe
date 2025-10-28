import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  // 🔹 Start SignalR connection and pass userId as query param
  startConnection(userId: number): void {
    const url = `http://localhost:5205/notificationHub?userId=${userId}`;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url, { withCredentials: true })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(`✅ Connected to SignalR as user ${userId}`))
      .catch(err => console.error('❌ SignalR connection failed:', err));

    // 🔹 Listen for backend notifications
    this.hubConnection.on('ReceiveNotification', (notification: any) => {
      console.log('📢 Notification received:', notification);
      alert(`${notification.title}: ${notification.message}`);
    });

  
    
  }

  // 🔹 Optional helper: send message from frontend
  sendNotification(message: string): void {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.send('SendNotification', message)
        .catch(err => console.error('SignalR send error:', err));
    } else {
      console.warn('⚠️ Hub not connected. Cannot send message.');
    }
  }

  // 🔹 Optional cleanup
  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('🛑 SignalR connection stopped.'));
    }
  }
}
