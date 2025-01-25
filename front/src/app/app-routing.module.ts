import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/view/login/login.component';
import { MainComponent } from './components/view/main/main.component';
//import { EmptyLayoutComponent } from './components/others/empty-layout/empty-layout.component';
import { AuthGuard } from '../app/components/service/AuthGuard';

const routes: Routes = [
  /*{
    path: 'test', component: DefaultLayoutComponent, data: { title: 'Producao' },
    //  children: [
    //    { path: '', component: PinturaComponent }
    //  ], //canActivate: [AuthGuard]
    },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },*/
  {path: 'login', component: LoginComponent, data: { title: 'Login' }},
  {path: '', component: LoginComponent, data: { title: 'Login' }},
  {path: 'main', component: MainComponent, data: { title: 'Main' }},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
