import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarComplejosComponent } from './listar-complejos.component';

describe('ListarComplejosComponent', () => {
  let component: ListarComplejosComponent;
  let fixture: ComponentFixture<ListarComplejosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarComplejosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarComplejosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
