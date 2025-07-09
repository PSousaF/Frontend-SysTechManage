import { Component, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  template: `<div class="alert alert-{{type}}" role="alert" [innerHTML]="message">
      <button type="button" class="btn-close" (click)="onClose()"></button></div>`,
  styles: [`
    :host {
      display: block;
      transition: opacity 0.3s ease;
      opacity: 1;
      position: fixed;
      top: 12px !important;
      right: 12px !important;
      z-index: 1050 !important;
      transition: opacity 1.5s ease-in-out;
    }
    :host.fade-out {
      opacity: 0;
    }
  `]
})
export class AlertComponent {
  @Output() close = new EventEmitter<void>();
  message: string = '';
  type: string = 'primary';

  onClose(): void {
    this.close.emit();  
  }
} 