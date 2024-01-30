import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Kod2 } from '../models/Kod2';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Kod2Service {

  constructor(private httpClient: HttpClient) { }


  getKod2List(): Observable<Kod2[]> {

    return this.httpClient.get<Kod2[]>(environment.getApiUrl + '/kod2s/getall')
  }

  getKod2ById(id: number): Observable<Kod2> {
    return this.httpClient.get<Kod2>(environment.getApiUrl + '/kod2s/getbyid?id='+id)
  }

  addKod2(kod2: Kod2): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/kod2s/', kod2, { responseType: 'text' });
  }

  updateKod2(kod2: Kod2): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/kod2s/', kod2, { responseType: 'text' });

  }

  deleteKod2(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/kod2s/', { body: { id: id } });
  }


}