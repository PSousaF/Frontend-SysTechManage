import { Injectable, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './AuthenticationService';

@Injectable({
  providedIn: 'root',
})
export class GenericService {
  /* private workItemSource = new BehaviorSubject<string>('Prod');
  currentWorkItem = this.workItemSource.asObservable();
  private orderItemSource = new BehaviorSubject<any>('');
  currentOrderItem = this.orderItemSource.asObservable();

  changeWorkItem(workItem: string) {
    this.workItemSource.next(workItem);
  }

  changeOrderItem(orderItem: any) {
    this.orderItemSource.next(orderItem);
  }*/

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  setMouth(currentDate: any) {
    switch (currentDate) {
      case 0:
        return 'JAN';
      case 1:
        return 'FEV';
      case 2:
        return 'MAR';
      case 3:
        return 'ABR';
      case 4:
        return 'MAI';
      case 5:
        return 'JUN';
      case 6:
        return 'JUL';
      case 7:
        return 'AGO';
      case 8:
        return 'SET';
      case 9:
        return 'OUT';
      case 10:
        return 'NOV';
      case 11:
        return 'DEZ';
      default:
        return 'ERR';
    }
  }

  setWeek(week: any) {
    switch (week) {
      case 0:
        return 'Domingo';
      case 1:
        return 'Segunda-feira';
      case 2:
        return 'Terça-feira';
      case 3:
        return 'Quarta-feira';
      case 4:
        return 'Quinta-feira';
      case 5:
        return 'Sexta-feira';
      case 6:
        return 'Sábado';
      default:
        return 'ERR';
    }
  }

  verifyTurn(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.authService.logout();
      return false;
    }
    let data = new Date();
    let turno = localStorage.getItem('turn')?.replace(/\D/g, '');
    if (Number(turno) < 1) {
      this.authService.logout();
      return false;
    }
    switch (turno) {
      case '1': {
        if (data.getHours() > 14 || data.getHours() < 6) {
          return true;
        }
        break;
      }
      case '2': {
        if (data.getHours() > 22 || data.getHours() < 14) {
          return true;
        }
        break;
      }
      case '3': {
        if (data.getHours() > 6 || data.getHours() < 22) {
          return true;
        }
        break;
      }
      default:
        return true;
    }
    return false;
  }

  getAtualTurn(): string {
    let data = new Date();
    if (data.getHours() < 14 && data.getHours() > 6) {
      return '1TURNO';
    } else if (data.getHours() < 22 && data.getHours() > 14) {
      return '2TURNO';
    } else {
      return '3TURNO';
    }
  }

  ajustNumberDate(n: any) {
    if (typeof n === 'string') {
      return n.padStart(2, '0');
    } else {
      return n.toString().padStart(2, '0');
    }
  }

  getWeekNumber(date: any): number {
    const startOfYear: any = new Date(date.getFullYear(), 0, 1);
    const daysInYear = Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24));
    const firstDayOfYear = startOfYear.getDay() || 7; // Domingo = 7
    const weekNumber = Math.ceil((daysInYear + firstDayOfYear - 1) / 7);
    return weekNumber;
  }
  //{string} date - envia a data caso vazio ele pega a data atual.
  /** Retorna a data conforme solicitado
   * @param {boolean} hour - padrão é false - true retorna a hora, false apenas a data.
   * @param {string} only_hour - padrão é false - true retorna apenas a hora.
   * @param {string} type - padrão é - podendo mudar para estilo /.
   * @param {boolean} style - padrão é true - true formato BR, false retorna formato US.
   **/
  getDateHour(hour: boolean = false, only_hour: boolean = false, type: string = '-', style: boolean = true): string {
    const currentDate = new Date();
    let data_atual;
    let hora_atual =
      String(currentDate.getHours()).padStart(2, '0') +
      ':' +
      String(currentDate.getMinutes()).padStart(2, '0') +
      ':' +
      String(currentDate.getSeconds()).padStart(2, '0');
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    if (!style) {
      data_atual = year + type + month + type + day;
    } else {
      data_atual = day + type + month + type + year;
    }
    if (hour) {
      data_atual = data_atual + ' ' + hora_atual;
    }
    if (only_hour) {
      data_atual = hora_atual;
    }
    return data_atual;
  }

    //{string} date - envia a data caso vazio ele pega a data atual.
  /** Retorna a data conforme solicitado
   * @param {string} convert - é o valor para ser convertido, obs sempre yyyy não importando o formato.
   * @param {string} type - padrão é - podendo mudar para estilo /.
   * @param {boolean} style - padrão é true - true formato BR, false retorna formato US.
   * @param {boolean} hour - padrão é false - true retorna a hora, false apenas a data.
   * @param {string} only_hour - padrão é false - true retorna apenas a hora.
   **/
  convertDateHour(convert: string, type: string = '-', style: boolean = true, hour: boolean = false, only_hour: boolean = false): string {
    const [getDate, getHour] = convert.split(' ')
    let date = '';
    if (only_hour) {
      return getHour;
    }
    if (getDate.includes('/')) {
      date = this.getConvertedDateHour(getDate, '/', type, style)
    }
    else if (getDate.includes('.')) {
      date = this.getConvertedDateHour(getDate, '.', type, style)
    }
    else if (getDate.includes('-')) {
      date = this.getConvertedDateHour(getDate, '-', type, style)
    }
    if (hour) {
      return date + ' ' + getHour;
    }
    return date
  }

  getConvertedDateHour(convert: string, char_item: string, type: string, style: boolean) {
    const [item1, item2, item3] = convert.split(char_item)
    let day;
    let mouth;
    let year;
    if(item1.length === 4) {
      year = item1
      day = item3
    }
    else {
      year = item3
      day = item1
    }
    mouth = item2
    if (!style) {
      return year + type + mouth + type + day;
    } else {
      return day + type + mouth + type + year;
    }
  }

  getPdfDetail(): string {
    const currentDate = new Date();
    let data_atual;
    let hora =
      String(currentDate.getHours()).padStart(2, '0') +
      String(currentDate.getMinutes()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    data_atual =
      day + month + currentDate.getFullYear().toString().slice(-2) + hora;
    return data_atual;
  }

  convertNumber(valor: number | string): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numero);
  }

  /** Retorna na lista com limite de data (padrão 7 dias)
   * @param {string | Date} itemDate - retorna boleano conferência finalizada.
   **/
  moreLimitDays(itemDate: string | Date): boolean {
    const date = new Date(itemDate);
    const today = new Date();
    const limitTime = today.getTime() - date.getTime();
    const limitDays = limitTime / (1000 * 60 * 60 * 24);
    return limitDays > 30; //mudar para 7 depois
  }

  compareDate(start: any, end: any): boolean {
    if (start != undefined && end != undefined) {
      let [day1, mouth1, year1] = start.split('/');
      let [day2, mouth2, year2] = end.split('/');
      if (year1 > year2) {
        return false;
      } else if (mouth1 > mouth2) {
        return false;
      } else if (day1 > day2 && mouth1 >= mouth2 && year1 >= year2) {
        return false;
      }
    }
    return true;
  }

  setCurrentDate() {
    const today = new Date();
    let date_picker = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
    return date_picker
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
