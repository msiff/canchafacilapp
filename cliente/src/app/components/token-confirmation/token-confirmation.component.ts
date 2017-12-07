import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// servicios
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-token-confirmation',
  templateUrl: './token-confirmation.component.html',
  styleUrls: ['./token-confirmation.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService]
})
export class TokenConfirmationComponent implements OnInit {
  public status;
  public message;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService) { }

  ngOnInit() {
    this.tokenconfirmation();
  }

  tokenconfirmation() {
    this._route.params.forEach((params: Params) => {
      const token = params['token'];

      this._userService.tokenConfirmation(token).subscribe(
        response => {
          if (response.type === 'No verificado') {
            this.status = response.type;
            this.message = response.message;
          } else {
            this.status = response.type;
            this.message = response.message;
          }

        },
        err => {
          const errorMessage = <any>err;
          if (errorMessage) {
            const body = JSON.parse(err._body);
            this.message = body.message;
            this.status = body.type;
            // console.log(this.message);
          }
        }
      );
    });
  }

}
