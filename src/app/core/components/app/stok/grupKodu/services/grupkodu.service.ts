import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GrupKodu } from '../models/GrupKodu';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GrupKoduService {

  constructor(private httpClient: HttpClient) { }


  getGrupKoduList(): Observable<GrupKodu[]> {

    return this.httpClient.get<GrupKodu[]>(environment.getApiUrl + '/grupKodus/getall')
  }

  getGrupKoduById(id: number): Observable<GrupKodu> {
    return this.httpClient.get<GrupKodu>(environment.getApiUrl + '/grupKodus/getbyid?id='+id)
  }

  addGrupKodu(grupKodu: GrupKodu): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/grupKodus/', grupKodu, { responseType: 'text' });
  }

  updateGrupKodu(grupKodu: GrupKodu): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/grupKodus/', grupKodu, { responseType: 'text' });

  }

  deleteGrupKodu(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/grupKodus/', { body: { id: id } });
  }


}