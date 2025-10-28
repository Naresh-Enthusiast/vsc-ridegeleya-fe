import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { About } from '../../about/about';
import { NgModel } from '@angular/forms';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, About,CommonModule], // ✅ include CommonModule for *ngIf
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = true;
  userId: string | null = null;

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.userId = localStorage.getItem('userId');
    this.isLoggedIn = !!this.userId;
  }
}
