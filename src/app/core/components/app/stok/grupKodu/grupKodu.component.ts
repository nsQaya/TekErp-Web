import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/lookUp.service';
import { AuthService } from 'app/core/components/admin/login/Services/auth.service';
import { GrupKodu } from './models/grupkodu';
import { GrupKoduService } from './services/grupkodu.service';
import { environment } from 'environments/environment';

declare var jQuery: any;

@Component({
	selector: 'app-grupKodu',
	templateUrl: './grupKodu.component.html',
	styleUrls: ['./grupKodu.component.scss']
})
export class GrupKoduComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','kodu','adi', 'update','delete'];

	grupKoduList:GrupKodu[];
	grupKodu:GrupKodu=new GrupKodu();

	grupKoduAddForm: FormGroup;


	grupKoduId:number;

	constructor(private grupKoduService:GrupKoduService, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        this.getGrupKoduList();
    }

	ngOnInit() {

		this.createGrupKoduAddForm();
	}


	getGrupKoduList() {
		this.grupKoduService.getGrupKoduList().subscribe(data => {
			this.grupKoduList = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}

	save(){

		if (this.grupKoduAddForm.valid) {
			this.grupKodu = Object.assign({}, this.grupKoduAddForm.value)

			if (this.grupKodu.id == 0)
				this.addGrupKodu();
			else
				this.updateGrupKodu();
		}

	}

	addGrupKodu(){

		this.grupKoduService.addGrupKodu(this.grupKodu).subscribe(data => {
			this.getGrupKoduList();
			this.grupKodu = new GrupKodu();
			jQuery('#grupkodu').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.grupKoduAddForm);

		})

	}

	updateGrupKodu(){

		this.grupKoduService.updateGrupKodu(this.grupKodu).subscribe(data => {

			var index=this.grupKoduList.findIndex(x=>x.id==this.grupKodu.id);
			this.grupKoduList[index]=this.grupKodu;
			this.dataSource = new MatTableDataSource(this.grupKoduList);
            this.configDataTable();
			this.grupKodu = new GrupKodu();
			jQuery('#grupkodu').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.grupKoduAddForm);

		})

	}

	createGrupKoduAddForm() {
		this.grupKoduAddForm = this.formBuilder.group({		
			id : [0],
kodu : ["", Validators.required],
adi : ["", Validators.required]
		})
	}

	deleteGrupKodu(grupKoduId:number){
		this.grupKoduService.deleteGrupKodu(grupKoduId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.grupKoduList=this.grupKoduList.filter(x=> x.id!=grupKoduId);
			this.dataSource = new MatTableDataSource(this.grupKoduList);
			this.configDataTable();
		})
	}

	getGrupKoduById(grupKoduId:number){
		this.clearFormGroup(this.grupKoduAddForm);
		this.grupKoduService.getGrupKoduById(grupKoduId).subscribe(data=>{
			this.grupKodu=data;
			this.grupKoduAddForm.patchValue(data);
		})
	}


	clearFormGroup(group: FormGroup) {

		group.markAsUntouched();
		group.reset();

		Object.keys(group.controls).forEach(key => {
			group.get(key).setErrors(null);
			if (key == 'id')
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
