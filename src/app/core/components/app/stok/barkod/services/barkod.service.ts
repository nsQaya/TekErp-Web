import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Barkod } from '../models/Barkod';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BarkodService {

  constructor(private httpClient: HttpClient) { }


  getBarkodList(): Observable<Barkod[]> {

    return this.httpClient.get<Barkod[]>(environment.getApiUrl + '/barkods/getall')
  }

  getBarkodById(id: number): Observable<Barkod> {
    return this.httpClient.get<Barkod>(environment.getApiUrl + '/barkods/getbyid?id='+id)
  }

  addBarkod(barkod: Barkod): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/barkods/', barkod, { responseType: 'text' });
  }

  updateBarkod(barkod: Barkod): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/barkods/', barkod, { responseType: 'text' });

  }

  deleteBarkod(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/barkods/', { body: { id: id } });
  }


}