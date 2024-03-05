import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DinamikDepoHucre } from '../models/DinamikDepoHucre';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DinamikDepoHucreService {

  constructor(private httpClient: HttpClient) { }


  getDinamikDepoHucreList(): Observable<DinamikDepoHucre[]> {

    return this.httpClient.get<DinamikDepoHucre[]>(environment.getApiUrl + '/dinamikDepoHucres/getall')
  }

  getDinamikDepoHucreById(id: number): Observable<DinamikDepoHucre> {
    return this.httpClient.get<DinamikDepoHucre>(environment.getApiUrl + '/dinamikDepoHucres/getbyid?kayitYapanKullaniciID='+id)
  }

  addDinamikDepoHucre(dinamikDepoHucre: DinamikDepoHucre): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/dinamikDepoHucres/', dinamikDepoHucre, { responseType: 'text' });
  }

  updateDinamikDepoHucre(dinamikDepoHucre: DinamikDepoHucre): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/dinamikDepoHucres/', dinamikDepoHucre, { responseType: 'text' });

  }

  deleteDinamikDepoHucre(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/dinamikDepoHucres/', { body: { kayitYapanKullaniciID: id } });
  }


}