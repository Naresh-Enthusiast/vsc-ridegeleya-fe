import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home';
import {PublishComponent} from "./publish/publish";
import {ProfileComponent} from "./profile/profile";


export const routes: Routes = [
    {path: '', component: HomeComponent},
    { path: 'create', component: PublishComponent },
    {path: 'profile', component: ProfileComponent},];

    @NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
    
    export class AppRoutingModule { }