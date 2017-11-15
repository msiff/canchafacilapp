import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { UserService } from './services/user.service';

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

  constructor (private _userService: UserService, private _router: Router) {
  }

  ngDoCheck() {
    // Este metodo se ejecuta cada vez que ocurre algun cambio en el componente. Em este caso funciona
    // mejor que el onInit pq el local storage no se actualiza automaticamente.
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }
  
  logout() {
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/home']);
  }

}
