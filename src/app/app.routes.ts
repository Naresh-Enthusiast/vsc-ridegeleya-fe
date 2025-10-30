import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home';
import { RegistrationComponent } from "./profile/registartion";
import { LoginComponent } from './profile/login/login';
import { AdminLogin } from './home/adminLogin/AdminLogin';
import { FormsModule } from '@angular/forms';
import { PublisherRequest } from './home/publish-request/publish-request';
import { OtpVerify } from './otp-verify/otp-verify';
import { ProfileComponent } from './profile/userprofile/userprofile';
import { PublishRide } from './publish-ride/publish-ride';
// import { AuthGuard } from './guards/auth-guard';
import { Approved } from './home/admin/approved/approved';
import { ForgotPassword } from './home/passwordreset/passwordreset';
import { PublisherRequestsadmin } from './home/admin/publisher-requests/publisher-requests';
import { Contact } from './contact/contact';
import { Tracting } from './tracting/tracting';
import { Rating } from './home/rating/rating';
import { Map } from './map/map';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'create', component: PublishRide },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'AdminLogin', component: AdminLogin },
  { path: 'PublisherRequest', component: PublisherRequest },
  { path: 'otp-verify', component: OtpVerify },
  { path: 'userprofile', component: ProfileComponent },
  { path: 'appoved', component: Approved },
  { path: 'tracting', component: Tracting },
  { path: 'admin', loadChildren: () => import('./home/admin/admin-module').then(m => m.AdminModule) },
  { path: 'publish-ride', component: PublishRide },
  { path: 'password-reset', component: ForgotPassword },
  { path: 'publisher-requests', component: PublisherRequestsadmin },
  { path: 'home', loadChildren: () => import('./home/home').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./about/about').then(m => m.About) },
  { path: 'booking-detail', loadComponent: () => import('./home/booking-detail/booking-detail').then(m => m.BookingDetails) },
  { path: 'booking-details', loadComponent: () => import('./home/booking-detail/booking-detail').then((m) => m.BookingDetails) },
  { path: 'Contact', component: Contact },
  { path: 'Rating', component: Rating },
  { path: 'profile', component: ProfileComponent },
  { path: 'map', component: Map }
];


@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
