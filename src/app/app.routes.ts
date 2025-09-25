import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home';
import { PublishComponent } from "./publish/publish";
import { ProfileComponent } from "./profile/profile";
import { AdminLogin } from './home/adminLogin/AdminLogin';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'create', component: PublishComponent },
  { path: 'profile', component: ProfileComponent },
  {path: 'admin',loadChildren: () =>import('./home/admin/admin-module').then(m => m.AdminModule)},
  {path: 'AdminLogin', component: AdminLogin}
];

@NgModule({
  imports: [RouterModule.forRoot(routes),FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
