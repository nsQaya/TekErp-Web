import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SAPKod } from '../models/sapkod';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SAPKodService {

  constructor(private httpClient: HttpClient) { }


  getSAPKodList(): Observable<SAPKod[]> {

    return this.httpClient.get<SAPKod[]>(environment.getApiUrl + '/sAPKods/getall')
  }

  getSAPKodById(id: number): Observable<SAPKod> {
    return this.httpClient.get<SAPKod>(environment.getApiUrl + '/sAPKods/getbyid?id='+id)
  }

  addSAPKod(sAPKod: SAPKod): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/sAPKods/', sAPKod, { responseType: 'text' });
  }

  updateSAPKod(sAPKod: SAPKod): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/sAPKods/', sAPKod, { responseType: 'text' });

  }

  deleteSAPKod(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/sAPKods/', { body: { id: id } });
  }


}