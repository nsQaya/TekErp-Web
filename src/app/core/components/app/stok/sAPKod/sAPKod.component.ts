import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/lookUp.service';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { SAPKod } from './models/sapkod';
import { SAPKodService } from './services/sapkod.service';
import { environment } from 'environments/environment';

declare var jQuery: any;

@Component({
	selector: 'app-sAPKod',
	templateUrl: './sAPKod.component.html',
	styleUrls: ['./sAPKod.component.scss']
})
export class SAPKodComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','kod','stokKartiID', 'update','delete'];

	sAPKodList:SAPKod[];
	sAPKod:SAPKod=new SAPKod();

	sAPKodAddForm: FormGroup;


	sAPKodId:number;

	constructor(private sAPKodService:SAPKodService, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        this.getSAPKodList();
    }

	ngOnInit() {

		this.createSAPKodAddForm();
	}


	getSAPKodList() {
		this.sAPKodService.getSAPKodList().subscribe(data => {
			this.sAPKodList = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}

	save(){

		if (this.sAPKodAddForm.valid) {
			this.sAPKod = Object.assign({}, this.sAPKodAddForm.value)

			if (this.sAPKod.id == 0)
				this.addSAPKod();
			else
				this.updateSAPKod();
		}

	}

	addSAPKod(){

		this.sAPKodService.addSAPKod(this.sAPKod).subscribe(data => {
			this.getSAPKodList();
			this.sAPKod = new SAPKod();
			jQuery('#sapkod').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.sAPKodAddForm);

		})

	}

	updateSAPKod(){

		this.sAPKodService.updateSAPKod(this.sAPKod).subscribe(data => {

			var index=this.sAPKodList.findIndex(x=>x.id==this.sAPKod.id);
			this.sAPKodList[index]=this.sAPKod;
			this.dataSource = new MatTableDataSource(this.sAPKodList);
            this.configDataTable();
			this.sAPKod = new SAPKod();
			jQuery('#sapkod').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.sAPKodAddForm);

		})

	}

	createSAPKodAddForm() {
		this.sAPKodAddForm = this.formBuilder.group({		
			id : [0],
kod : ["", Validators.required],
stokKartiID : [0, Validators.required]
		})
	}

	deleteSAPKod(sAPKodId:number){
		this.sAPKodService.deleteSAPKod(sAPKodId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.sAPKodList=this.sAPKodList.filter(x=> x.id!=sAPKodId);
			this.dataSource = new MatTableDataSource(this.sAPKodList);
			this.configDataTable();
		})
	}

	getSAPKodById(sAPKodId:number){
		this.clearFormGroup(this.sAPKodAddForm);
		this.sAPKodService.getSAPKodById(sAPKodId).subscribe(data=>{
			this.sAPKod=data;
			this.sAPKodAddForm.patchValue(data);
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
