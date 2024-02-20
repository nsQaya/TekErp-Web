import { HttpClient } from '@angular/common/http';
import {  Component,  NgModule,  OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LookUp } from 'app/core/models/LookUp';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { LookUpService } from 'app/core/services/lookUp.service';
import { environment } from 'environments/environment';
import { LoginUser } from './model/login-user';
import { AuthService } from './Services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select/ng-select-ng-select';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit  {

  selectedCity: any;

  selectedCars = [3];
  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab', disabled: true },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
];

cities = [
  {id: 1, name: 'Vilnius'},
  {id: 2, name: 'Kaunas'},
  {id: 3, name: 'Pavilnys', disabled: true},
  {id: 4, name: 'Pabradė'},
  {id: 5, name: 'Klaipėda'}
];
  
  username:string="";
  loginUser:LoginUser=new LoginUser();
  langugelookUp:LookUp[];


  constructor(private auth:AuthService,
    private storageService:LocalStorageService,
    private lookupService:LookUpService,
    public translateService:TranslateService,
    private httpClient:HttpClient) { }

   

  ngOnInit() {

    this.username=this.auth.userName;
    this.httpClient.get<LookUp[]>(environment.getApiUrl +"/languages/codes").subscribe(data=>{
      this.langugelookUp=data;
    })
    
  }

  getUserName(){
    return this.username;
  }

  login(){
    this.auth.login(this.loginUser);
  }

  logOut(){
      this.storageService.removeToken();
      this.storageService.removeItem("lang");
  }

  changeLang(lang){  
    localStorage.setItem("lang",lang);
    this.translateService.use(lang);
  }

}
