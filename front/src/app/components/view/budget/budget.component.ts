import { Component, Output, TemplateRef, ViewChild, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalService } from '../../service/ModalService';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { GenericService } from '../../service/GenericService';
import { AlertService } from '../../service/AlertService';
import { faCirclePlay, faCirclePlus, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AllService } from '../../service/AllServicesAPI';

interface UploadedImage {
  file: File;
  data: string | ArrayBuffer | null;
}

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule,RouterModule],
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent  implements OnInit{
  @Output() imagesChanged = new EventEmitter<File[]>();
  @Output() imageUploaded = new EventEmitter<File>();
  @ViewChild('modalNewUser', { static: true }) modalNewUser!: TemplateRef<any>;
  @ViewChild('modalShowUser', { static: true }) modalShowUser!: TemplateRef<any>;
  @ViewChild('modalseachClient', { static: true }) modalseachClient!: TemplateRef<any>;
  @ViewChild('showImageDetails', { static: true }) showImageDetails!: TemplateRef<any>;
  faLocation = faSearch;
  faCirclePlay = faCirclePlay
  faSearch = faSearch
  faTimes = faTimes
  faCirclePlus = faCirclePlus
  usrImgUrl: string = '';
  orcamento: string = 'Novo Orçamento';
  nome_cli: string = 'Cliente';
  tel_cli: string = '123';
  end_cli: string = '';
  id_cli: number = 0;
  id_answerable: number = 0;
  localize_client: string = '';
  localize_budget_item: string = '';
  start_type_budget: string = '';
  start_model_budget: string = '';
  start_qtde_budget: string = '';
  start_mark_budget: string = '';
  start_serie_budget: string = '';
  start_defect_budget: string = '';
  start_analise_budget: string = '';
  start_detail_budget: string = 'Em análise';
  start_cause_budget: string = '';
  start_obs_budget: string = '';
  start_value_budget: string = '';
  start_cost_budget: string = '';
  start_soluction_budget: string = '';
  start_pcutility_budget: string = '';
  start_bid_budget: string = '';
  start_id_budget: number = 0;
  imageUrls: string[] = [];
  title_cli_ans: boolean = false;
  start_aproved_budget: boolean = false;
  showNewBudget = false;
  startBuddgeItem = false;
  answerable: string = 'nome - usuário';
  img_modal: string = '';
  list_budget: any;
  list_peoples: any;
  detail_budget: any;
  isDragOver = false;
  loading = false;
  previewImage: string | ArrayBuffer | null = null;
  errorMessage = '';
  base64Images: { [key: string]: string } = {};
  private validExtensions = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private maxFileSize = 5 * 1024 * 1024; // 5MB
  uploadedImages: UploadedImage[] = [];
  dataImg: any[] = [];
  constructor(
    private router: Router,
    private modalService: ModalService,
    private generic: GenericService,
    private request: AllService,
    private changeDetector: ChangeDetectorRef,
    private alertService: AlertService
  ) {
    const acess = localStorage.getItem('permissao');
    if(Number(acess) > 0) {
      this.router.navigate([`/ordens`])
    }
    for (let i = 1; i <= 10; i++) {
      this.imageUrls.push(`https://mariananardi.com.br/wp-content/uploads/2018/09/Gato-x-leao.jpg`);
    }
    let num_usr = this.generic.getRandomInt(1, 12)
    this.usrImgUrl = `./assets/users/user${num_usr}.jpg`;
   }
  ngOnInit(): void {
    this.listBudget()
  }

/**************************************/

    onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(input.files);
    }
  }

  private handleFiles(files: FileList) {
    this.errorMessage = '';
    const validFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      if (!this.validExtensions.includes(file.type)) {
        this.errorMessage = 'Alguns arquivos têm formato inválido. Apenas JPEG, PNG, GIF ou WebP são permitidos.';
        return;
      }
      
      if (file.size > this.maxFileSize) {
        this.errorMessage = 'Alguns arquivos são muito grandes. Tamanho máximo por arquivo: 5MB.';
        return;
      }
      
      validFiles.push(file);
    });
    
    if (validFiles.length === 0) return;
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
         const base64 = reader.result as string;

        this.base64Images[file.name] = base64;

        this.dataImg.push({ [file.name]: base64 });

        this.uploadedImages.push({
          file: file,
          data: reader.result
        });
        this.emitCurrentImages();
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
    this.emitCurrentImages();
  }

  private emitCurrentImages() {
    this.imagesChanged.emit(this.uploadedImages.map(img => img.file));
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
    fileInput.click();
  }
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

    listBudget() {
      this.loading = true;
      this.list_budget = []
      this.request.allBudget().subscribe(res => {
          const { data, success } = res;
          if (success) {
            this.list_budget = data
            this.detail_budget = data[0]
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
    }

    showItemDetail(item: any) {
      this.detail_budget = item
    }

    onSelectChange(event: Event)  {
      const input = event.target as HTMLInputElement;
      this.start_detail_budget = input.value;
    }

    saveBudget() {
      if(this.nome_cli ==='Cliente') {   
        this.alertService.showAlert('warning','selecione o cliente')
        return
      }
       if(this.answerable === 'nome - usuário') {   
        this.alertService.showAlert('warning','selecione o responsável')
        return
      }
       if(!this.verifySave()) { 
        return
      }
       if(this.start_id_budget > 0 && Number(this.start_value_budget) < 1) { 
        this.alertService.showAlert('warning','Preencha o valor cobrado')
        return
      }
      const data:any = {
        id_cliente: this.id_cli,
        id_answerable:this.id_answerable,
        cliente:this.localize_client,
        tipo:this.start_type_budget,
        modelo:this.start_model_budget,
        qtde:this.start_qtde_budget,
        marca:this.start_mark_budget,
        serie:this.start_serie_budget,
        defeito:this.start_defect_budget,
        analise:this.start_analise_budget,
        obs:this.start_obs_budget,
        aparroved: this.start_aproved_budget
      }
      if (this.start_value_budget != null) {
        data.valor = this.start_value_budget;
      }
      if (this.start_cost_budget != null) {
        data.cost = this.start_cost_budget;
      }
      if (this.start_soluction_budget != null) {
        data.solucao = this.start_soluction_budget;
      }
      if (this.start_cause_budget != null) {
        data.causa = this.start_cause_budget
      }
      if (this.start_detail_budget != null) {
        data.detalhe = this.start_detail_budget;
      }
      if (this.start_pcutility_budget != null) {
        data.pcutility = this.start_pcutility_budget;
      }
      if (this.start_detail_budget != null) {
        data.situation = this.start_detail_budget;
      }
      if (this.start_id_budget > 0) {
        data.id = this.start_id_budget;
      }
      if (this.start_bid_budget != '') {
        data.bid = this.start_bid_budget;
      }
      this.uploadBudget(data);
   }

   seachClients() {
      this.loading = true;
      this.request.allClients().subscribe(res => {
          const { data, success } = res;
          if (success) {
            this.list_peoples = data
            this.loading = false;
          } 
            else {
            this.alertService.showAlert('warning', 'Nenhum dado encontrado!');
            this.loading = false;
          }
          this.list_budget = []
          this.listBudget()
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

   seachAnswerable() {
      this.loading = true;
      this.request.allOnwer().subscribe(res => {
          const { data, success } = res;
          if (success) {
            this.list_peoples = data
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

   localizeClientorOnwer(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.localize_client = target.value.replace(/\s+/g, '');
    this.list_peoples = []
    if (target.value != '') {
      setTimeout(() => {
      this.request.getSeachCliOrOnwer(this.localize_client).subscribe(res => {
          const { data, success } = res;
          if (success) {
            this.list_peoples = data
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
      }, 350);
    } else {
      this.cleanEvent();
    }
    this.changeDetector.detectChanges();
  }

   localizeBudgetItem(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.localize_budget_item = target.value.replace(/\s+/g, '');
    this.list_budget = []
    if (target.value != '') {
      setTimeout(() => {
      this.request.getSeachBudget(this.localize_budget_item).subscribe(res => {
          const { data, success } = res;
          if (success) {
            this.list_budget = data
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
      }, 350);
    } else {
      this.cleanEvent();
    }
    this.changeDetector.detectChanges();
  }

  uploadBudget(data:any ) {
    const dataJson: any = { 
      img: {},
      data: data
    };

    for (let i = 0; i < this.dataImg.length; i++) {
      dataJson.img = { ...dataJson.img, ...this.dataImg[i] };
    }
    const dataItem = JSON.stringify(dataJson, null, 2);

    //const dataItem = JSON.stringify(dataJson, null, 2);
    this.request.insertNewBudget(dataItem).subscribe(
      (res) => {
        if (res.success) {
          this.alertService.showAlert('success', 'Salvo com sucesso!');
          this.changeBudget(false);
          this.changeDetector.detectChanges();
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

  cleanEvent() {
    this.list_peoples = [];
    this.localize_client = '';
    this.localize_budget_item = '';
    this.list_budget = []
    this.listBudget();
    this.changeDetector.detectChanges();
  }

  addClientOrAnswerable(client: boolean) {
    this.title_cli_ans = client;
    this.listClientsOrAnswerable()
    this.modalService.openModal(this.modalseachClient, 'lg', false);
   }

   listClientsOrAnswerable() {
    this.title_cli_ans ? this.seachClients() : this.seachAnswerable()
   }

   cleanModalSeach() {
      this.localize_client = ''
   }

   selectClient(item: any) {
    if(this.title_cli_ans) {
      this.nome_cli = item.nome;
      this.tel_cli = item.telefone;
      this.end_cli = item.endereco;
      this.id_cli = item.id;
    }
    else {
      this.answerable = item.nome + " - " + item.username
      this.id_answerable = item.id;
    }
   }

  startBudget(item: any) {
    this.request.getImageBudget(item.bid).subscribe(
      (res) => {
        const { data, client, user, success } = res;
        if (success) {
          this.uploadedImages = data;
          this.nome_cli = client.nome;
          this.tel_cli = client.telefone;
          this.end_cli = client.endereco;
          this.id_cli = client.id;
          this.answerable = user.nome + " - " + user.username
          this.id_answerable = user.id;
          this.orcamento = "Orçamento ID: " + item.id

          this.changeDetector.detectChanges();
        } else {
          this.alertService.showAlert('warning','Erro: ',' Falha ao carregar: ' + res.motivo);
        }
      },
      (error) => {
        this.alertService.showAlert('warning', 'Erro: ', 'Falha ao carregar!');
      }
    );
    this.getiItensBudget(item)
  }

    getiItensBudget(item: any) {
      this.startBuddgeItem = true;
      this.showNewBudget = true;
      this.start_type_budget = item.deviceType;
      this.start_model_budget = item.model;
      this.start_qtde_budget = item.quantity;
      this.start_mark_budget = item.model;
      this.start_serie_budget = item.serie;
      this.start_defect_budget = item.defect;
      this.start_analise_budget = item.review;
      this.start_detail_budget = item.situation;
      this.start_cause_budget = item.possibleCauses;
      this.start_id_budget = item.id;
      this.start_bid_budget = item.bid;
      this.start_obs_budget = item.observation
      this.start_value_budget = item.valueItem
      this.start_soluction_budget = item.soluction
      this.start_pcutility_budget = item.pcsutility
      this.start_aproved_budget = item.aparroved === "Sim" ? true : false; 
    }

   changeBudget(show: boolean) {
    this.showNewBudget = show
    this.startBuddgeItem = false;
    if(!show) {
      this.orcamento = 'Novo Orçamento';
      this.start_type_budget = '';
      this.start_model_budget = '';
      this.start_qtde_budget = '';
      this.start_mark_budget = '';
      this.start_serie_budget = '';
      this.start_defect_budget = '';
      this.start_analise_budget = '';
      this.start_detail_budget = '';
      this.start_cause_budget = '';
      this.start_obs_budget = '';
      this.start_bid_budget = '';
      this.start_value_budget = '';
      this.start_pcutility_budget = '';
      this.start_id_budget = 0;
      this.uploadedImages = []
      this.listBudget()
    }
   }

  showModalImg(img: any) {
    this.img_modal = img
    this.modalService.openModal(this.showImageDetails, 'lg', false);
  }

  onApprovalChange(event: any) {  
    const input = event.target as HTMLInputElement;
    this.start_aproved_budget = input.checked;
  }


verifySave(): boolean {
    if (this.start_type_budget.trim() ==='') {
      this.alertService.showAlert('danger', 'Preencha o tipo');
      return false;
    }
    else if (this.start_model_budget.trim() ==='') {
      this.alertService.showAlert('danger', 'Preencha o modelo');
      return false;
    }
    else if (Number(this.start_qtde_budget) < 1) {
      this.alertService.showAlert('danger', 'Preencha a quantidade');
      return false;
    }
    else if (this.start_mark_budget.trim() ==='') {
      this.alertService.showAlert('danger', 'Preencha a marca do aparelho');
      return false;
    }
    else if (this.start_serie_budget.trim() ==='') {
      this.alertService.showAlert('danger', 'Preencha o Número de série');
      return false;
    }
    else if (this.start_defect_budget.trim() ==='') {
      this.alertService.showAlert('danger', 'Preencha o defeito inicial');
      return false;
    }
    else if (this.start_analise_budget.trim() ==='') {
      this.alertService.showAlert('danger', 'Preencha a análise inicial');
      return false;
    }
    return true;
}


}
