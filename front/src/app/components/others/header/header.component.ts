import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { faCircleUser, faCirclePlus, faCog, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../service/ModalService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'header',
  standalone: true,
  imports: [FaIconComponent,FormsModule, CommonModule],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      state('out', style({ opacity: 0, transform: 'translateY(-10px)', display: 'none' })),
      transition('in <=> out', [
        animate('200ms ease-in-out')
      ])
    ])
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild('modaNewBudget', { static: true }) modaNewBudget!: TemplateRef<any>;
  faCircleUser = faCircleUser;
  faCog = faCog;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  isDropdownOpen = false;
  faCirclePlus = faCirclePlus;
  
  error_new_user:boolean = false;
  show_info_deail:boolean = false;
  add_name:string = '';
  add_user:string = '';
  add_cpf:string = '';
  add_password:string = '';
  access_usr:string = '';

    constructor(private modalService: ModalService) { }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  
  newBudget() {
    this.modalService.openModal(this.modaNewBudget, 'md', false);
  }

  cleanNewBudget() {

  }

  cleanNewUser() {
  this.error_new_user = false;
  this.show_info_deail = false;
  this.add_name = '';
  this.add_user = '';
  this.add_cpf = '';
  this.add_password = '';
  this.access_usr = '';
  }
    
  changeAccess(event: any): void {
    //this.status_access = event.target.value;
    const selectedValue = event.target.value;
    console.log('Valor selecionado do Turno:', selectedValue);
  }

  saveNewBudget() {

  }
}