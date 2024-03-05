import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/lookUp.service';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { DinamikDepoHucre } from './models/DinamikDepoHucre';
import { DinamikDepoHucreService } from './services/DinamikDepoHucre.service';
import { environment } from 'environments/environment';

declare var jQuery: any;

@Component({
	selector: 'app-dinamikDepoHucre',
	templateUrl: './dinamikDepoHucre.component.html',
	styleUrls: ['./dinamikDepoHucre.component.scss']
})
export class DinamikDepoHucreComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['kayitYapanKullaniciID','kayitTarihi','duzeltmeYapanKullaniciID','duzeltmeTarihi','aktifMi','id','hucreKodu', 'update','delete'];

	dinamikDepoHucreList:DinamikDepoHucre[];
	dinamikDepoHucre:DinamikDepoHucre=new DinamikDepoHucre();

	dinamikDepoHucreAddForm: FormGroup;


	dinamikDepoHucreId:number;

	constructor(private dinamikDepoHucreService:DinamikDepoHucreService, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        this.getDinamikDepoHucreList();
    }

	ngOnInit() {

		this.createDinamikDepoHucreAddForm();
	}


	getDinamikDepoHucreList() {
		this.dinamikDepoHucreService.getDinamikDepoHucreList().subscribe(data => {
			this.dinamikDepoHucreList = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}

	save(){

		if (this.dinamikDepoHucreAddForm.valid) {
			this.dinamikDepoHucre = Object.assign({}, this.dinamikDepoHucreAddForm.value)

			if (this.dinamikDepoHucre.kayitYapanKullaniciID == 0)
				this.addDinamikDepoHucre();
			else
				this.updateDinamikDepoHucre();
		}

	}

	addDinamikDepoHucre(){

		this.dinamikDepoHucreService.addDinamikDepoHucre(this.dinamikDepoHucre).subscribe(data => {
			this.getDinamikDepoHucreList();
			this.dinamikDepoHucre = new DinamikDepoHucre();
			jQuery('#dinamikdepohucre').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.dinamikDepoHucreAddForm);

		})

	}

	updateDinamikDepoHucre(){

		this.dinamikDepoHucreService.updateDinamikDepoHucre(this.dinamikDepoHucre).subscribe(data => {

			var index=this.dinamikDepoHucreList.findIndex(x=>x.kayitYapanKullaniciID==this.dinamikDepoHucre.kayitYapanKullaniciID);
			this.dinamikDepoHucreList[index]=this.dinamikDepoHucre;
			this.dataSource = new MatTableDataSource(this.dinamikDepoHucreList);
            this.configDataTable();
			this.dinamikDepoHucre = new DinamikDepoHucre();
			jQuery('#dinamikdepohucre').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.dinamikDepoHucreAddForm);

		})

	}

	createDinamikDepoHucreAddForm() {
		this.dinamikDepoHucreAddForm = this.formBuilder.group({		
			kayitYapanKullaniciID : [0],
kayitTarihi : [null, Validators.required],
duzeltmeYapanKullaniciID : [0, Validators.required],
duzeltmeTarihi : [null, Validators.required],
aktifMi : [false, Validators.required],
id : [0, Validators.required],
hucreKodu : ["", Validators.required]
		})
	}

	deleteDinamikDepoHucre(dinamikDepoHucreId:number){
		this.dinamikDepoHucreService.deleteDinamikDepoHucre(dinamikDepoHucreId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.dinamikDepoHucreList=this.dinamikDepoHucreList.filter(x=> x.kayitYapanKullaniciID!=dinamikDepoHucreId);
			this.dataSource = new MatTableDataSource(this.dinamikDepoHucreList);
			this.configDataTable();
		})
	}

	getDinamikDepoHucreById(dinamikDepoHucreId:number){
		this.clearFormGroup(this.dinamikDepoHucreAddForm);
		this.dinamikDepoHucreService.getDinamikDepoHucreById(dinamikDepoHucreId).subscribe(data=>{
			this.dinamikDepoHucre=data;
			this.dinamikDepoHucreAddForm.patchValue(data);
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
