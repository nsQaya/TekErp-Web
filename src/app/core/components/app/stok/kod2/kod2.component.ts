import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/lookUp.service';
import { AuthService } from 'app/core/components/admin/login/Services/auth.service';
import { Kod2 } from './models/kod2';
import { Kod2Service } from './services/kod2.service';
import { environment } from 'environments/environment';

declare var jQuery: any;

@Component({
	selector: 'app-kod2',
	templateUrl: './kod2.component.html',
	styleUrls: ['./kod2.component.scss']
})
export class Kod2Component implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','kodu','adi', 'update','delete'];

	kod2List:Kod2[];
	kod2:Kod2=new Kod2();

	kod2AddForm: FormGroup;


	kod2Id:number;

	constructor(private kod2Service:Kod2Service, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        this.getKod2List();
    }

	ngOnInit() {

		this.createKod2AddForm();
	}


	getKod2List() {
		this.kod2Service.getKod2List().subscribe(data => {
			this.kod2List = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}

	save(){

		if (this.kod2AddForm.valid) {
			this.kod2 = Object.assign({}, this.kod2AddForm.value)

			if (this.kod2.id == 0)
				this.addKod2();
			else
				this.updateKod2();
		}

	}

	addKod2(){

		this.kod2Service.addKod2(this.kod2).subscribe(data => {
			this.getKod2List();
			this.kod2 = new Kod2();
			jQuery('#kod2').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.kod2AddForm);

		})

	}

	updateKod2(){

		this.kod2Service.updateKod2(this.kod2).subscribe(data => {

			var index=this.kod2List.findIndex(x=>x.id==this.kod2.id);
			this.kod2List[index]=this.kod2;
			this.dataSource = new MatTableDataSource(this.kod2List);
            this.configDataTable();
			this.kod2 = new Kod2();
			jQuery('#kod2').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.kod2AddForm);

		})

	}

	createKod2AddForm() {
		this.kod2AddForm = this.formBuilder.group({		
			id : [0],
kodu : ["", Validators.required],
adi : ["", Validators.required]
		})
	}

	deleteKod2(kod2Id:number){
		this.kod2Service.deleteKod2(kod2Id).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.kod2List=this.kod2List.filter(x=> x.id!=kod2Id);
			this.dataSource = new MatTableDataSource(this.kod2List);
			this.configDataTable();
		})
	}

	getKod2ById(kod2Id:number){
		this.clearFormGroup(this.kod2AddForm);
		this.kod2Service.getKod2ById(kod2Id).subscribe(data=>{
			this.kod2=data;
			this.kod2AddForm.patchValue(data);
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
