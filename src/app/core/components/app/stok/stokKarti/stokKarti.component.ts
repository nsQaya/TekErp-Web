import { Component, AfterViewInit, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AlertifyService } from "app/core/services/alertify.service";
import { LookUpService } from "app/core/services/lookUp.service";
import { AuthService } from "app/core/components/admin/login/Services/auth.service";
import { StokKarti } from "./models/stokkarti";
import { StokKartiService } from "./services/stokkarti.service";
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { LookUp } from "app/core/models/LookUp";


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
    // Kullanıcının seçtiği öğelerin ID'lerini içeren dizi
    selectedIds: number[] = [];

    // Checkbox durumlarını tutan nesne
    checkboxStatus: { [key: number]: boolean } = {};
  
    // Checkbox durumunu güncelleyen fonksiyon
    
  displayedColumns: string[] = [
    "id",
    "kodu",
    "adi",
    "ingilizceIsim",
    "grupKoduId",
    "kod1Id",
    "kod2Id",
    "kod3Id",
    "kod4Id",
    "kod5Id",
    "olcuBr1Id",
    "olcuBr2Id",
    "olcuBr2Pay",
    "olcuBr2Payda",
    "olcuBr3Id",
    "olcuBr3Pay",
    "olcuBr3Payda",
    "alisDovizTipiId",
    "satisDovizTipiId",
    "alisFiyati",
    "satisFiyati",
    "alisKDVOrani",
    "satisKDVOrani",
    "seriTakibiVarMi",
    "en",
    "boy",
    "genislik",
    "agirlik",
    "asgariStokMiktari",
    "azamiStokMiktari",
    "minimumSiparisMiktari",
    "update",
    "delete",
  ];

  stokKartiList: StokKarti[];
  stokKarti: StokKarti = new StokKarti();

  stokKartiAddForm: FormGroup;

  grupKoduslookUp: LookUp[];
  kod1slookUp: LookUp[];
  kod2slookUp: LookUp[];
  Kod3slookUp: LookUp[];
  Kod4slookUp: LookUp[];
  Kod5slookUp: LookUp[];
  dovizTipislookUp: LookUp[];
  OlcuBrslookUp: LookUp[];

  stokKartiId: number;

  constructor(
    private stokKartiService: StokKartiService,
    private lookupService: LookUpService,
    private alertifyService: AlertifyService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  ngAfterViewInit(): void {
    this.getStokKartiList();
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
      this.Kod3slookUp = data;
    });
    this.lookupService.getKod4Lookup().subscribe((data) => {
      this.Kod4slookUp = data;
    });
    this.lookupService.getKod5Lookup().subscribe((data) => {
      this.Kod5slookUp = data;
    });
    this.lookupService.getDovizTipiLookup().subscribe((data) => {
      this.dovizTipislookUp = data;
    });
    this.lookupService.getOlcuBrLookup().subscribe((data) => {
      this.OlcuBrslookUp = data;
    });

    this.createStokKartiAddForm();
  }

  getStokKartiList() {
    this.stokKartiService.getStokKartiList().subscribe((data) => {
      this.stokKartiList = data;
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
      this.stokKarti = new StokKarti();
      jQuery("#stokkarti").modal("hide");
      this.alertifyService.success(data);
      this.clearFormGroup(this.stokKartiAddForm);
    });
  }

  updateStokKarti() {
    this.stokKartiService.updateStokKarti(this.stokKarti).subscribe((data) => {
      var index = this.stokKartiList.findIndex(
        (x) => x.id == this.stokKarti.id
      );
      this.stokKartiList[index] = this.stokKarti;
      this.dataSource = new MatTableDataSource(this.stokKartiList);
      this.configDataTable();
      this.stokKarti = new StokKarti();
      jQuery("#stokkarti").modal("hide");
      this.alertifyService.success(data);
      this.clearFormGroup(this.stokKartiAddForm);
    });
  }

  createStokKartiAddForm() {
    this.stokKartiAddForm = this.formBuilder.group({
      id: [0],
      kodu: ["", Validators.required],
      adi: ["", Validators.required],
      ingilizceIsim: ["", Validators.required],
      grupKoduId: [0, Validators.required],
      kod1Id: [0, Validators.required],
      kod2Id: [0, Validators.required],
      kod3Id: [0, Validators.required],
      kod4Id: [0, Validators.required],
      kod5Id: [0, Validators.required],
      olcuBr1Id: [0, Validators.required],
      olcuBr2Id: [0, Validators.required],
      olcuBr2Pay: [0, Validators.required],
      olcuBr2Payda: [0, Validators.required],
      olcuBr3Id: [0, Validators.required],
      olcuBr3Pay: [0, Validators.required],
      olcuBr3Payda: [0, Validators.required],
      alisDovizTipiId: [0, Validators.required],
      satisDovizTipiId: [0, Validators.required],
      alisFiyati: [0, Validators.required],
      satisFiyati: [0, Validators.required],
      alisKDVOrani: [0, Validators.required],
      satisKDVOrani: [0, Validators.required],
      seriTakibiVarMi: [false, Validators.required],
      en: [0, Validators.required],
      boy: [0, Validators.required],
      genislik: [0, Validators.required],
      agirlik: [0, Validators.required],
      asgariStokMiktari: [0, Validators.required],
      azamiStokMiktari: [0, Validators.required],
      minimumSiparisMiktari: [0, Validators.required],
    });
  }

  deleteStokKarti(stokKartiId: number) {
    this.stokKartiService.deleteStokKarti(stokKartiId).subscribe((data) => {
      this.alertifyService.success(data.toString());
      this.stokKartiList = this.stokKartiList.filter(
        (x) => x.id != stokKartiId
      );
      this.dataSource = new MatTableDataSource(this.stokKartiList);
      this.configDataTable();
    });
  }

  getStokKartiById(stokKartiId: number) {
    this.clearFormGroup(this.stokKartiAddForm);
    this.stokKartiService.getStokKartiById(stokKartiId).subscribe((data) => {
      this.stokKarti = data;
      this.stokKartiAddForm.patchValue(data);
    });
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
  ExportTOExcel()
  {

  }
  StokBarkodYazdir()
  {
    console.log('Selected IDs:', this.selectedIds);

  }
  updateCheckboxStatus(id: number, checked: boolean): void {
    this.checkboxStatus[id] = checked;

    // Checkbox seçildiyse, seçilenIds dizisine ekle
    if (checked) {
      this.selectedIds.push(id);
    } else { // Checkbox seçilmediyse, seçilenIds dizisinden çıkar
      this.selectedIds = this.selectedIds.filter(selectedId => selectedId !== id);
    }

  }
}
