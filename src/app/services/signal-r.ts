import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  startConnection(userId: number) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5205/notificationHub?userId=${userId}`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(`✅ SignalR connected as User ${userId}`))
      .catch(err => console.error('❌ SignalR connection error:', err));
  }

  listenForNotifications(callback: (message: string) => void) {
    this.hubConnection.on('ReceiveNotification', (message: string) => callback(message));
  }

  stopConnection() {
    this.hubConnection?.stop();
  }
}
