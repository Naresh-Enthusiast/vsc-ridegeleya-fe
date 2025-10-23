import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRServices {
  private hubConnection!: signalR.HubConnection;

  //observable emits events for components
  public bookingRequests$ = new BehaviorSubject<any>(null);
  public rideResponses$ = new BehaviorSubject<any>(null);

  constructor() {}
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
      .then(() => console.log(` SignalR connected to /notificationHub${userId ? ' for user ' + userId : ''}`))
      .catch(err => console.error(' SignalR connection error', err));
  
  }

  //Register Hub listeners
  private registerOnServerEvents():void{

    //publisher receives booking request
    console.log('Registering SignalR server events...');
    this.hubConnection.on('ReceiveBookingRequest',(data: any)=>{
      console.log('Received booking request:', data);
      this.bookingRequests$.next(data);
    });

    //rider receives response(accept/Deny)
    this.hubConnection.on('ReceiveRideResponse',(data: any)=>{
      console.log('Received ride response:', data);
      this.rideResponses$.next(data);
    });
  }

  //user books a ride 
  UserBookedRide(publisherId: number, userId: number, rideId:number): void {
    this.hubConnection.invoke('UserBookedRide', publisherId, userId, rideId)
      .catch(err => console.error('SignalR invoke error', err));
  }

  //publisher responds to booking -> notify user
  PublisherResponded(userId: number, rideId: number, status: string): void {
    console.log("publisher response");
    this.hubConnection.invoke('PublisherResponded', userId, rideId, status)
      .catch(err => console.error('SignalR invoke error', err));
  }
  // Listen when Admin approves a request
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
      
      this.hubConnection.send('SendNotification')
        .catch(err => console.error('SignalR send error', err));
      this.hubConnection
        .stop()
        .then(() => console.log('🔌 SignalR connection stopped.'))
        .catch(err => console.error('❌ Error stopping SignalR connection:', err));
    }
  }
}
