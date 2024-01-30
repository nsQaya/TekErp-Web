import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Kod5 } from '../models/Kod5';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Kod5Service {

  constructor(private httpClient: HttpClient) { }


  getKod5List(): Observable<Kod5[]> {

    return this.httpClient.get<Kod5[]>(environment.getApiUrl + '/kod5s/getall')
  }

  getKod5ById(id: number): Observable<Kod5> {
    return this.httpClient.get<Kod5>(environment.getApiUrl + '/kod5s/getbyid?id='+id)
  }

  addKod5(kod5: Kod5): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/kod5s/', kod5, { responseType: 'text' });
  }

  updateKod5(kod5: Kod5): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/kod5s/', kod5, { responseType: 'text' });

  }

  deleteKod5(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/kod5s/', { body: { id: id } });
  }


}