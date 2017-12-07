import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Servicios
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-token-resend',
  templateUrl: './token-resend.component.html',
  styleUrls: ['./token-resend.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService]
})
export class TokenResendComponent implements OnInit {
  public email;
  public prueba;
  public status;
  public message;

  constructor(private _router: Router, private _userService: UserService) {
    this.email = '';
    this.prueba = {email: this.email};
  }

  ngOnInit() {
  }

  onSubmit() {
    this._userService.resendToken(this.email).subscribe(
      response => {
        if (response.type) {
          this.status = response.type;
          this.message = response.message;
        } else {
          this.status = 'error';
          this.message = 'Error intenta nuevamente.';
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage) {
          const body = JSON.parse(err._body);
          this.message = body.message;
          this.status = 'error';
        }
      }
    );
  }

}
