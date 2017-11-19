import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

// Login social
import { AuthService } from 'ng4-social-login';
import { SocialUser } from 'ng4-social-login';

// Services
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements DoCheck {
  title = 'app';
  public identity;
  public token;
  public url;
  private socialUser: SocialUser;
  private loggedIn: boolean;


  constructor (private _userService: UserService, private _router: Router, private _authService: AuthService) {
    this.url = GLOBAL.url;
  }

  ngDoCheck() {
    // Este metodo se ejecuta cada vez que ocurre algun cambio en el componente. Em este caso funciona
    // mejor que el onInit pq el local storage no se actualiza automaticamente.
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this._authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = (user != null);
    });
  }

  logout() {
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/home']);
    if (this.loggedIn === true) {
      this._authService.signOut(); // Hacemos logout social en caso que lo haya.
    }
  }
}
