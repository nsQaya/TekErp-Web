import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/lookUp.service';
import { AuthService } from 'app/core/components/admin/login/Services/auth.service';
import { Kod1 } from './models/kod1';
import { Kod1Service } from './services/kod1.service';
import { environment } from 'environments/environment';

declare var jQuery: any;

@Component({
	selector: 'app-kod1',
	templateUrl: './kod1.component.html',
	styleUrls: ['./kod1.component.scss']
})
export class Kod1Component implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','kodu','adi', 'update','delete'];

	kod1List:Kod1[];
	kod1:Kod1=new Kod1();

	kod1AddForm: FormGroup;


	kod1Id:number;

	constructor(private kod1Service:Kod1Service, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        this.getKod1List();
    }

	ngOnInit() {

		this.createKod1AddForm();
	}


	getKod1List() {
		this.kod1Service.getKod1List().subscribe(data => {
			this.kod1List = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}

	save(){

		if (this.kod1AddForm.valid) {
			this.kod1 = Object.assign({}, this.kod1AddForm.value)

			if (this.kod1.id == 0)
				this.addKod1();
			else
				this.updateKod1();
		}

	}

	addKod1(){

		this.kod1Service.addKod1(this.kod1).subscribe(data => {
			this.getKod1List();
			this.kod1 = new Kod1();
			jQuery('#kod1').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.kod1AddForm);

		})

	}

	updateKod1(){

		this.kod1Service.updateKod1(this.kod1).subscribe(data => {

			var index=this.kod1List.findIndex(x=>x.id==this.kod1.id);
			this.kod1List[index]=this.kod1;
			this.dataSource = new MatTableDataSource(this.kod1List);
            this.configDataTable();
			this.kod1 = new Kod1();
			jQuery('#kod1').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.kod1AddForm);

		})

	}

	createKod1AddForm() {
		this.kod1AddForm = this.formBuilder.group({		
			id : [0],
kodu : ["", Validators.required],
adi : ["", Validators.required]
		})
	}

	deleteKod1(kod1Id:number){
		this.kod1Service.deleteKod1(kod1Id).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.kod1List=this.kod1List.filter(x=> x.id!=kod1Id);
			this.dataSource = new MatTableDataSource(this.kod1List);
			this.configDataTable();
		})
	}

	getKod1ById(kod1Id:number){
		this.clearFormGroup(this.kod1AddForm);
		this.kod1Service.getKod1ById(kod1Id).subscribe(data=>{
			this.kod1=data;
			this.kod1AddForm.patchValue(data);
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
