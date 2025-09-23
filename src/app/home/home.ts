import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar';
@Component({
  selector: 'app-home',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  data: any[] = [];  

  constructor() {
    // Example data (replace with API call later)
    this.data = [
      { id: 1, name: 'Angular' },
      { id: 2, name: 'TypeScript' },
      { id: 3, name: 'Frontend' }
    ];
  }
}
