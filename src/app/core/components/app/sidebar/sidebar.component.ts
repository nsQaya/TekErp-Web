import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../admin/login/services/auth.service';



declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    claim:string;
}
export const ADMINROUTES: RouteInfo[] = [
  { path: '/user', title: 'Users', icon: 'how_to_reg', class: '', claim:"GetUsersQuery" },
  { path: '/group', title: 'Groups', icon:'groups', class: '',claim:"GetGroupsQuery" },
  { path: '/operationclaim', title: 'OperationClaim', icon:'local_police', class: '', claim:"GetOperationClaimsQuery"},
  { path: '/language', title: 'Languages', icon:'language', class: '', claim:"GetLanguagesQuery" },
  { path: '/translate', title: 'TranslateWords', icon: 'translate', class: '', claim: "GetTranslatesQuery" },
  { path: '/log', title: 'Logs', icon: 'update', class: '', claim: "GetLogDtoQuery" },
  { path: '/dovizTipi', title: 'DovizTipi', icon: 'update', class: '', claim: "GetDovizTipisQuery" }
];

export const USERROUTES: RouteInfo[] = [ 
   { path: '/stokKarti', title: 'StokKarti', icon: 'update', class: '', claim: "GetStokKartisQuery" },
  // { path: '/grupKodu', title: 'GrupKodu', icon: 'update', class: '', claim: "GetGroupsQuery" },
  // { path: '/kod1', title: 'Kod1', icon: 'update', class: '', claim: "GetKod1sQuery" },
  // { path: '/kod2', title: 'Kod2', icon: 'update', class: '', claim: "GetKod2sQuery" },
  // { path: '/kod3', title: 'Kod3', icon: 'update', class: '', claim: "GetKod3sQuery" },
  // { path: '/kod4', title: 'Kod4', icon: 'update', class: '', claim: "GetKod4sQuery" },
  // { path: '/kod5', title: 'Kod5', icon: 'update', class: '', claim: "GetKod5sQuery" },
  // { path: '/sAPKod', title: 'SAPKOD', icon: 'update', class: '', claim: "GetSAPKodsQuery" },
  // { path: '/barkod', title: 'Barkod', icon: 'update', class: '', claim: "GetBarkodQuery" },

];
export const STOKROUTES: RouteInfo[] = [ 
  { path: '/stokKarti', title: 'StokKarti', icon: 'update', class: '', claim: "GetStokKartisQuery" },
  { path: '/grupKodu', title: 'GrupKodu', icon: 'update', class: '', claim: "GetGroupsQuery" },
  { path: '/kod1', title: 'Kod1', icon: 'update', class: '', claim: "GetKod1sQuery" },
  { path: '/kod2', title: 'Kod2', icon: 'update', class: '', claim: "GetKod2sQuery" },
  { path: '/kod3', title: 'Kod3', icon: 'update', class: '', claim: "GetKod3sQuery" },
  { path: '/kod4', title: 'Kod4', icon: 'update', class: '', claim: "GetKod4sQuery" },
  { path: '/kod5', title: 'Kod5', icon: 'update', class: '', claim: "GetKod5sQuery" },
  { path: '/sAPKod', title: 'SAPKOD', icon: 'update', class: '', claim: "GetSAPKodsQuery" },
  { path: '/barkod', title: 'Barkod', icon: 'update', class: '', claim: "GetBarkodQuery" },
  { path: '/olcuBr', title: 'OlcuBr', icon: 'update', class: '', claim: "GetOlcuBrQuery" },
  { path: '/dinamikDepoHucre', title: 'Hucre', icon: 'update', class: '', claim: "GetDinamikDepoHucreQuery" },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  adminMenuItems: any[];
  userMenuItems: any[];
  stokMenuItems:any[];

  constructor(private router:Router, private authService:AuthService,public translateService:TranslateService) {
    
  }

  ngOnInit() {
  
    this.adminMenuItems = ADMINROUTES.filter(menuItem => menuItem);
    this.userMenuItems = USERROUTES.filter(menuItem => menuItem);
    this.stokMenuItems = STOKROUTES.filter(menuItem => menuItem);

    var lang=localStorage.getItem('lang') || 'tr-TR'
    this.translateService.use(lang);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  checkClaim(claim:string):boolean{
    return this.authService.claimGuard(claim)
  }
  ngOnDestroy() {
    if (!this.authService.loggedIn()) {
      this.authService.logOut();
      this.router.navigateByUrl("/login");
    }
  } 
 }

