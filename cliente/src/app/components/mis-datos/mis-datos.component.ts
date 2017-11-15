import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Modelos
import { User } from './../../models/userModel';

// Servicios
import { UserService } from '../../services/user.service';
import { GLOBAL } from './../../services/global.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService]
})
export class MisDatosComponent implements OnInit {
  public user: User;
  public identity;
  public token;

  constructor(private _userService: UserService, private _router: Router) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
   }

  ngOnInit() {
  }

  editarDatos() {
    this._router.navigate(['/editar-datos']);
  }

}
