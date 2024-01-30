import { Routes } from '@angular/router';
import { GroupComponent } from 'app/core/components/admin/group/group.component';
import { LanguageComponent } from 'app/core/components/admin/language/language.component';
import { LogDtoComponent } from 'app/core/components/admin/log/logDto.component';
import { LoginComponent } from 'app/core/components/admin/login/login.component';
import { OperationClaimComponent } from 'app/core/components/admin/operationclaim/operationClaim.component';
import { TranslateComponent } from 'app/core/components/admin/translate/translate.component';
import { UserComponent } from 'app/core/components/admin/user/user.component';
import { LoginGuard } from 'app/core/guards/login-guard';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { Kod1Component } from '../../stok/kod1/kod1.component';
import { DovizTipiComponent } from '../../stok/dovizTipi/dovizTipi.component';
import { GrupKoduComponent } from '../../stok/grupKodu/grupKodu.component';
import { Kod2Component } from '../../stok/kod2/kod2.component';
import { Kod3Component } from '../../stok/kod3/kod3.component';
import { Kod4Component } from '../../stok/kod4/kod4.component';
import { Kod5Component } from '../../stok/kod5/kod5.component';
import { BarkodComponent } from '../../stok/barkod/barkod.component';
import { StokKartiComponent } from '../../stok/stokKarti/stokKarti.component';
import { SAPKodComponent } from '../../stok/sAPKod/sAPKod.component';
import { OlcuBrComponent } from '../../stok/olcuBr/olcuBr.component';





export const AdminLayoutRoutes: Routes = [

    { path: 'dashboard',      component: DashboardComponent,canActivate:[LoginGuard] }, 
    { path: 'user',           component: UserComponent, canActivate:[LoginGuard] },
    { path: 'group',          component: GroupComponent, canActivate:[LoginGuard] },
    { path: 'login',          component: LoginComponent },
    { path: 'language',       component: LanguageComponent,canActivate:[LoginGuard]},
    { path: 'translate',      component: TranslateComponent,canActivate:[LoginGuard]},
    { path: 'operationclaim', component: OperationClaimComponent,canActivate:[LoginGuard]},
    { path: 'log',            component: LogDtoComponent,canActivate:[LoginGuard]},
    { path: 'dovizTipi',      component: DovizTipiComponent,canActivate:[LoginGuard]},

    { path: 'grupKodu',       component: GrupKoduComponent,canActivate:[LoginGuard]},
    { path: 'kod1',           component: Kod1Component,canActivate:[LoginGuard]},
    { path: 'kod2',           component: Kod2Component,canActivate:[LoginGuard]},
    { path: 'kod3',           component: Kod3Component,canActivate:[LoginGuard]},
    { path: 'kod4',           component: Kod4Component,canActivate:[LoginGuard]},
    { path: 'kod5',           component: Kod5Component,canActivate:[LoginGuard]},

    { path: 'barkod',         component: BarkodComponent,canActivate:[LoginGuard]},
    { path: 'olcuBirim',      component: OlcuBrComponent,canActivate:[LoginGuard]},
    { path: 'sAPKod',         component: SAPKodComponent,canActivate:[LoginGuard]},
    { path: 'stokKarti',      component: StokKartiComponent,canActivate:[LoginGuard]}

];
