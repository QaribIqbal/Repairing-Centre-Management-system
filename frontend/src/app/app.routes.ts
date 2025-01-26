import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddApplianceComponent } from './components/add-appliance/add-appliance.component';
import { HomepageComponent } from './components/homepage/homepage.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'home', component: HomepageComponent },
  { path: 'addAppliance', component: AddApplianceComponent },
  // other routes can go here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
