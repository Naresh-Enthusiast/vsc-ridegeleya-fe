import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing-module';
import { DashboardComponent } from './dashboard/dashboard';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DashboardComponent,
  ]
})


export class AdminModule { }
