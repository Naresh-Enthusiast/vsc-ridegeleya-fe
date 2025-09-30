import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home';
import { PublishComponent } from "./publish/publish";
import { RegistrationComponent } from "./profile/registartion";
import { LoginComponent } from './profile/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'create', component: PublishComponent },
  { path: 'register', component: RegistrationComponent },
  {path:'login',component:LoginComponent},
  {path: 'admin',loadChildren: () =>import('./home/admin/admin-module').then(m => m.AdminModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
