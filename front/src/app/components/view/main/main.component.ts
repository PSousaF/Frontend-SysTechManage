import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgApexchartsModule,  ApexChart,  ApexNonAxisChartSeries,  ApexResponsive,
  ChartComponent,  ApexTitleSubtitle,  ApexPlotOptions,  ApexLegend } from 'ng-apexcharts';
import {   faMoneyBillWave,   faHandHoldingUsd,  faFileInvoiceDollar,  faTools,  faUserPlus,
  faTasks,  faUserCheck,  faBox,  faChartPie,  faChartLine,  faTrophy,  faUser, faInfoCircle, 
  faCreditCard,
  faMoneyCheck,
  faHouseCircleCheck,
  faMoneyCheckDollar,
  faSpellCheck,
  faClipboardCheck,
  faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../service/ModalService';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { AllService } from '../../service/AllServicesAPI';
import { AlertService } from '../../service/AlertService';
import { GenericService } from '../../service/GenericService';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, FontAwesomeModule, FormsModule,RouterModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild('modalNewUser', { static: true }) modalNewUser!: TemplateRef<any>;
  @ViewChild('modalNewClient', { static: true }) modalNewClient!: TemplateRef<any>;
  @ViewChild('modalAPagar', { static: true }) modalAPagar!: TemplateRef<any>;
  @ViewChild('modalAReceber', { static: true }) modalAReceber!: TemplateRef<any>;
  @ViewChild('modalOrdens', { static: true }) modalOrdens!: TemplateRef<any>;
  @ViewChild('modalPieces', { static: true }) modalPieces!: TemplateRef<any>;
  faMoneyBillWave = faMoneyBillWave;
  faHandHoldingUsd = faHandHoldingUsd;
  faFileInvoiceDollar = faFileInvoiceDollar;
  faTools = faTools;
  faUserPlus = faUserPlus;
  faTasks = faTasks;
  faUserCheck = faUserCheck;
  faBox = faBox;
  faChartPie = faChartPie;
  faChartLine = faChartLine;
  faTrophy = faTrophy;
  faUser = faUser;
  faInfoCircle = faInfoCircle;
  faCreditCard = faCreditCard;
  faMoneyCheck = faCheckCircle;
  error_new_user:boolean = false;
  error_new_client:boolean = false;
  show_info_deail:boolean = false;
  payments:boolean = false;
  add_name:string = '';
  add_user:string = '';
  add_cpf:string = '';
  add_password:string = '';
  access_usr:Number = 1;
  add_tel_client:string = '';
  add_client:string = '';
  add_cpf_cli:string = '';
  add_address_cli:string = '';
  add_email_cli:string = '';
  add_enterprise_cli:string = '';
  errorMessage:string = '';
  list_orders: any;
  list_pieces: any;
  list_values_in: any;
  list_values_out: any;
  to_receive: any;
  checkout: any;
  item_out: any;
  entrade: any;
  
  constructor(
    private router: Router,
    private modalService: ModalService,
    private request: AllService,
    private changeDetector: ChangeDetectorRef,
    private generic: GenericService,
    private alertService: AlertService
  ) { 
    const acess = localStorage.getItem('permissao');
    if(Number(acess) > 0) {
      this.router.navigate([`/ordens`])
    }
  }

  public chartOptions: ChartOptions = {
    series: [57, 93, 35, 18, 12, 3],
    chart: {
      type: 'pie',
      width: '100%'
    },
    labels: ['Aprovados', 'Concluídos', 'Em Análise', 'Em Repado', 'Aguarando Peças', 'Em Garantia'],
    title: {
      text: 'DESEMPENHO DO MÊS'
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return `${sum}`;
              }
            }
          }
        }
      }
    },
    legend: {
      position: 'bottom'
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  ngOnInit(): void {
    this.loadValues()
  }

  loadValues() {
      this.request.getValues().subscribe(res => {
          const { values_in, values_out, pieces, success } = res;
          if (success) {
            this.list_pieces = pieces
            this.list_values_in = values_in.filter((item: any) => item.feito === false);
            this.list_values_out = values_out.filter((item: any) => item.feito === false);
            this.to_receive = values_in.reduce((acumulador:number, mov:any) => {
              if (mov.feito === false) {
                return acumulador + Number(mov.valor);
              }
              return acumulador;
            }, 0);

            this.to_receive = this.to_receive.toFixed(2);

            this.entrade = values_in.reduce((acumulador:number, mov:any) => {
              if (mov.feito === true) {
                return acumulador + Number(mov.valor);
              }
              return acumulador;
            }, 0);

            this.entrade = this.entrade.toFixed(2);

            this.item_out = values_out.reduce((acumulador:number, mov:any) => {
              if (mov.feito === true) {
                return acumulador + Number(mov.valor);
              }
              return acumulador;
            }, 0);

            this.item_out = this.item_out.toFixed(2);

            this.checkout = (this.entrade - this.item_out).toFixed(2);

          } 
            else {
            this.alertService.showAlert('warning', 'Nenhum dado encontrado!');
          }
        },
        error => {
        const errorResponse = error.error;
        const errorMessage = errorResponse?.data?.[0]?.error || 
                          error.error?.error || 
                          error.statusText || 
                          'Erro desconhecido';
          this.alertService.showAlert('warning', this.errorMessage);
        }
      );
      this.changeDetector.detectChanges();
   }

  //////////Modals/////////
  showModalnewUser() {
    this.modalService.openModal(this.modalNewUser, 'md', false);
  }

  showModalToPay() {
    this.modalService.openModal(this.modalAPagar, 'md', false);
  }

  showModalToCollect() {
    this.modalService.openModal(this.modalAReceber, 'lg', false);
  }

  showModalOrder() {
    this.getOrders();
    this.modalService.openModal(this.modalOrdens, 'md', false);
  }

  showModalPieces() {
    this.modalService.openModal(this.modalPieces, 'md', false);
  }

  
  showModalClient() {
    this.modalService.openModal(this.modalNewClient, 'md', false);
  }

  showOrderItens() {
    this.router.navigate(['/ordens']);
  }

  showBudgetItens() {
    this.router.navigate(['/orcamento']);
  }

  listClients() {
    this.router.navigate(['/cadastros']);
  }

 //const onlyNumbers = this.add_cpf.replace(/\D/g, '');   




   getOrders() {
      this.request.listOrders().subscribe(res => {
          const { data, success } = res;
          if (success) {
            this.list_orders = data
          } 
            else {
            this.alertService.showAlert('warning', 'Nenhum dado encontrado!');
          }
        },
        error => {
        const errorResponse = error.error;
        const errorMessage = errorResponse?.data?.[0]?.error || 
                          error.error?.error || 
                          error.statusText || 
                          'Erro desconhecido';
          this.alertService.showAlert('warning', this.errorMessage);
        }
      );
      //this.changeDetector.detectChanges();
   }


 
 formatTel(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length <= 2) {
    value = `(${value}`;
  } else if (value.length <= 6) {
    value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
  } else if (value.length <= 10) {
    value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
  } else {
    value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
  }
  input.value = value;
  this.add_tel_client = value;
  this.verifyDataNewClient();
  //this.changeDetector.detectChanges();
}

 formatCPF(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');

  if (value.length > 3 && value.length <= 6) {
    value = value.replace(/(\d{3})(\d+)/, '$1.$2');
  } else if (value.length > 6 && value.length <= 9) {
    value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  } else if (value.length > 9) {
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  }
  input.value = value;
  this.add_cpf = value;
  this.verifyDataNewUser();
  //this.changeDetector.detectChanges();
}

  cleanNewClient() {
    this.error_new_client = false;
    this.add_tel_client = '';
    this.add_client = '';
    this.add_cpf_cli = '';
    this.add_address_cli = '';
    this.add_enterprise_cli = '';
    this.add_email_cli = '';
  }

  cleanNewUser() {
  this.error_new_user = false;
  this.show_info_deail = false;
  this.add_name = '';
  this.add_user = '';
  this.add_cpf = '';
  this.add_password = '';
  this.access_usr = 1;
  }

  saveNewUser() {
    const data = {
      nome: this.add_name,
      username: this.add_user,
      password: this.add_password,
      cpf: this.add_cpf,
      ativo: 1
    }

this.request.addNewUser(data).subscribe(
  res => {
    if (res.status && res.status !== 201) {
      const msg = res.message || `Operação retornou status ${res.status}`;
      this.alertService.showAlert('warning', msg);
    } else {
      this.alertService.showAlert('success', 'Adicionado com sucesso!');
    }
    this.cleanNewUser();
  },
  error => {
    const errorMsg = error.error?.message || 
                   error.error?.error || 
                   error.message || 
                   'Erro desconhecido';
    this.alertService.showAlert('danger', "Usuário ja cadastrado!");
  }
);
  }
 
  saveNewClient() {
    this.cleanNewClient();
    const data = {
      nome: this.add_client,
      telefone: this.add_tel_client,
      endereco: this.add_address_cli,
      cpf: this.add_cpf_cli,
      email: this.add_email_cli
    }

this.request.addNewClient(data).subscribe(
  res => {
    if (res.status && res.status !== 201) {
      // Se tiver status e não for 201
      const msg = res.message || `Operação retornou status ${res.status}`;
      this.alertService.showAlert('warning', msg);
    } else {
      // Sucesso (status 201 ou sem status na resposta)
      this.alertService.showAlert('success', 'Adicionado com sucesso!');
    }
    this.cleanNewUser();
  },
  error => {
    const errorMsg = error.error?.message || 
                   error.error?.error || 
                   error.message || 
                   'Erro desconhecido';
    this.alertService.showAlert('danger', "Usuário ja cadastrado!");
  }
);


  }

  verifyDataNewClient(): boolean {
    const isAddressValid = !!this.add_address_cli?.trim();
    const isClieValid = !!this.add_client?.trim();
    const isTelValid = this.add_tel_client?.length == 15;
    return isClieValid && isAddressValid && isTelValid;
  }


  verifyDataNewUser(): boolean {
    const isNameValid = !!this.add_name?.trim();
    const isUserValid = !!this.add_user?.trim();
    const isCpfValid = this.add_cpf?.length == 14;
    const isPasswordValid = this.add_password?.length >= 6;
    return isNameValid && isUserValid && isCpfValid && isPasswordValid;
  }

  changeAccess(event: any): void {
    const selectedValue = event.target.value;
  }

  ajustDate(date:string) {
     return this.generic.convertDateHour(date, '/')
  }

  ajustValue(value:string) {
     return Number(value).toFixed(2);
  }

  showValues(bol: boolean) {
    this.payments = bol
    this.changeDetector.detectChanges();
  }
  
  updateValues(item:any) {
    item.feito = true;
    this.request.updateValues(item).subscribe(
      (res) => {
        if (res.success) {
          this.loadValues();
          this.alertService.showAlert('success', 'Salvo com sucesso!');
        } else {
          this.alertService.showAlert(
            'warning',
            'Erro: ',
            ' Falha ao salvar: ' + res.motivo
          );
        }
      },
      (error) => {
        this.alertService.showAlert('warning', 'Erro: ', 'Falha ao salvar!');
      }
    );
  }
}
