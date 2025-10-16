import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing-module';
import { PublisherRequest } from '../publish-request/publish-request';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PublisherRequest
  ]
})


export class AdminModule { }
