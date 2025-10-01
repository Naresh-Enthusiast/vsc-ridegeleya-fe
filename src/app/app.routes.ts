import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home';
import { RegistrationComponent } from "./profile/registartion";
import { LoginComponent } from './profile/login/login';
import { AdminLogin } from './home/adminLogin/AdminLogin';
import { FormsModule } from '@angular/forms';
import { PublishRideComponent } from './publish-ride/publish-ride';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'create', component: PublishRideComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'AdminLogin', component: AdminLogin },
  { path: 'publish-ride', component: PublishRideComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'admin', loadChildren: () => import('./home/admin/admin-module').then(m => m.AdminModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
