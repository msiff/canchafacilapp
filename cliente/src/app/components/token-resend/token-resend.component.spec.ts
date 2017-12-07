import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenResendComponent } from './token-resend.component';

describe('TokenResendComponent', () => {
  let component: TokenResendComponent;
  let fixture: ComponentFixture<TokenResendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenResendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenResendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
