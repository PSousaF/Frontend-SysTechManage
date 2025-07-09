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
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule,RouterModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent  implements OnInit{
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
  nome_cli: string = 'Cliente';
  tel_cli: string = '123';
  end_cli: string = '';
  id_cli: number = 0;
  id_answerable: number = 0;
  localize_client: string = '';
  localize_orders_item: string = '';
  type_order: string = '';
  model_orders: string = '';
  qtde_orders: string = '';
  mark_orders: string = '';
  serie_orders: string = '';
  defect_orders: string = '';
  analise_orders: string = '';
  detail_item_order: string = 'Em análise';
  cause_orders: string = '';
  obs_orders: string = '';
  value_orders: string = '';
  soluction_orders: string = '';
  pcutility_orders: string = '';
  bid_orders: string = '';
  cost_orders: string = '';
  id_orders: number = 0;
  ordem_id: number = 0;
  imageUrls: string[] = [];
  title_cli_ans: boolean = false;
  finish_orders: boolean = false;
  showNewBudget = false;
  startBuddgeItem = false;
  answerable: string = 'nome - usuário';
  img_modal: string = '';
  list_budget: any;
  list_peoples: any;
  detail_list_order: any;
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
      this.request.listOrders().subscribe(res => {
          const { data, success } = res;
          if (success) {
            this.list_budget = data
            this.detail_list_order = data[0]
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
      this.detail_list_order = item
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



      
      const data:any = {
        id_cliente: this.id_cli,
        id_answerable:this.id_answerable,
        cliente:this.localize_client,
        tipo:this.type_order,
        modelo:this.model_orders,
        qtde:this.qtde_orders,
        marca:this.mark_orders,
        serie:this.serie_orders,
        defeito:this.defect_orders,
        analise:this.analise_orders,
        obs:this.obs_orders,
        aparroved: true,
        finish: this.finish_orders,
      }
      if (this.cost_orders != null) {
        data.cost = this.cost_orders;
      }
      if (this.value_orders != null) {
        data.valor = this.value_orders;
      }
      if (this.soluction_orders != null) {
        data.solucao = this.soluction_orders;
      }
      if (this.cause_orders != null) {
        data.causa = this.cause_orders
      }
      if (this.detail_item_order != null) {
        data.situation = this.detail_item_order;
      }
      if (this.pcutility_orders != null) {
        data.pcutility = this.pcutility_orders;
      }
      if (this.id_orders > 0) {
        data.id = this.id_orders;
      } 
      if (this.bid_orders != '') {
        data.bid = this.bid_orders;
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
    this.localize_orders_item = target.value.replace(/\s+/g, '');
    this.list_budget = []
    if (target.value != '') {
      setTimeout(() => {
      this.request.getSeachBudget(this.localize_orders_item).subscribe(res => {
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
    this.localize_orders_item = '';
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
      this.ordem_id = item.id
      this.type_order = item.deviceType;
      this.model_orders = item.model;
      this.qtde_orders = item.quantity;
      this.mark_orders = item.model;
      this.serie_orders = item.serie;
      this.defect_orders = item.defect;
      this.analise_orders = item.review;
      this.detail_item_order = item.situation;
      this.cause_orders = item.possibleCauses;
      this.id_orders = item.id;
      this.bid_orders = item.bid;
      this.obs_orders = item.observation
      this.value_orders = item.valueItem
      this.soluction_orders = item.soluction
      this.pcutility_orders = item.pcsutility
      this.cost_orders = item.cost
      this.finish_orders = item.finish === "Sim" ? true : false; 
    }

   changeBudget(show: boolean) {
    this.showNewBudget = show
    this.startBuddgeItem = false;
    if(!show) {
      this.type_order = '';
      this.model_orders = '';
      this.qtde_orders = '';
      this.mark_orders = '';
      this.serie_orders = '';
      this.defect_orders = '';
      this.analise_orders = '';
      this.detail_item_order = '';
      this.cause_orders = '';
      this.obs_orders = '';
      this.bid_orders = '';
      this.value_orders = '';
      this.pcutility_orders = '';
      this.cost_orders = '';
      this.id_orders = 0;
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
    this.finish_orders = input.checked;
  }
  
    onSelectChange(event: Event)  {
      const input = event.target as HTMLInputElement;
      this.detail_item_order = input.value;
    }
}
