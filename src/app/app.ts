import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdminLogin } from './home/adminLogin/AdminLogin';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, HttpClientModule,AdminLogin],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('vsc-ridegeleya');
}


