import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userId: string | null = null;

  ngOnInit(): void {
    this.checkLoginStatus();
  }


  

  checkLoginStatus(): void {
    this.userId = localStorage.getItem('userId');
    this.isLoggedIn = !!this.userId;
  }


}
