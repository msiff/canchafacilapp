import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarOwnerComponent } from './solicitar-owner.component';

describe('SolicitarOwnerComponent', () => {
  let component: SolicitarOwnerComponent;
  let fixture: ComponentFixture<SolicitarOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitarOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
