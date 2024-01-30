import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Kod3 } from '../models/Kod3';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Kod3Service {

  constructor(private httpClient: HttpClient) { }


  getKod3List(): Observable<Kod3[]> {

    return this.httpClient.get<Kod3[]>(environment.getApiUrl + '/kod3s/getall')
  }

  getKod3ById(id: number): Observable<Kod3> {
    return this.httpClient.get<Kod3>(environment.getApiUrl + '/kod3s/getbyid?id='+id)
  }

  addKod3(kod3: Kod3): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/kod3s/', kod3, { responseType: 'text' });
  }

  updateKod3(kod3: Kod3): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/kod3s/', kod3, { responseType: 'text' });

  }

  deleteKod3(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/kod3s/', { body: { id: id } });
  }


}