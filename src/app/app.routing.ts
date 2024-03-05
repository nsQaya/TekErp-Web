import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './core/components/app/layouts/admin-layout/admin-layout.component';
import { AdminLayoutModule } from './core/modules/admin-layout.module';

// import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
// import { LoginComponent } from './login/login.component';

const routes: Routes =[
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, 


  {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      // loadChildren: './core/components/app/layouts/admin-layout/admin-layout.module#AdminLayoutModule'
      loadChildren: './core/modules/admin-layout.module#AdminLayoutModule'
      // Lazy loading kullanımı yerine direkt olarak modülü import etme
      //loadChildren: () => AdminLayoutModule,
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
    [RouterModule]
  ],
})
export class AppRoutingModule { }
