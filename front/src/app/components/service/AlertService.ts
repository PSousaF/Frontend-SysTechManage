import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { AlertComponent } from '../others/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}
/**
 * @param {string} type - Mensagem padrão.
 * @param {string} message - Mensagem padrão.
 * @param {string} messageStrong - Mensagem negrito (vem antes do padrão).
 * @param {string} timeout - 3,5s padrão.
 **/
  showAlert(type: string = 'primary', message: string, messageStrong: string = '', timeout: number = 3500) {
    const alertFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const alertRef = alertFactory.create(this.injector);
    if(messageStrong != '' && messageStrong != null && messageStrong != undefined)
      messageStrong = '<strong>' + messageStrong + ' </strong>'
    alertRef.instance.message = messageStrong + message;
    alertRef.instance.type = type;
    
    this.appRef.attachView(alertRef.hostView);

    const domElem = (alertRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    alertRef.instance.close.subscribe(() => {
      this.closeAlert(alertRef, domElem);
    });

    setTimeout(() => {
      this.closeAlert(alertRef, domElem);
    }, timeout);
  }

  private closeAlert(alertRef: any, domElem: any) {
    domElem.classList.add('fade-out');
    this.appRef.detachView(alertRef.hostView);
    alertRef.destroy();
  }
}
