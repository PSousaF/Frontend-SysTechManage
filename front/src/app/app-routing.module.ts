import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/view/login/login.component';
import { MainComponent } from './components/view/main/main.component';
//import { EmptyLayoutComponent } from './components/others/empty-layout/empty-layout.component';
import { AuthGuard } from '../app/components/service/AuthGuard';
import { InternalLayoutComponent } from './components/others/internal-layout/internal-layout.component'; 
import { HomeComponent } from './components/view/home/home.component';

const routes: Routes = [
  /*{ path: '',   redirectTo: '/login', pathMatch: 'full' },*/
  {path: 'login', component: LoginComponent, data: { title: 'Login' }},
  {path: '', component: LoginComponent, data: { title: 'Login' }},
  //{path: 'home', component: MainComponent, data: { title: 'Login' }},
  {
    path: 'main', component: InternalLayoutComponent, data: { title: 'Main' },
      children: [
        { path: '', component: MainComponent }
      ], //canActivate: [AuthGuard]
    },
    {
      path: 'home', component: InternalLayoutComponent, data: { title: 'Home' },
        children: [
          { path: '', component: HomeComponent }
        ], //canActivate: [AuthGuard]
      },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
