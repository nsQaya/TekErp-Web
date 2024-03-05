import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DinamikDepoOzet } from '../models/DinamikDepoOzet';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DinamikDepoOzetService {

  constructor(private httpClient: HttpClient) { }


  getDinamikDepoOzetList(): Observable<DinamikDepoOzet[]> {

    return this.httpClient.get<DinamikDepoOzet[]>(environment.getApiUrl + '/dinamikDepoOzets/getall')
  }

  getDinamikDepoOzetById(id: number): Observable<DinamikDepoOzet> {
    return this.httpClient.get<DinamikDepoOzet>(environment.getApiUrl + '/dinamikDepoOzets/getbyid?kayitYapanKullaniciID='+id)
  }

  addDinamikDepoOzet(dinamikDepoOzet: DinamikDepoOzet): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/dinamikDepoOzets/', dinamikDepoOzet, { responseType: 'text' });
  }

  updateDinamikDepoOzet(dinamikDepoOzet: DinamikDepoOzet): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/dinamikDepoOzets/', dinamikDepoOzet, { responseType: 'text' });

  }

  deleteDinamikDepoOzet(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/dinamikDepoOzets/', { body: { kayitYapanKullaniciID: id } });
  }


}