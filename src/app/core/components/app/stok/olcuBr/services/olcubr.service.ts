import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OlcuBr } from '../models/olcubr';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OlcuBrService {

  constructor(private httpClient: HttpClient) { }


  getOlcuBrList(): Observable<OlcuBr[]> {

    return this.httpClient.get<OlcuBr[]>(environment.getApiUrl + '/olcuBrs/getall')
  }

  getOlcuBrById(id: number): Observable<OlcuBr> {
    return this.httpClient.get<OlcuBr>(environment.getApiUrl + '/olcuBrs/getbyid?id='+id)
  }

  addOlcuBr(olcuBr: OlcuBr): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/olcuBrs/', olcuBr, { responseType: 'text' });
  }

  updateOlcuBr(olcuBr: OlcuBr): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/olcuBrs/', olcuBr, { responseType: 'text' });

  }

  deleteOlcuBr(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/olcuBrs/', { body: { id: id } });
  }


}