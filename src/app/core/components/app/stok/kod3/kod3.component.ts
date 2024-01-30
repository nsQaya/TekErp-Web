import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/lookUp.service';
import { AuthService } from 'app/core/components/admin/login/Services/auth.service';
import { Kod3 } from './models/kod3';
import { Kod3Service } from './services/kod3.service';
import { environment } from 'environments/environment';

declare var jQuery: any;

@Component({
	selector: 'app-kod3',
	templateUrl: './kod3.component.html',
	styleUrls: ['./kod3.component.scss']
})
export class Kod3Component implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','kodu','adi', 'update','delete'];

	kod3List:Kod3[];
	kod3:Kod3=new Kod3();

	kod3AddForm: FormGroup;


	kod3Id:number;

	constructor(private kod3Service:Kod3Service, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        this.getKod3List();
    }

	ngOnInit() {

		this.createKod3AddForm();
	}


	getKod3List() {
		this.kod3Service.getKod3List().subscribe(data => {
			this.kod3List = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}

	save(){

		if (this.kod3AddForm.valid) {
			this.kod3 = Object.assign({}, this.kod3AddForm.value)

			if (this.kod3.id == 0)
				this.addKod3();
			else
				this.updateKod3();
		}

	}

	addKod3(){

		this.kod3Service.addKod3(this.kod3).subscribe(data => {
			this.getKod3List();
			this.kod3 = new Kod3();
			jQuery('#kod3').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.kod3AddForm);

		})

	}

	updateKod3(){

		this.kod3Service.updateKod3(this.kod3).subscribe(data => {

			var index=this.kod3List.findIndex(x=>x.id==this.kod3.id);
			this.kod3List[index]=this.kod3;
			this.dataSource = new MatTableDataSource(this.kod3List);
            this.configDataTable();
			this.kod3 = new Kod3();
			jQuery('#kod3').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.kod3AddForm);

		})

	}

	createKod3AddForm() {
		this.kod3AddForm = this.formBuilder.group({		
			id : [0],
kodu : ["", Validators.required],
adi : ["", Validators.required]
		})
	}

	deleteKod3(kod3Id:number){
		this.kod3Service.deleteKod3(kod3Id).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.kod3List=this.kod3List.filter(x=> x.id!=kod3Id);
			this.dataSource = new MatTableDataSource(this.kod3List);
			this.configDataTable();
		})
	}

	getKod3ById(kod3Id:number){
		this.clearFormGroup(this.kod3AddForm);
		this.kod3Service.getKod3ById(kod3Id).subscribe(data=>{
			this.kod3=data;
			this.kod3AddForm.patchValue(data);
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
