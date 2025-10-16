import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';

interface Publishers {
  publisherId: number;
  userId: number;
  license_Number: string;
  license_Photo: string;
  rcBook_Photo: string;
  vehicle_Color: string;
  vehicle_Model: string;
  status: string;
  approvedAt: Date;   // ✅ fixed typo
}

@Component({
  selector: 'app-approved',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './approved.html',
  styleUrls: ['./approved.css']
})
export class Approved implements OnInit {

  requests: Publishers[] = [];
  selectedImage: string | undefined;

  private baseUrl = 'http://localhost:5205/api/Admin'; // ✅ corrected

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.http.get<Publishers[]>(`${this.baseUrl}/approved`)
      .pipe(
        catchError(error => {
          console.error('Error loading requests:', error);
          alert('Failed to load approved requests');
          return of([]);
        })
      )
      .subscribe(data => {
        this.requests = data;
      });
  }

  viewImage(imageData: string): void {
    this.selectedImage = `data:image/jpeg;base64,${imageData}`;
  }
}
