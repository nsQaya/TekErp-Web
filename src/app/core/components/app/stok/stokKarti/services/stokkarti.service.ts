import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StokKarti } from '../models/stokkarti';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StokKartiService {

  constructor(private httpClient: HttpClient) { }


  getStokKartiList(): Observable<StokKarti[]> {

    return this.httpClient.get<StokKarti[]>(environment.getApiUrl + '/stokKartis/getall')
  }

  getStokKartiById(id: number): Observable<StokKarti> {
    return this.httpClient.get<StokKarti>(environment.getApiUrl + '/stokKartis/getbyid?id='+id)
  }

  getStokDtoById(id: number): Observable<StokKarti> {
    return this.httpClient.get<StokKarti>(environment.getApiUrl + '/stokKartis/getstokdtobyid?id='+id)
  }

  addStokKarti(stokKarti: StokKarti): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/stokKartis/', stokKarti, { responseType: 'text' });
  }

  updateStokKarti(stokKarti: StokKarti): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/stokKartis/', stokKarti, { responseType: 'text' });

  }

  deleteStokKarti(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/stokKartis/', { body: { id: id } });
  }


}