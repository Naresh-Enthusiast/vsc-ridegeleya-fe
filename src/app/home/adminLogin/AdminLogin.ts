import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PublisherRequestsadmin } from '../admin/publisher-requests/publisher-requests';
import { AdminService } from '../../services/admin';
import { AdminRoutingModule } from "../admin/admin-routing-module";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule, PublisherRequestsadmin, AdminRoutingModule],
  templateUrl: './adminLogin.html',
  styleUrls: ['./adminLogin.css']
})
export class AdminLogin {
  username = '';
  password = '';
  isLoggedIn = false;

  constructor(private adminService: AdminService) {}

  login() {
    this.adminService.login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          this.isLoggedIn = true;
          alert('Login successful');

        },
        error: () => alert('Login failed')
      });
  }
}
