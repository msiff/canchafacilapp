import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMisdatosComponent } from './editar-misdatos.component';

describe('EditarMisdatosComponent', () => {
  let component: EditarMisdatosComponent;
  let fixture: ComponentFixture<EditarMisdatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarMisdatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarMisdatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
