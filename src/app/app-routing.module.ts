import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/patient-list', pathMatch: 'full' },

  { path: 'patient-list', component: PatientListComponent},
  { path: 'patient-detail/:id', component: PatientDetailComponent},

  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
