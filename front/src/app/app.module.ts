import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptor } from './components/service/AuthInterceptor';
import { AuthenticationService } from './components/service/AuthenticationService';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/view/login/login.component';
import { MainComponent } from './components/view/main/main.component';
import { BudgetComponent } from './components/view/budget/budget.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/others/header/header.component';
import { FooterComponent } from './components/others/footer/footer.component';
import { InternalLayoutComponent } from './components/others/internal-layout/internal-layout.component';
import { HomeComponent } from './components/view/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BudgetComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    InternalLayoutComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule 
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthenticationService,],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { 
  /*constructor() {
    registerLocaleData(localePt);
  }*/
}
