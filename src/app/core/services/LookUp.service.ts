import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { LookUp } from '../models/LookUp';
import { Barkod } from '../components/app/stok/barkod/models/barkod';
import { SAPKod } from '../components/app/stok/sAPKod/models/sapkod';
import { DinamikDepoHucre } from '../components/app/stok/dinamikDepoHucre/models/DinamikDepoHucre';


@Injectable({
  providedIn: 'root'
})
export class LookUpService {

  constructor(private httpClient: HttpClient) { }

  getGroupLookUp(): Observable<LookUp[]> {

    return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/groups/lookups")
  }

  getOperationClaimLookUp(): Observable<LookUp[]> {

    return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/operation-claims/lookups")
  }

  getUserLookUp():Observable<LookUp[]>{
    return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/users/lookups")
  }

  getLanguageLookup():Observable<LookUp[]>{
    return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/languages/lookups")
  }

  getGrupKoduLookup():Observable<LookUp[]>{
    return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/grupkodus/lookups")
  }

  getKod1Lookup():Observable<LookUp[]>{
    return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/kod1s/lookups")
  }

  getKod2Lookup():Observable<LookUp[]>{
    return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/kod2s/lookups")
  }

  getKod3Lookup():Observable<LookUp[]>{
    return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/kod3s/lookups")
  }

  getKod4Lookup():Observable<LookUp[]>{
    return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/kod4s/lookups")
  }

  getKod5Lookup():Observable<LookUp[]>{
    return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/kod5s/lookups")
  }

  getDovizTipiLookup():Observable<LookUp[]>{
    return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/doviztipis/lookups")
  }

  getOlcuBrLookup():Observable<LookUp[]>{
    return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/olcubrs/lookups")
  }

  getSAPKodsLookup():Observable<SAPKod[]>{
    return this.httpClient.get<SAPKod[]>(environment.getApiUrl + "/SAPKods/lookups")
  }

  getDinamikDepoHucresLookup():Observable<DinamikDepoHucre[]>{
    return this.httpClient.get<DinamikDepoHucre[]>(environment.getApiUrl + "/DinamikDepoHucres/lookups")
  }

  getBarkodsLookup():Observable<Barkod[]>{
    return this.httpClient.get<Barkod[]>(environment.getApiUrl + "/Barkods/lookups")
  }

}
