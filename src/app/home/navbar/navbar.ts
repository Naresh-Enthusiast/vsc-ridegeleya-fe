import { Component } from '@angular/core';
import { AdminRoutingModule } from "../admin/admin-routing-module";

@Component({
  selector: 'app-navbar',
  imports: [AdminRoutingModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

}
