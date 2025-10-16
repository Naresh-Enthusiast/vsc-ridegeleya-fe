import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AdminRoutingModule } from "../admin-routing-module";
import { RouterLink } from '@angular/router';

interface PublisherRequest {
  publishRequestId: number;
  userId: number;
  license_Number: string;
  license_Photo: string;
  rcBook_Photo: string;
  vehicle_Color: string;
  vehicle_Model: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

@Component({
  selector: 'app-publisher-requests',
  standalone: true,
  imports: [CommonModule, HttpClientModule, AdminRoutingModule, RouterLink],
  templateUrl: './publisher-requests.html',
  styleUrls: ['./publisher-requests.css']
})
export class PublisherRequestsadmin implements OnInit {
  requests: PublisherRequest[] = [];
  loading = false;
  selectedImage: string | null = null;
  processingId: number | null = null;

  private baseUrl = 'http://localhost:5205/api/v1/Admin';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.http.get<PublisherRequest[]>(`${this.baseUrl}/publisher-requests`)
      .pipe(
        catchError(error => {
          console.error('Error loading requests:', error);
          alert('Failed to load publisher requests');
          return of([]);
        })
      )
      .subscribe(data => {
        this.requests = data;
        this.loading = false;
      });
  }

  approveRequest(requestId: number): void {
    if (!confirm('Are you sure you want to approve this request?')) return;

    this.processingId = requestId;
    this.http.post(`${this.baseUrl}/approve/${requestId}`, {})
      .pipe(
        catchError(error => {
          console.error('Error approving request:', error);
          alert(`Failed to approve request. Error: ${error.status} - ${error.statusText}`);
          this.processingId = null;
          return of(null);
        })
      )
      .subscribe(response => {
        if (response !== null) {
          alert('Request approved successfully!');
          this.processingId = null;
          this.requests = this.requests.filter(r => r.publishRequestId !== requestId);
        }
      });
  }

  rejectRequest(requestId: number): void {
    if (!confirm('Are you sure you want to reject this request?')) return;

    this.processingId = requestId;
    this.http.post(`${this.baseUrl}/reject/${requestId}`, {})
      .pipe(
        catchError(error => {
          console.error('Error rejecting request:', error);
          alert(`Failed to reject request. Error: ${error.status} - ${error.statusText}`);
          this.processingId = null;
          return of(null);
        })
      )
      .subscribe(response => {
        if (response !== null) {
          alert('Request rejected successfully!');
          this.processingId = null;
          this.requests = this.requests.filter(r => r.publishRequestId !== requestId);
        }
      });
  }

  viewImage(imageData: string): void {
    this.selectedImage = `data:image/jpeg;base64,${imageData}`;
  }

  closeImage(): void {
    this.selectedImage = null;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Accepted': return 'status-accepted';
      case 'Rejected': return 'status-rejected';
      default: return '';
    }
  }
}
