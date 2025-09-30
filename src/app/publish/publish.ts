import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publish.html',
  styleUrls: ['./publish.css']
})
export class PublishComponent  {
  ride = {
    from: '',
    to: '',
    date: '',
    time: ''
  };

  postRide() {
    console.log("Ride posted:", this.ride);
    alert(`Ride Published!\nFrom: ${this.ride.from}\nTo: ${this.ride.to}\nDate: ${this.ride.date}\nTime: ${this.ride.time}`);
  }
}
