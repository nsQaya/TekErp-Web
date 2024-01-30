import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/lookUp.service';
import { AuthService } from 'app/core/components/admin/login/Services/auth.service';
import { Kod4 } from './models/kod4';
import { Kod4Service } from './services/kod4.service';
import { environment } from 'environments/environment';

declare var jQuery: any;

@Component({
	selector: 'app-kod4',
	templateUrl: './kod4.component.html',
	styleUrls: ['./kod4.component.scss']
})
export class Kod4Component implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','kodu','adi', 'update','delete'];

	kod4List:Kod4[];
	kod4:Kod4=new Kod4();

	kod4AddForm: FormGroup;


	kod4Id:number;

	constructor(private kod4Service:Kod4Service, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        this.getKod4List();
    }

	ngOnInit() {

		this.createKod4AddForm();
	}


	getKod4List() {
		this.kod4Service.getKod4List().subscribe(data => {
			this.kod4List = data;
			this.dataSource = new MatTableDataSource(data);
            this.configDataTable();
		});
	}

	save(){

		if (this.kod4AddForm.valid) {
			this.kod4 = Object.assign({}, this.kod4AddForm.value)

			if (this.kod4.id == 0)
				this.addKod4();
			else
				this.updateKod4();
		}

	}

	addKod4(){

		this.kod4Service.addKod4(this.kod4).subscribe(data => {
			this.getKod4List();
			this.kod4 = new Kod4();
			jQuery('#kod4').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.kod4AddForm);

		})

	}

	updateKod4(){

		this.kod4Service.updateKod4(this.kod4).subscribe(data => {

			var index=this.kod4List.findIndex(x=>x.id==this.kod4.id);
			this.kod4List[index]=this.kod4;
			this.dataSource = new MatTableDataSource(this.kod4List);
            this.configDataTable();
			this.kod4 = new Kod4();
			jQuery('#kod4').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.kod4AddForm);

		})

	}

	createKod4AddForm() {
		this.kod4AddForm = this.formBuilder.group({		
			id : [0],
kodu : ["", Validators.required],
adi : ["", Validators.required]
		})
	}

	deleteKod4(kod4Id:number){
		this.kod4Service.deleteKod4(kod4Id).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.kod4List=this.kod4List.filter(x=> x.id!=kod4Id);
			this.dataSource = new MatTableDataSource(this.kod4List);
			this.configDataTable();
		})
	}

	getKod4ById(kod4Id:number){
		this.clearFormGroup(this.kod4AddForm);
		this.kod4Service.getKod4ById(kod4Id).subscribe(data=>{
			this.kod4=data;
			this.kod4AddForm.patchValue(data);
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
