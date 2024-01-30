import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Kod4 } from '../models/kod4';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Kod4Service {

  constructor(private httpClient: HttpClient) { }


  getKod4List(): Observable<Kod4[]> {

    return this.httpClient.get<Kod4[]>(environment.getApiUrl + '/kod4s/getall')
  }

  getKod4ById(id: number): Observable<Kod4> {
    return this.httpClient.get<Kod4>(environment.getApiUrl + '/kod4s/getbyid?id='+id)
  }

  addKod4(kod4: Kod4): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/kod4s/', kod4, { responseType: 'text' });
  }

  updateKod4(kod4: Kod4): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/kod4s/', kod4, { responseType: 'text' });

  }

  deleteKod4(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/kod4s/', { body: { id: id } });
  }


}