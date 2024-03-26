import { Component, AfterViewInit, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AlertifyService } from "app/core/services/alertify.service";
import { LookUpService } from "app/core/services/lookUp.service";
import { AuthService } from "app/core/components/admin/login/services/auth.service";
import { OlcuBr } from "./models/olcubr";
import { OlcuBrService } from "./services/olcubr.service";
import { environment } from "environments/environment";

declare var jQuery: any;

@Component({
  selector: "app-olcuBr",
  templateUrl: "./olcuBr.component.html",
  styleUrls: ["./olcuBr.component.scss"],
})
export class OlcuBrComponent implements AfterViewInit, OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ["id", "adi", "simge", "update", "delete"];

  olcuBrList: OlcuBr[];
  olcuBr: OlcuBr = new OlcuBr();

  olcuBrAddForm: FormGroup;

  olcuBrId: number;

  constructor(
    private olcuBrService: OlcuBrService,
    private lookupService: LookUpService,
    private alertifyService: AlertifyService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngAfterViewInit(): void {
    this.getOlcuBrList();
  }

  ngOnInit() {
    this.createOlcuBrAddForm();
  }

  getOlcuBrList() {
    this.olcuBrService.getOlcuBrList().subscribe((data) => {
      this.olcuBrList = data;
      this.dataSource = new MatTableDataSource(data);
      this.configDataTable();
    });
  }

  save() {
    if (this.olcuBrAddForm.valid) {
      this.olcuBr = Object.assign({}, this.olcuBrAddForm.value);

      if (this.olcuBr.id == 0) this.addOlcuBr();
      else this.updateOlcuBr();
    }
  }

  addOlcuBr() {
    this.olcuBrService.addOlcuBr(this.olcuBr).subscribe(
      (data) => {
        this.getOlcuBrList();
        this.olcuBr = new OlcuBr();
        jQuery("#olcubr").modal("hide");
        this.alertifyService.success(data);
        this.clearFormGroup(this.olcuBrAddForm);
      },
      (error) => {
        // this.hata=error.error;
        this.alertifyService.error(error.error);
      }
    );
  }

  updateOlcuBr() {
    this.olcuBrService.updateOlcuBr(this.olcuBr).subscribe(
      (data) => {
        var index = this.olcuBrList.findIndex((x) => x.id == this.olcuBr.id);
        this.olcuBrList[index] = this.olcuBr;
        this.dataSource = new MatTableDataSource(this.olcuBrList);
        this.configDataTable();
        this.olcuBr = new OlcuBr();
        jQuery("#olcubr").modal("hide");
        this.alertifyService.success(data);
        this.clearFormGroup(this.olcuBrAddForm);
      },
      (error) => {
        // this.hata=error.error;
        this.alertifyService.error(error.error);
      }
    );
  }

  createOlcuBrAddForm() {
    this.olcuBrAddForm = this.formBuilder.group({
      id: [0],
      adi: ["", Validators.required],
      simge: ["", Validators.required],
    });
  }

  deleteOlcuBr(olcuBrId: number) {
    this.olcuBrService.deleteOlcuBr(olcuBrId).subscribe(
      (data) => {
        this.alertifyService.success(data.toString());
        this.olcuBrList = this.olcuBrList.filter((x) => x.id != olcuBrId);
        this.dataSource = new MatTableDataSource(this.olcuBrList);
        this.configDataTable();
      },
      (error) => {
        // this.hata=error.error;
        this.alertifyService.error(error.error);
      }
    );
  }

  getOlcuBrById(olcuBrId: number) {
    this.clearFormGroup(this.olcuBrAddForm);
    this.olcuBrService.getOlcuBrById(olcuBrId).subscribe(
      (data) => {
        this.olcuBr = data;
        this.olcuBrAddForm.patchValue(data);
      },
      (error) => {
        // this.hata=error.error;
        this.alertifyService.error(error.error);
      }
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
}
