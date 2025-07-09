import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector, PLATFORM_ID, Inject } from '@angular/core';
import { AlertComponent } from '../others/alert/alert.component';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * @param {string} type - Tipo do alerta (primary, success, danger, etc.)
   * @param {string} message - Mensagem principal
   * @param {string} messageStrong - Mensagem em negrito (opcional)
   * @param {number} timeout - Tempo em ms (padrão: 3500) - (opcional)
   */
  showAlert(type: string = 'primary', message: string, messageStrong: string = '', timeout: number = 3500) {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('AlertService: Document not available in server environment');
      return;
    }

    try {
      const alertFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
      const alertRef = alertFactory.create(this.injector);
      
      if (messageStrong?.trim()) {
        messageStrong = `<strong>${messageStrong}</strong> `;
      }
      
      alertRef.instance.message = messageStrong + message;
      alertRef.instance.type = type;
      
      this.appRef.attachView(alertRef.hostView);

      const domElem = (alertRef.hostView as any).rootNodes[0] as HTMLElement;
      
      if (typeof document !== 'undefined') {
        document.body.appendChild(domElem);

        alertRef.instance.close.subscribe(() => {
          this.closeAlert(alertRef, domElem);
        });

        setTimeout(() => {
          this.closeAlert(alertRef, domElem);
        }, timeout);
      }
    } catch (error) {
      console.error('Error showing alert:', error);
    }
  }

  private closeAlert(alertRef: any, domElem: HTMLElement) {
    if (domElem) {
      domElem.classList.add('fade-out');
      setTimeout(() => {
        this.appRef.detachView(alertRef.hostView);
        alertRef.destroy();
      }, 300);
    } else {
      this.appRef.detachView(alertRef.hostView);
      alertRef.destroy();
    }
  }
}