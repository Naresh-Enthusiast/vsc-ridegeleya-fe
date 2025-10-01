import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home';
import { RegistrationComponent } from "./profile/registartion";
import { LoginComponent } from './profile/login/login';
import { AdminLogin } from './home/adminLogin/AdminLogin';
import { FormsModule } from '@angular/forms';
import { PublisherRequestComponent } from './home/publish-request/publish-request';
import { ProfileComponent } from './profile/userprofile/userprofile';
import { PublishRideComponent } from './publish-ride/publish-ride';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'create', component: PublishRideComponent },
  { path: 'register', component: RegistrationComponent },
  {path:'login',component:LoginComponent},
  {path:'AdminLogin',component:AdminLogin},
  {path:'PublisherRequest',component:PublisherRequestComponent},
  {path:'userprofile',component:ProfileComponent},
  { path: 'admin',loadChildren: () =>import('./home/admin/admin-module').then(m => m.AdminModule)},
  { path: 'publish-ride', component: PublishRideComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
