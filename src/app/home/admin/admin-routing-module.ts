import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path : 'publisher-requests', loadComponent: () => import('../admin/publisher-requests/publisher-requests').then(m => m.PublisherRequestsadmin)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
  
}
