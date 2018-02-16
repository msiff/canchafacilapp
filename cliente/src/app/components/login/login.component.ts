import { Component, OnInit, ViewEncapsulation, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


// Social login
import { AuthService, FacebookLoginProvider, SocialUser } from 'ng4-social-login';


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
export class LoginComponent implements OnInit, DoCheck {
  public user: User;
  public identity; // datos del usuario.
  public token; // token para enviar en las peticiones http.
  public status; // sirve para darle estilo al alert.
  public message; // lleva el mensaje del alert.
  public type; // Obtiene el tipo de error que devuelve la API. En este caso manejamos solo No verificado en el user.
  public data; // datos del usuario que nos devuelve la api de facebook.
  private userSocial: SocialUser;
  private loggedIn: boolean;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService,
    private _authService: AuthService) {
    this.user = new User('', '', '', '', '', '', '', 'client', '', false, null, '', '', '');
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    // Este metodo me devuelve si hay un usuario logueado de forma social, si lo hay lo asigno al social user
    // que es el objeto que utiliza la funcion loginFb para enviarla a la API para hacer login o registrar.
    // Entonces luego del usuario asignado aca ocure un cambio y se ejecuta en ngDoCheck y ahi llamamos al
    // loginFb porque si el socualUser es null nos tira error.
    this._authService.authState.subscribe((user) => {
      // console.log('on init');
      this.userSocial = user;
      this.loggedIn = (user != null);
      // console.log('loggedSocial');
      // console.log(this.userSocial);
      // console.log('loggedSocial - USER');
      // console.log(user);
      if (this.userSocial != null && this.loggedIn === true) {
        // console.log('Entro solo si hay usuario logueado!!! DOCHECK');
        // console.log('Entro al login fb');
        this.loginFb();
        this._authService.signOut();
      }
    });
  }

  ngDoCheck() {
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
                // console.log(this.identity);
                // console.log(this.token);
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
          if (body.type) {
            this.type = body.type;
          }
        }
      }
    );
  }

  signInWithFB(): void {
    // Hace signIn utilizando el id de la app.
    this._authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    // console.log('signInWithFB');
  }

  // Esta funcion llama al metodo en el user service para hacer login con facebook. Esta recibe como parametros
  // un userSocial, que nos devuelve el modulo ng4-social-login. Envia este user social directo a la API, y consulta
  // si hay un usuario con el facebook id el socialUser, en caso que haya lo loguea, en caso que no haya comprueba
  // si el email del socualUser esta en uso, en caso que lo este informa que no se puede registrar porque ese email esta
  // en uso, y en caso que no haya un usuario con ese facebook id y el email este libre, registra al usuario y lo loguea.
  loginFb() {
    // console.log('loginFb');
    if (this.userSocial != null) {
      this._userService.loginFacebook(this.userSocial).subscribe(
        response => {
          // console.log('Response');
          // console.log(response);
          if (!response.user._id || !response.token) {
            this.status = 'error';
            this.message = 'No se logueo correctamente, intente de nuevo';
          } else {
            this.identity = response.user;
            this.identity.password = '';
            localStorage.setItem('identity', JSON.stringify(this.identity));
            this.token = response.token;
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
    } else {
      this.status = 'error';
      this.message = 'Error intentelo de nuevo';
    }
  }
}
