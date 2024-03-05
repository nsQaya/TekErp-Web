import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StokrehberComponent } from './stokrehber.component';

describe('StokrehberComponent', () => {
  let component: StokrehberComponent;
  let fixture: ComponentFixture<StokrehberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StokrehberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StokrehberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
