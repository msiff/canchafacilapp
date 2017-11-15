import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Modelos
import { User } from './../../models/userModel';

// Servicios
import { UserService } from '../../services/user.service';
import { GLOBAL } from './../../services/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public user: User;
  public status: string;
  public message: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService) {
    this.user = new User('', '', '', '', '', 'client', '', '', '');
  }

  ngOnInit() {
  }

  onSubmit(registerForm) {
    this._userService.registerUser(this.user).subscribe(
      response => {
        if (response.user && response.user._id) {
          this.message = 'El registro se realizo correctamente';
          this.status = 'ok';
          // Esto resetea el formulario solo si el usuario se crea correctamente, para eso en
          // el ngSubmit debemos pasar el formulario para pdoer hacerlo desde aca al reset.
          registerForm.reset();
          this.user = new User('', '', '', '', '', 'client', '', '', '');
        } else {
          this.message = response.message;
          this.status = 'error';
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
