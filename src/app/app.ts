import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminLogin } from './home/adminLogin/AdminLogin';
import { SignalRService } from './services/signal-r';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, HttpClientModule, AdminLogin],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('vsc-ridegeleya');
  private userId!: number;

  constructor(
    private signalRService: SignalRService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Get logged-in userId from localStorage
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      // Start SignalR connection
      this.signalRService.startConnection(this.userId);

      // Listen for notifications
      this.signalRService.listenForNotifications((message: string) => {
        // Show toastr popup
        this.toastr.info(message, 'Notification');
      });
    }
  }

  ngOnDestroy(): void {
    // Stop SignalR when app destroyed
    this.signalRService.stopConnection();
  }
}

