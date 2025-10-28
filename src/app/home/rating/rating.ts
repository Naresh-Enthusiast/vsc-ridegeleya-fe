import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rating.html',
  styleUrls: ['./rating.css']
})
export class Rating implements OnInit {
  @Input() rideId!: number; // input from parent
  userId!: number;
  stars = 0;
  comment = '';
  avgRating = 0;
  ratings: any[] = [];

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.userId = parseInt(localStorage.getItem('userId') || '0', 10);
    this.loadRatings();
  }

  selectStar(star: number) {
    this.stars = star;
  }

  submitRating() {
    if (!this.stars) {
      alert('Please select a rating');
      return;
    }

    const payload = {
      rideId: this.rideId,
      userId: this.userId,
      stars: this.stars,
      comment: this.comment
    };

    this.ratingService.addRating(payload).subscribe({
      next: () => {
        this.comment = '';
        this.stars = 0;
        this.loadRatings();
      },
      error: (err) => console.error('Error submitting rating:', err)
    });
  }

  loadRatings() {
    this.ratingService.getRatings(this.rideId).subscribe({
      next: (data: any[]) => {
        this.ratings = data;
        this.avgRating = data.length
          ? data.reduce((a, b) => a + b.stars, 0) / data.length
          : 0;
      }
    });
  }
}
