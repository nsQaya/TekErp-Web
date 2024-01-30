import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DovizTipi } from '../models/DovizTipi';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DovizTipiService {

  constructor(private httpClient: HttpClient) { }


  getDovizTipiList(): Observable<DovizTipi[]> {

    return this.httpClient.get<DovizTipi[]>(environment.getApiUrl + '/dovizTipis/getall')
  }

  getDovizTipiById(id: number): Observable<DovizTipi> {
    return this.httpClient.get<DovizTipi>(environment.getApiUrl + '/dovizTipis/getbyid?id='+id)
  }

  addDovizTipi(dovizTipi: DovizTipi): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/dovizTipis/', dovizTipi, { responseType: 'text' });
  }

  updateDovizTipi(dovizTipi: DovizTipi): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/dovizTipis/', dovizTipi, { responseType: 'text' });

  }

  deleteDovizTipi(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/dovizTipis/', { body: { id: id } });
  }


}