import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCirclePlay, faCirclePlus, faEye, faPencil, faRefresh, faSearch, faSign, faSignIn, faTimes, faTrash, faUser, faUserAltSlash, faUserAstronaut, faUserCircle, faUserCog, faUserFriends, faUserGroup, faUserPlus, faUserSlash, faUserTie, faUserTimes } from '@fortawesome/free-solid-svg-icons';
import { AlertService } from '../../service/AlertService';
import { AllService } from '../../service/AllServicesAPI';
import { GenericService } from '../../service/GenericService';
import { ModalService } from '../../service/ModalService';
import { RouterModule,Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-peoples',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './peoples.component.html',
  styleUrl: './peoples.component.scss'
})
export class PeoplesComponent implements OnInit {
  @ViewChild('modalEdit', { static: true }) modalEdit!: TemplateRef<any>;
  faCirclePlay = faCirclePlay
  faSearch = faSearch
  faCirclePlus = faCirclePlus
  faPencil = faPencil
  faEye = faEye
  faTrash = faTrash
  faUser = faUser
  faUserCircle = faUserCircle
  faUserFriends = faUserFriends
  faUserPlus = faUserPlus
  faUserTie = faUserTie
  faUserCog = faUserCog
  faRefresh = faRefresh
  show_clients: boolean = false
  show_suppliers: boolean = false
  show_filter: boolean = false
  show_users: boolean = true
  loading: boolean = false;
  only_view: boolean = false;
  list_peoples: any[] = [];
  list_users: any[] = [];
  list_clients: any[] = [];
  list_suppliers: any[] = [];
  filter_list: any[] = [];
  item_selected: any;
  title: string = 'Usuário'
  errorMessage: string = ' '
  localize_item: string = '';
  currentItem: any = {};


  constructor(
    private router: Router,
    private modalService: ModalService,
    private generic: GenericService,
    private request: AllService,
    private changeDetector: ChangeDetectorRef,
    private alertService: AlertService ) 
    {
    const acess = localStorage.getItem('permissao');
    if(Number(acess) > 0) {
      this.router.navigate([`/ordens`])
    }
  }
  ngOnInit(): void {
    this.getAllClients()
    this.getAllUsers()
    this.getAllOutfitter()
  }

  listUsers() {
    this.title = 'Usuário'
    this.show_clients = false
    this.show_suppliers = false
    this.show_users = true
    this.show_filter = false
  }


  listClients() {
    this.title = 'Cliente'
    this.show_clients = true
    this.show_suppliers = false
    this.show_users = false
    this.show_filter = false
  }

  listSupplier() {
    this.title = 'Fornecedor'
    this.show_clients = false
    this.show_suppliers = true
    this.show_users = false
    this.show_filter = false
  }
  
  editItem(item: any = null, edit: boolean = true ) {
    this.item_selected = item;
    this.only_view = edit;
    this.currentItem = {...item};
    this.modalService.openModal(this.modalEdit, 'lg', false);
  }

   getAllClients() {
      this.loading = true;
      this.request.allClients().subscribe(res => {
          const { data, success } = res;
          if (success) {
            this.list_clients = data
            this.loading = false;
          } 
            else {
            this.alertService.showAlert('warning', 'Nenhum dado encontrado!');
            this.loading = false;
          }
        },
        error => {
        const errorResponse = error.error;
        const errorMessage = errorResponse?.data?.[0]?.error || 
                          error.error?.error || 
                          error.statusText || 
                          'Erro desconhecido';
          this.alertService.showAlert('warning', this.errorMessage);
          this.loading = false;
        }
      );
      this.changeDetector.detectChanges();
   }

   getAllUsers() {
      this.loading = true;
      this.request.allOnwer().subscribe(res => {
          const { data, success } = res;
          if (success) {
            this.list_users = data
            this.loading = false;
          } 
            else {
            this.alertService.showAlert('warning', 'Nenhum dado encontrado!');
            this.loading = false;
          }
        },
        error => {
        const errorResponse = error.error;
        const errorMessage = errorResponse?.data?.[0]?.error || 
                          error.error?.error || 
                          error.statusText || 
                          'Erro desconhecido';
          this.alertService.showAlert('warning', this.errorMessage);
          this.loading = false;
        }
      );
      this.changeDetector.detectChanges();
   }

   getAllOutfitter() {
      this.loading = true;
      this.request.allOutfitter().subscribe(res => {
          const { data, success } = res;
          if (success) {
            this.list_suppliers = data
            this.loading = false;
          } 
            else {
            this.alertService.showAlert('warning', 'Nenhum dado encontrado!');
            this.loading = false;
          }
        },
        error => {
        const errorResponse = error.error;
        const errorMessage = errorResponse?.data?.[0]?.error || 
                          error.error?.error || 
                          error.statusText || 
                          'Erro desconhecido';
          this.alertService.showAlert('warning', this.errorMessage);
          this.loading = false;
        }
      );
      this.changeDetector.detectChanges();
   }


   localizeItem(event: Event) {
    this.show_filter = true;
    const target = event.target as HTMLInputElement;
    this.localize_item = target.value.replace(/\s+/g, '');
    this.filter_list = []
    if (target.value != '') {
      setTimeout(() => {
      const lowerCaseSearchTerm = this.localize_item.toLowerCase();
      this.filter_list = [
        ...this.searchInArray(this.list_users, lowerCaseSearchTerm),
        ...this.searchInArray(this.list_clients, lowerCaseSearchTerm),
        ...this.searchInArray(this.list_suppliers, lowerCaseSearchTerm)
      ];
      this.changeDetector.detectChanges();
      }, 350);
    } else {
      this.show_filter = false
      this.cleanEvent();
    }
    this.changeDetector.detectChanges();
  }

  deleteRestaureItem(id:number, type: boolean, disable: boolean = false) {
    let del = ''
    if(disable) {
      del = (type === false ? 'user/disable' : 'client/disable')
    }
    else {
      del = (type === false ? 'user/active' : 'client/active')
    }
    let refresh = del.split('/')[0]
    let data = del.split('/')[1]
      this.loading = true;
      this.request.disableEnableItem(id, del).subscribe(res => {
            refresh === 'user' ? this.getAllUsers() : this.getAllOutfitter()
            data === 'active' ? this.alertService.showAlert('success', 'Usuario ativado com sucesso!') : this.alertService.showAlert('warning', 'Usuario desativado com sucesso!'); 
        },
        error => {
        const errorResponse = error.error;
        const errorMessage = errorResponse?.data?.[0]?.error || 
                          error.error?.error || 
                          error.statusText || 
                          'Erro desconhecido';
          this.alertService.showAlert('warning', this.errorMessage);
          this.loading = false;
        }
      );
      this.changeDetector.detectChanges();
  }

  searchInArray(array: any[], searchValue: string): any[] {
    if (!array) return [];
    return array.filter(item => {
      return Object.keys(item).some(key => {
        const value = item[key];
        return typeof value === 'string' && 
              value.toLowerCase().includes(searchValue);
      });
    });
  }

  getItemType(item: any = this.item_selected): string {
    if (this.isClient(item)) return 'Cliente';
    if (this.isSupplier(item)) return 'Fornecedor';
    if (this.isUser(item)) return 'Usuário';
    return 'Desconhecido';
  }

  isClient(item: any): boolean {
    return this.list_clients?.some(c => c.id === item.id) ?? false;
  }

  isSupplier(item: any): boolean {
    return this.list_suppliers?.some(s => s.id === item.id) ?? false;
  }

  isUser(item: any): boolean {
    return this.list_users?.some(u => u.id === item.id) ?? false;
  }

  cleanEvent() {
    this.localize_item = '';
    this.filter_list = [];
  }

  cleanModal() {
    this.currentItem = {};
  }

  saveItem() {
    if (this.title.includes('Fornecedor')) {
      this.saveFornecedor();
    } else if (this.title.includes('Usuário')) {
      this.saveUsuario();
    } else if (this.title.includes('Cliente')) {
      this.saveCliente();
    }
  }

  private saveFornecedor() {
    // Lógica para salvar fornecedor
    console.log('Salvando fornecedor:', this.currentItem);
  }

  private saveUsuario() {
    // Lógica para salvar usuário 
    console.log('Salvando usuário:', this.currentItem);
  }

  private saveCliente() {
    // Lógica para salvar cliente
    console.log('Salvando cliente:', this.currentItem);
  }

  desabledBtnTrash(){
    //this.alertService.showAlert('warning', 'Exclusão de cliente');
  }
}
