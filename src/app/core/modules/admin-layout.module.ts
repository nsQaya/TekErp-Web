import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from '../components/app/layouts/admin-layout/admin-layout.routing';
import { DashboardComponent } from '../components/app/dashboard/dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LoginComponent } from 'app/core/components/admin/login/login.component';
import { GroupComponent } from 'app/core/components/admin/group/group.component';
import { UserComponent } from 'app/core/components/admin/user/user.component';
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslationService } from 'app/core/services/translation.service';
import { LanguageComponent } from '../components/admin/language/language.component';
import { TranslateComponent } from '../components/admin/translate/translate.component';
import { OperationClaimComponent } from '../components/admin/operationclaim/operationClaim.component';
import { LogDtoComponent } from '../components/admin/log/logDto.component';
import { MatSortModule } from '@angular/material/sort';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Kod1Component } from '../components/app/stok/kod1/kod1.component';
import { Kod2Component } from '../components/app/stok/kod2/kod2.component';
import { Kod3Component } from '../components/app/stok/kod3/kod3.component';
import { Kod4Component } from '../components/app/stok/kod4/kod4.component';
import { Kod5Component } from '../components/app/stok/kod5/kod5.component';
import { BarkodComponent } from '../components/app/stok/barkod/barkod.component';
import { DovizTipiComponent } from '../components/app/stok/dovizTipi/dovizTipi.component';
import { GrupKoduComponent } from '../components/app/stok/grupKodu/grupKodu.component';
import { OlcuBrComponent } from '../components/app/stok/olcuBr/olcuBr.component';
import { StokKartiComponent } from '../components/app/stok/stokKarti/stokKarti.component';
import { SAPKodComponent } from '../components/app/stok/sAPKod/sAPKod.component';
import { NgSelectModule } from '@ng-select/ng-select';



// export function layoutHttpLoaderFactory(http: HttpClient) {
// 
//   return new TranslateHttpLoader(http,'../../../../../../assets/i18n/','.json');
// }

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCheckboxModule,
        NgbModule,
        NgSelectModule,
        NgMultiSelectDropDownModule,
        SweetAlert2Module,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                //useFactory:layoutHttpLoaderFactory,
                useClass: TranslationService,
                deps: [HttpClient]
            }
        })
    ],
    declarations: [
        DashboardComponent,
        UserComponent,
        LoginComponent,
        GroupComponent,
        LanguageComponent,
        TranslateComponent,
        OperationClaimComponent,
        LogDtoComponent,
        GrupKoduComponent,
        Kod1Component,
        Kod2Component,
        Kod3Component,
        Kod4Component,
        Kod5Component,
        BarkodComponent,
        DovizTipiComponent,
        OlcuBrComponent,
        SAPKodComponent,
        StokKartiComponent,

    ]
})

export class AdminLayoutModule { }
