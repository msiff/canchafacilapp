import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Modelos
import { User } from './../../models/userModel';

// Servicios
import { UserService } from '../../services/user.service';
import { GLOBAL } from './../../services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public user: User;
  public identity;
  public token;
  public status;
  public message;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService) {
    this.user = new User('', '', '', '', '', 'client', '', '', '');
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  onSubmit() {
    // Loguear al usuario y guardar sus datos
    this._userService.loginUser(this.user, null).subscribe(
      response => {
        if (!response.user || !response.user._id) {
          this.status = 'error';
          this.message = 'El usuario no se logueo correctamente';
          console.log(response);
        } else {
          // En este momento la API nos devolvio el user,lo asignamos a identity y le borramos la pass para
          // no tenerla en el front aunque este encryptada. Luego guardamos este identity en el LS.

          // LO QUE IRIA ACA LO PASAMOS AL SEGUNDO REQUEST PORQUE DE NADA SIRVE TENER EL IDENTITY SIN EL TOKEN!!

          // Ahora que el usuario se logueo correctamente debemos conseguir el token para enviar en las peticiones.
          // Le pasamos true al loguin user y nos asigna la propiedad gettoken al objeto user.
          this._userService.loginUser(this.user, true).subscribe(
            responseT => {
              if (!responseT.token) {
                this.status = 'error';
                this.message = 'El usuario no se logueo correctamente';
              } else {
                // Esto es del primer request
                this.identity = response.user;
                this.identity.password = '';
                localStorage.setItem('identity', JSON.stringify(this.identity));
                // Esto es del segundo request, persistimos el token que nos entrega la API en la variable local
                // y en el LS.
                this.token = responseT.token;
                localStorage.setItem('token', this.token);
                this.status = 'ok';
                this._router.navigate(['/home']);
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
