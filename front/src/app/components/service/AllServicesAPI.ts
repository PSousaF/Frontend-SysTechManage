import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthenticationService } from './AuthenticationService';


const url = environment.API;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AllService {

  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient) { }

  
  addNewUser(data: any): Observable<any> {
    return this.http.post<any>(`${url}/user/new`, data, {
      headers: this.authenticationService.getAuthHeaders(),
    });
  }
  
  addNewClient(data: any): Observable<any> {
    return this.http.post<any>(`${url}/client/new`, data, {
      headers: this.authenticationService.getAuthHeaders(),
    });
  }
    
  allClients(): Observable<any> {
    return this.http.get<any>(`${url}/client/all_clients`, {
      headers: this.authenticationService.getAuthHeaders(),
    });
  }
    
  getValues(): Observable<any> {
    return this.http.get<any>(`${url}/client/get_values`, {
      headers: this.authenticationService.getAuthHeaders(),
    });
  }
    
  updateValues(data: any): Observable<any> {
    return this.http.post<any>(`${url}/client/update_values`, data, {
      headers: this.authenticationService.getAuthHeaders(),
    });
  }

  allOnwer(): Observable<any> {
    return this.http.get<any>(`${url}/user/all_users`, {
      headers: this.authenticationService.getAuthHeaders(),
    });
  }

  allBudget(): Observable<any> {
    return this.http.get<any>(`${url}/client/all_budget`, {
      headers: this.authenticationService.getAuthHeaders(),
    });
  }

    allOutfitter(): Observable<any> {
    return this.http.get<any>(`${url}/client/all_supliers`, {
      headers: this.authenticationService.getAuthHeaders(),
    });
  }

  listOrders(): Observable<any> {
    return this.http.get<any>(`${url}/client/list_orders`, {
      headers: this.authenticationService.getAuthHeaders(),
    });
  }
    
  disableEnableItem(id:number, item: string) {
      return this.http.get<any>(`${url}/${item}/${id}`, {
        headers: this.authenticationService.getAuthHeaders(),
      });
  }

  getSeachCliOrOnwer(item: string): Observable<any> {
    return this.http.get<any>(`${url}/client/seach/${item}`, {
      headers: this.authenticationService.getAuthHeaders(),
    });
  }

  getSeachBudget(item: string): Observable<any> {
    return this.http.get<any>(`${url}/client/seach_budget/${item}`, {
      headers: this.authenticationService.getAuthHeaders(),
    });
  }

  insertNewBudget(data: any): Observable<any> {
    return this.http.post<any>(url + "/client/new_budget", data, {
      headers: this.authenticationService.getAuthHeaders(),
    });
  }

  getImageBudget(item: string): Observable<any> {
    return this.http.get<any>(`${url}/client/get_image/${item}`);
  }
  
  getSeachOrder(item: string): Observable<any> {
    return this.http.get<any>(`${url}/user/new`);
  }
  
  getSelectedOrder(item: string): Observable<any> {
      return this.http.get<any>(`${url}/manufacture/order/${item}`);
  }
  
  getSelectedProd(item: string): Observable<any> {
      return this.http.get<any>(`${url}/manufacture/prd/${item}`);
  }
  
  getDailyOrder(): Observable<any> {
    return this.http.get<any>(`${url}/manufacture/daily`);
  }

  getItensOrder(id: string): Observable<any> {
    return this.http.get<any>(`${url}/manufacture/orderItens/${id}`);
  }
  
  getItensPendings(): Observable<any> {
    return this.http.get<any>(`${url}/manufacture/pending`);
  }

  postDataProtuction(data: any): Observable<any> {
    return this.http.post<any>(url + "/manufacture/resume", data, httpOptions);
  }

  postSeachOrder(item: string): Observable<any> {
    return this.http.post<any>(`${url}/manufacture/item/${item}`, {});
  }

  postSaveItens(data: any): Observable<any> {
    return this.http.post<any>(`${url}/manufacture/save_production`, data, httpOptions);
  }

}

