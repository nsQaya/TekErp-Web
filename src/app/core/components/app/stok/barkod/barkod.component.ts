import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/lookUp.service';
import { AuthService } from 'app/core/components/admin/login/Services/auth.service';
import { Barkod } from './models/barkod';
import { BarkodService } from './services/barkod.service';
import { environment } from 'environments/environment';

declare var jQuery: any;

@Component({
	selector: 'app-barkod',
	templateUrl: './barkod.component.html',
	styleUrls: ['./barkod.component.scss']
})
export class BarkodComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','barkodu','olcuBrID','stokKartiID', 'update','delete'];

	barkodList:Barkod[];
	barkod:Barkod=new Barkod();

	barkodAddForm: FormGroup;


	barkodId:number;

	constructor(private barkodService:BarkodService, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        this.getBarkodList();
    }

	ngOnInit() {

		this.createBarkodAddForm();
	}


	getBarkodList() {
		this.barkodService.getBarkodList().subscribe(data => {
			this.barkodList = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}

	save(){

		if (this.barkodAddForm.valid) {
			this.barkod = Object.assign({}, this.barkodAddForm.value)

			if (this.barkod.id == 0)
				this.addBarkod();
			else
				this.updateBarkod();
		}

	}

	addBarkod(){

		this.barkodService.addBarkod(this.barkod).subscribe(data => {
			this.getBarkodList();
			this.barkod = new Barkod();
			jQuery('#barkod').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.barkodAddForm);

		})

	}

	updateBarkod(){

		this.barkodService.updateBarkod(this.barkod).subscribe(data => {

			var index=this.barkodList.findIndex(x=>x.id==this.barkod.id);
			this.barkodList[index]=this.barkod;
			this.dataSource = new MatTableDataSource(this.barkodList);
            this.configDataTable();
			this.barkod = new Barkod();
			jQuery('#barkod').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.barkodAddForm);

		})

	}

	createBarkodAddForm() {
		this.barkodAddForm = this.formBuilder.group({		
			id : [0],
barkodu : ["", Validators.required],
olcuBrID : [0, Validators.required],
stokKartiID : [0, Validators.required]
		})
	}

	deleteBarkod(barkodId:number){
		this.barkodService.deleteBarkod(barkodId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.barkodList=this.barkodList.filter(x=> x.id!=barkodId);
			this.dataSource = new MatTableDataSource(this.barkodList);
			this.configDataTable();
		})
	}

	getBarkodById(barkodId:number){
		this.clearFormGroup(this.barkodAddForm);
		this.barkodService.getBarkodById(barkodId).subscribe(data=>{
			this.barkod=data;
			this.barkodAddForm.patchValue(data);
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
