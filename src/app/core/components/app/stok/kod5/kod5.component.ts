import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/lookUp.service';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { Kod5 } from './models/kod5';
import { Kod5Service } from './services/kod5.service';
import { environment } from 'environments/environment';

declare var jQuery: any;

@Component({
	selector: 'app-kod5',
	templateUrl: './kod5.component.html',
	styleUrls: ['./kod5.component.scss']
})
export class Kod5Component implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','kodu','adi', 'update','delete'];

	kod5List:Kod5[];
	kod5:Kod5=new Kod5();

	kod5AddForm: FormGroup;


	kod5Id:number;

	constructor(private kod5Service:Kod5Service, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        this.getKod5List();
    }

	ngOnInit() {

		this.createKod5AddForm();
	}


	getKod5List() {
		this.kod5Service.getKod5List().subscribe(data => {
			this.kod5List = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}

	save(){

		if (this.kod5AddForm.valid) {
			this.kod5 = Object.assign({}, this.kod5AddForm.value)

			if (this.kod5.id == 0)
				this.addKod5();
			else
				this.updateKod5();
		}

	}

	addKod5(){

		this.kod5Service.addKod5(this.kod5).subscribe(data => {
			this.getKod5List();
			this.kod5 = new Kod5();
			jQuery('#kod5').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.kod5AddForm);

		})

	}

	updateKod5(){

		this.kod5Service.updateKod5(this.kod5).subscribe(data => {

			var index=this.kod5List.findIndex(x=>x.id==this.kod5.id);
			this.kod5List[index]=this.kod5;
			this.dataSource = new MatTableDataSource(this.kod5List);
            this.configDataTable();
			this.kod5 = new Kod5();
			jQuery('#kod5').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.kod5AddForm);

		})

	}

	createKod5AddForm() {
		this.kod5AddForm = this.formBuilder.group({		
			id : [0],
kodu : ["", Validators.required],
adi : ["", Validators.required]
		})
	}

	deleteKod5(kod5Id:number){
		this.kod5Service.deleteKod5(kod5Id).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.kod5List=this.kod5List.filter(x=> x.id!=kod5Id);
			this.dataSource = new MatTableDataSource(this.kod5List);
			this.configDataTable();
		})
	}

	getKod5ById(kod5Id:number){
		this.clearFormGroup(this.kod5AddForm);
		this.kod5Service.getKod5ById(kod5Id).subscribe(data=>{
			this.kod5=data;
			this.kod5AddForm.patchValue(data);
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
