import { Injectable } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from './AlertService';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(
    private modalService: NgbModal,
    private alertService: AlertService
  ) {}
  simple_modal = true;
  /**
   * @param {string} componet - é o modal selecionado.
   * @param {string} tam - sm, md, lg, xl | padrão é sm
   * @param {string} alert - true = 'success','Salvo com sucesso!', false não dispara nenhum. | padrão true
   **/
  openModal(componet: any, tam: any = 'sm', alert: boolean = true) {
    //sm, md, lg, xl
    if (this.simple_modal == true) {
      const modalRef = this.modalService.open(componet, {
        size: tam,
        ariaLabelledBy: 'modal-basic-title',
      });
      this.simple_modal = false;
      modalRef.result.then(
        (result) => {
          if (alert) {
            this.alertService.showAlert('success', 'Salvo com sucesso!');
          }
          this.simple_modal = true;
        },
        (reason) => {
          // console.log(`Dismissed ${this.getDismissReason(reason)}`);
          this.simple_modal = true;
        }
      );
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
