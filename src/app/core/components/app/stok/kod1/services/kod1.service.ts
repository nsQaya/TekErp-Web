import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Kod1 } from '../models/Kod1';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Kod1Service {

  constructor(private httpClient: HttpClient) { }


  getKod1List(): Observable<Kod1[]> {

    return this.httpClient.get<Kod1[]>(environment.getApiUrl + '/kod1s/getall')
  }

  getKod1ById(id: number): Observable<Kod1> {
    return this.httpClient.get<Kod1>(environment.getApiUrl + '/kod1s/getbyid?id='+id)
  }

  addKod1(kod1: Kod1): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/kod1s/', kod1, { responseType: 'text' });
  }

  updateKod1(kod1: Kod1): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/kod1s/', kod1, { responseType: 'text' });

  }

  deleteKod1(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/kod1s/', { body: { id: id } });
  }


}