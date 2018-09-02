import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiComplejoComponent } from './mi-complejo.component';

describe('MiComplejoComponent', () => {
  let component: MiComplejoComponent;
  let fixture: ComponentFixture<MiComplejoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiComplejoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiComplejoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
