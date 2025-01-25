import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const url = environment.API;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AllService {

  constructor(private http: HttpClient) { }

  getSeachOrder(item: string): Observable<any> {
    return this.http.get<any>(`${url}/manufacture/item/${item}`);
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

