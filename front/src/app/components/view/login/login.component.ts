import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../service/AuthenticationService';
import { AlertService } from '../../service/AlertService';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule 
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  erro_login = "Erro no servidor, contacte o suporte"
  loading = false;
  submitted = false;
  invalid = false;

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private authenticationService: AuthenticationService,
      private alertService: AlertService) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
      // reset login status
      this.authenticationService.logout();
      this.alertService.showAlert('primary', 'Faça o login novamente, ', 'Login Expirado')

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    
    const username: string = this.loginForm.controls.username.value as string;
    const password: string = this.loginForm.controls.password.value as string;

      this.submitted = true;
      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      this.authenticationService.login(username, password).subscribe(res => {
          const { data, success } = res;
          if (!success) {
            const errorMessage = data?.[0]?.error || 'Erro desconhecido';
            this.alertService.showAlert('warning','' ,errorMessage);
            this.loading = false;
          } else if (!data.ativo) {
            this.alertService.showAlert('warning', '', 'Usuario Bloqueado');
            this.loading = false;
          }
            else {
            this.alertService.showAlert('success', 'Logado com sucesso!');
            this.loading = false;
            console.log(localStorage.getItem('permissao'))
            this.router.navigate([`/${this.verifyAcess(data.permissao)}`])
            
          }
        },
        error => {
          console.log(error);
        const errorResponse = error.error;
        const errorMessage = errorResponse?.data?.[0]?.error || 
                          error.error?.error || 
                          error.statusText || 
                          'Erro desconhecido';
          this.erro_login = errorMessage;
          this.alertService.showAlert('warning', this.erro_login);
          this.loading = false;
        }
      );
    }

    onInput() {
      this.invalid = false;
    }

    verifyAcess(permissao: number) {
      switch (permissao) {
        case 0:
          return 'main';
        case 1:
          return 'ordens';
        case 2:
          return 'ordens';
        default:
          return 'ordens';
      }
    }

}
