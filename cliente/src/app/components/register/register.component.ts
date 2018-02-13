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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService]
})
export class RegisterComponent implements OnInit, DoCheck {
  public user: User;
  public identity; // datos del usuario.
  public token; // token para enviar en las peticiones http.
  public status; // sirve para darle estilo al alert.
  public message; // lleva el mensaje del alert.
  public data; // datos del usuario que nos devuelve la api de facebook.
  private userSocial: SocialUser;
  private loggedIn: boolean;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService,
    private _authService: AuthService) {
    this.user = new User('', '', '', '', '', '', '', 'client', '', false, '', '', '');
  }

  ngOnInit() {
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
    // console.log('delante del if!!');
    // console.log(this.userSocial);
    // let count = 0;
    // if (this.userSocial != null && count === 0) {
    //   // console.log('Entro solo si hay usuario logueado!!! DOCHECK');
    //   console.log('Entro al login fb');
    //   this.loginFb();
    //   if (this.loggedIn === true) {
    //     this._authService.signOut(); // Hacemos logout social en caso que lo haya.
    //   }
    //   count ++;
    // }
  }

  ngDoCheck() {
  }

  onSubmit(registerForm) {
    this._userService.registerUser(this.user).subscribe(
      response => {
        if (response.type === 'ok') {
          this.message = response.message;
          this.status = 'ok';
          // console.log(this.user);
          // Esto resetea el formulario solo si el usuario se crea correctamente, para eso en
          // el ngSubmit debemos pasar el formulario para pdoer hacerlo desde aca al reset.
          registerForm.reset();
          this.user = new User('', '', '', '', '', '', '', 'client', '', false, '', '', '');
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

  signInWithFB(): void {
    // Hace signIn utilizando el id de la app.
    this._authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    // console.log('signInWithFB');
    // console.log(this._authService.signIn(FacebookLoginProvider.PROVIDER_ID));
    // console.log('Entro al login fb');
    // this.loginFb();
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
