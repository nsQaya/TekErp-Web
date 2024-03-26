import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AlertifyService } from "app/core/services/alertify.service";
import { LookUpService } from "app/core/services/lookUp.service";
import { AuthService } from "app/core/components/admin/login/services/auth.service";
import { StokKarti } from "./models/stokkarti";
import { StokKartiService } from "./services/stokkarti.service";
import { environment } from "environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { LookUp } from "app/core/models/LookUp";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { SAPKodService } from "../sAPKod/services/sapkod.service";
import { SAPKod } from "../sAPKod/models/sapkod";
import { Barkod } from "../barkod/models/barkod";
import { DinamikDepoHucre } from "../dinamikDepoHucre/models/DinamikDepoHucre";
import * as XLSX from 'xlsx';
import { StokKartiForGrid } from "./models/stokkartiforgrid";
declare var jQuery: any;

@Component({
  selector: "app-stokKarti",
  templateUrl: "./stokKarti.component.html",
  styleUrls: ["./stokKarti.component.scss"],
})
export class StokKartiComponent implements AfterViewInit, OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('closebutton') closebutton;

  

  // Kullanıcının seçtiği öğelerin ID'lerini içeren dizi
  selectedIds: number[] = [];
  hata: HttpErrorResponse;

  // Checkbox durumlarını tutan nesne
  checkboxStatus: { [key: number]: boolean } = {};

  // Checkbox durumunu güncelleyen fonksiyon

  displayedColumns: string[] = [
    "id",
    "kodu",
    "adi",
    "ingilizceIsim",
    "grupKodu",
    "olcuBr1",
    "sapKodlari",
    "update",
    "delete",
  ];

  stokKartiList: StokKarti[];
  stokKartiListForGrid:StokKartiForGrid[];
  stokKarti: StokKarti = new StokKarti();
  sAPKodList: any;

  stokKartiAddForm: FormGroup;

  grupKoduslookUp: LookUp[];
  kod1slookUp: LookUp[];
  kod2slookUp: LookUp[];
  kod3slookUp: LookUp[];
  kod4slookUp: LookUp[];
  kod5slookUp: LookUp[];
  dovizTipislookUp: LookUp[];
  olcuBrslookUp: LookUp[];
  sAPKodslookUp: SAPKod[];
  barkodslookUp: Barkod[];
  dinamikDepoHucreslookUp: DinamikDepoHucre[];

  stokKartiId: number;

  constructor(
    private stokKartiService: StokKartiService,
    private sAPKodService: SAPKodService,
    private lookupService: LookUpService,
    private alertifyService: AlertifyService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  ngAfterViewInit(): void {
    this.getStokKartiList();
    this.getStokKartiListForGrid();
  }

  ngOnInit() {
    this.lookupService.getGrupKoduLookup().subscribe((data) => {
      this.grupKoduslookUp = data;
    });
    this.lookupService.getKod1Lookup().subscribe((data) => {
      this.kod1slookUp = data;
    });
    this.lookupService.getKod2Lookup().subscribe((data) => {
      this.kod2slookUp = data;
    });
    this.lookupService.getKod3Lookup().subscribe((data) => {
      this.kod3slookUp = data;
    });
    this.lookupService.getKod4Lookup().subscribe((data) => {
      this.kod4slookUp = data;
    });
    this.lookupService.getKod5Lookup().subscribe((data) => {
      this.kod5slookUp = data;
    });
    this.lookupService.getDovizTipiLookup().subscribe((data) => {
      this.dovizTipislookUp = data;
    });
    this.lookupService.getOlcuBrLookup().subscribe((data) => {
      this.olcuBrslookUp = data;
    });
    this.lookupService.getDinamikDepoHucresLookup().subscribe((data) => {
      this.dinamikDepoHucreslookUp = data;
    });
    this.lookupService.getSAPKodsLookup().subscribe((data) => {
      this.sAPKodslookUp = data;
    });
    this.lookupService.getBarkodsLookup().subscribe((data) => {
      this.barkodslookUp = data;
    });

    this.createStokKartiAddForm();

    this.stokKartiAddForm
      .get("olcuBr1Id")
      ?.valueChanges.subscribe((selectedValue) => {
        this.stokKartiAddForm.get("olcuBr1IdBilgi")?.setValue(selectedValue);
        this.stokKartiAddForm.get("olcuBr1IdBilgi").disable(); // veya enable() metodunu kullanarak enable edebilirsiniz
      });
  }

  getStokKartiList() {
    this.stokKartiService.getStokKartiList().subscribe((data) => {
      this.stokKartiList = data;
      // this.dataSource = new MatTableDataSource(data);
      // this.configDataTable();
    });
  }

  getStokKartiListForGrid(){
    this.stokKartiService.getStokKartiListForGrid().subscribe((data) => {
      this.stokKartiListForGrid = data;
      this.dataSource = new MatTableDataSource(data);
      this.configDataTable();
    });

  }

  save() {
    if (this.stokKartiAddForm.valid) {
      this.stokKarti = Object.assign({}, this.stokKartiAddForm.value);

      if (this.stokKarti.id == 0) this.addStokKarti();
      else this.updateStokKarti();
    }
  }

  addStokKarti() {
    this.stokKartiService.addStokKarti(this.stokKarti).subscribe((data) => {
      this.getStokKartiList();
      this.getStokKartiListForGrid();
      this.stokKarti = new StokKarti();
      // jQuery('#stokkarti').modal('hide');
      this.alertifyService.success(data);
      this.clearFormGroup(this.stokKartiAddForm);
      this.closebutton.nativeElement.click();
    },
    (error) => {
      // this.hata=error.error;
      this.alertifyService.error(error.error);
    });
  }

  updateStokKarti() {
    this.stokKartiService.updateStokKarti(this.stokKarti).subscribe(
      (data) => {
        var index = this.stokKartiList.findIndex(
          (x) => x.id == this.stokKarti.id
        );
        this.stokKartiList[index] = this.stokKarti;
        // this.dataSource = new MatTableDataSource(this.stokKartiList); //Eklenen veri yerine tüm listeyi tekrar çek
        // this.configDataTable();

        this.stokKarti = new StokKarti();
        //jQuery('#stokkarti').modal('hide');
        this.alertifyService.success(data);
        this.getStokKartiListForGrid();
        this.clearFormGroup(this.stokKartiAddForm);
        this.closebutton.nativeElement.click();
      },
      (error) => {
        // this.hata=error.error;
        this.alertifyService.error(error.error);
      }
    );
  }

  createStokKartiAddForm() {
    this.stokKartiAddForm = this.formBuilder.group({
      id: [0],
      kodu: ["", Validators.required],
      adi: ["", Validators.required],
      ingilizceIsim: ["", Validators.required],
      grupKoduId: [0, Validators.required],
      kod1Id: [],
      kod2Id: [],
      kod3Id: [],
      kod4Id: [],
      kod5Id: [],
      olcuBr1Id: [0, Validators.required],
      olcuBr1IdBilgi: [{ value: 0, disabled: true }, Validators.required],
      olcuBr2Id: [],
      olcuBr2Pay: [1],
      olcuBr2Payda: [1],
      olcuBr3Id: [],
      olcuBr3Pay: [1],
      olcuBr3Payda: [1],
      alisDovizTipiId: [],
      satisDovizTipiId: [],
      alisFiyati: [0],
      satisFiyati: [0],
      alisKDVOrani: [0, Validators.required],
      satisKDVOrani: [0, Validators.required],
      seriTakibiVarMi: [false],
      en: [0],
      boy: [0],
      genislik: [0,],
      agirlik: [0,],
      asgariStokMiktari: [0,],
      azamiStokMiktari: [0,],
      minimumSiparisMiktari: [0,],
      sapKodlari: [],
      dinamikDepoOzets: [],
      barkodlar: [],
    });
  }

  deleteStokKarti(stokKartiId: number) {
    this.stokKartiService.deleteStokKarti(stokKartiId).subscribe((data) => {
      this.alertifyService.success(data.toString());
      this.stokKartiList = this.stokKartiList.filter(
        (x) => x.id != stokKartiId
      );

      this.getStokKartiListForGrid();

      // this.dataSource = new MatTableDataSource(this.stokKartiList);
      // this.configDataTable();
    },
    (error) => {
      // this.hata=error.error;
      this.alertifyService.error(error.error);
    });
  }

  getStokKartiById(stokKartiId: number) {
    this.clearFormGroup(this.stokKartiAddForm);
    this.stokKartiService.getStokDtoById(stokKartiId).subscribe((data) => {
      
      this.stokKartiAddForm.get('sapKodlari').setValue(this.sAPKodslookUp);
      this.stokKarti = data;
      this.stokKartiAddForm.patchValue(data);
    },
    (error) => {
      // this.hata=error.error;
      this.alertifyService.error(error.error);
    });
    this.barkodslookUp = this.barkodslookUp.filter(
      (barkod) => barkod.stokKartiID !== stokKartiId
    );
    this.stokKartiAddForm.get('barkodlar').setValue(this.barkodslookUp);
    this.sAPKodslookUp = this.sAPKodslookUp.filter(
      (s) => s.stokKartiID !== stokKartiId
    );
  }

  clearFormGroup(group: FormGroup) {
    group.markAsUntouched();
    group.reset();

    Object.keys(group.controls).forEach((key) => {
      group.get(key).setErrors(null);
      if (key == "id") group.get(key).setValue(0);
    });
    
  }

  checkClaim(claim: string): boolean {
    return this.authService.claimGuard(claim);
  }

  configDataTable(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ExportTOExcel() {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sayfa1');
    
    /* save to file */
    XLSX.writeFile(wb, 'StokList.xlsx');
  }
  StokBarkodYazdir() {
    console.log("Selected IDs:", this.selectedIds);

    this.stokKartiService.getBarkodPdfUrl(this.selectedIds).subscribe((barkodUrl) => {
      window.open(environment.getStokBarkodUrl+barkodUrl.url+".pdf", '_blank');
    },
    (error) => {
      this.alertifyService.error(error.error);
    });
  }
  updateCheckboxStatus(id: number, checked: boolean): void {
    this.checkboxStatus[id] = checked;
    // Checkbox seçildiyse, seçilenIds dizisine ekle
    if (checked) {
      this.selectedIds.push(id);
    } else {
      // Checkbox seçilmediyse, seçilenIds dizisinden çıkar
      this.selectedIds = this.selectedIds.filter(
        (selectedId) => selectedId !== id
      );
    }
  }

  addTagSAPKod(kod) {
    return { kod: kod };
  }

  addTagDinamikDepoHucre(kod) {
    return { hucreKodu: kod };
  }
  addTagBarkod(kod) {
    return { barkodu: kod };
  }
  getSapKodlari(sapKodlari: any[]): string {
    if (sapKodlari) {
      return sapKodlari.map(item => item.kod).join(', ');
    }
    return '';
  }
}
