import { Component } from '@angular/core';
import { AdminRoutingModule } from '../admin/admin-routing-module';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-AdminLogin',
  standalone: true,
  imports: [AdminRoutingModule,FormsModule],
  templateUrl: './AdminLogin.html',
  styleUrl: './AdminLogin.css'
})
export class AdminLogin 
{
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    const adminUser = 'admin';
    const adminPass = 'admin123';

    if (this.username === adminUser && this.password === adminPass) {
      this.router.navigate(['/admin/dashboard']);
    } 
    else {
      alert('Invalid credentials. Please try again.');
    }
  }
}
