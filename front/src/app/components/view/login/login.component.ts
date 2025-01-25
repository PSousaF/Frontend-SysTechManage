import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../service/AuthenticationService';
import { AlertService } from '../../service/AlertService';

@Component({
  selector: 'app-login',
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
      this.router.navigate(['/producao']);
      /*  this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        const username: string = this.loginForm.controls.username.value as string;
        const password: string = this.loginForm.controls.password.value as string;

        this.loading = true;
        this.authenticationService.login(username, password).subscribe(res => {
            const { data, success } = res;
            if (!success) {
              this.erro_login = res.error || res.status || 'Erro desconhecido';
              this.alertService.showAlert('warning','' ,"teste");
              this.loading = false;
            } else if (!data.ativo) {
              this.alertService.showAlert('warning', '', 'Usuario Bloqueado');
              this.loading = false;
            }
             else {
              this.alertService.showAlert('success', 'Logado com sucesso!');
              this.loading = false;
              //this.verificaAcesso(data.access);
              this.router.navigate(['/producao'])
            }
          },
          error => {
            console.log(error);
            this.erro_login = error.error.error || error.status || 'Erro desconhecido';
            this.alertService.showAlert('warning', this.erro_login);
            this.invalid = this.erro_login == "Usuário e/ou senha inválidos" ? true : false;
            this.loading = false;
          }
        );*/
      }

      onInput() {
        this.invalid = false;
      }
}
