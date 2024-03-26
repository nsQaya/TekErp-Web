import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/lookUp.service';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { DovizTipi } from './models/doviztipi';
import { DovizTipiService } from './services/doviztipi.service';
import { environment } from 'environments/environment';

declare var jQuery: any;

@Component({
	selector: 'app-dovizTipi',
	templateUrl: './dovizTipi.component.html',
	styleUrls: ['./dovizTipi.component.scss']
})
export class DovizTipiComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','kodu','adi','simge','tCMMId', 'update','delete'];

	dovizTipiList:DovizTipi[];
	dovizTipi:DovizTipi=new DovizTipi();

	dovizTipiAddForm: FormGroup;


	dovizTipiId:number;

	constructor(private dovizTipiService:DovizTipiService, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        this.getDovizTipiList();
    }

	ngOnInit() {

		this.createDovizTipiAddForm();
	}


	getDovizTipiList() {
		this.dovizTipiService.getDovizTipiList().subscribe(data => {
			this.dovizTipiList = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}

	save(){

		if (this.dovizTipiAddForm.valid) {
			this.dovizTipi = Object.assign({}, this.dovizTipiAddForm.value)

			if (this.dovizTipi.id == 0)
				this.addDovizTipi();
			else
				this.updateDovizTipi();
		}

	}

	addDovizTipi(){

		this.dovizTipiService.addDovizTipi(this.dovizTipi).subscribe(data => {
			this.getDovizTipiList();
			this.dovizTipi = new DovizTipi();
			jQuery('#doviztipi').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.dovizTipiAddForm);

		})

	}

	updateDovizTipi(){

		this.dovizTipiService.updateDovizTipi(this.dovizTipi).subscribe(data => {

			var index=this.dovizTipiList.findIndex(x=>x.id==this.dovizTipi.id);
			this.dovizTipiList[index]=this.dovizTipi;
			this.dataSource = new MatTableDataSource(this.dovizTipiList);
            this.configDataTable();
			this.dovizTipi = new DovizTipi();
			jQuery('#doviztipi').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.dovizTipiAddForm);

		})

	}

	createDovizTipiAddForm() {
		this.dovizTipiAddForm = this.formBuilder.group({		
			id : [0],
kodu : ["", Validators.required],
adi : ["", Validators.required],
simge : ["", Validators.required],
tCMMId : [0, Validators.required]
		})
	}

	deleteDovizTipi(dovizTipiId:number){
		this.dovizTipiService.deleteDovizTipi(dovizTipiId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.dovizTipiList=this.dovizTipiList.filter(x=> x.id!=dovizTipiId);
			this.dataSource = new MatTableDataSource(this.dovizTipiList);
			this.configDataTable();
		})
	}

	getDovizTipiById(dovizTipiId:number){
		this.clearFormGroup(this.dovizTipiAddForm);
		this.dovizTipiService.getDovizTipiById(dovizTipiId).subscribe(data=>{
			this.dovizTipi=data;
			this.dovizTipiAddForm.patchValue(data);
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
