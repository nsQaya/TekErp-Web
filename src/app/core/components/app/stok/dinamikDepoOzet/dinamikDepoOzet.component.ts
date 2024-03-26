import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/lookUp.service';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { DinamikDepoOzet } from './models/dinamikdepoozet';
import { DinamikDepoOzetService } from './services/dinamikdepoozet.service';
import { environment } from 'environments/environment';

declare var jQuery: any;

@Component({
	selector: 'app-dinamikDepoOzet',
	templateUrl: './dinamikDepoOzet.component.html',
	styleUrls: ['./dinamikDepoOzet.component.scss']
})
export class DinamikDepoOzetComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['kayitYapanKullaniciID','kayitTarihi','duzeltmeYapanKullaniciID','duzeltmeTarihi','aktifMi','id','stokKartiID','hucreID','miktar', 'update','delete'];

	dinamikDepoOzetList:DinamikDepoOzet[];
	dinamikDepoOzet:DinamikDepoOzet=new DinamikDepoOzet();

	dinamikDepoOzetAddForm: FormGroup;


	dinamikDepoOzetId:number;

	constructor(private dinamikDepoOzetService:DinamikDepoOzetService, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        this.getDinamikDepoOzetList();
    }

	ngOnInit() {

		this.createDinamikDepoOzetAddForm();
	}


	getDinamikDepoOzetList() {
		this.dinamikDepoOzetService.getDinamikDepoOzetList().subscribe(data => {
			this.dinamikDepoOzetList = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}

	save(){

		if (this.dinamikDepoOzetAddForm.valid) {
			this.dinamikDepoOzet = Object.assign({}, this.dinamikDepoOzetAddForm.value)

			if (this.dinamikDepoOzet.kayitYapanKullaniciID == 0)
				this.addDinamikDepoOzet();
			else
				this.updateDinamikDepoOzet();
		}

	}

	addDinamikDepoOzet(){

		this.dinamikDepoOzetService.addDinamikDepoOzet(this.dinamikDepoOzet).subscribe(data => {
			this.getDinamikDepoOzetList();
			this.dinamikDepoOzet = new DinamikDepoOzet();
			jQuery('#dinamikdepoozet').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.dinamikDepoOzetAddForm);

		})

	}

	updateDinamikDepoOzet(){

		this.dinamikDepoOzetService.updateDinamikDepoOzet(this.dinamikDepoOzet).subscribe(data => {

			var index=this.dinamikDepoOzetList.findIndex(x=>x.kayitYapanKullaniciID==this.dinamikDepoOzet.kayitYapanKullaniciID);
			this.dinamikDepoOzetList[index]=this.dinamikDepoOzet;
			this.dataSource = new MatTableDataSource(this.dinamikDepoOzetList);
            this.configDataTable();
			this.dinamikDepoOzet = new DinamikDepoOzet();
			jQuery('#dinamikdepoozet').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.dinamikDepoOzetAddForm);

		})

	}

	createDinamikDepoOzetAddForm() {
		this.dinamikDepoOzetAddForm = this.formBuilder.group({		
			kayitYapanKullaniciID : [0],
kayitTarihi : [null, Validators.required],
duzeltmeYapanKullaniciID : [0, Validators.required],
duzeltmeTarihi : [null, Validators.required],
aktifMi : [false, Validators.required],
id : [0, Validators.required],
stokKartiID : [0, Validators.required],
hucreID : [0, Validators.required],
miktar : [0, Validators.required]
		})
	}

	deleteDinamikDepoOzet(dinamikDepoOzetId:number){
		this.dinamikDepoOzetService.deleteDinamikDepoOzet(dinamikDepoOzetId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.dinamikDepoOzetList=this.dinamikDepoOzetList.filter(x=> x.kayitYapanKullaniciID!=dinamikDepoOzetId);
			this.dataSource = new MatTableDataSource(this.dinamikDepoOzetList);
			this.configDataTable();
		})
	}

	getDinamikDepoOzetById(dinamikDepoOzetId:number){
		this.clearFormGroup(this.dinamikDepoOzetAddForm);
		this.dinamikDepoOzetService.getDinamikDepoOzetById(dinamikDepoOzetId).subscribe(data=>{
			this.dinamikDepoOzet=data;
			this.dinamikDepoOzetAddForm.patchValue(data);
		})
	}


	clearFormGroup(group: FormGroup) {

		group.markAsUntouched();
		group.reset();

		Object.keys(group.controls).forEach(key => {
			group.get(key).setErrors(null);
			if (key == 'kayitYapanKullaniciID')
				group.get(key).setValue(0);
		});
	}

	checkClaim(claim:string):boolean{
		return this.authService.claimGuard(claim)
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
