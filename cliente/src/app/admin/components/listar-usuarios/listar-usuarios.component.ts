import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// Modelos
import {User} from '../../../../app/models/userModel';

// Servicios
import { GLOBAL } from '../../../services/global.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AdminService]
})
export class ListarUsuariosComponent implements OnInit {
  public identity;
  public token;
  public users =  new Array<User>();
  public status;
  public message;

  constructor(private _adminService: AdminService) {
    this.identity = this._adminService.getIdentity();
    this.token = this._adminService.getToken();
   }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this._adminService.getUsers().subscribe(
      response => {
        if (!response.users) {
          this.status = 'error';
          this.message = 'Error al actualizar el usuario, vuelve a intentarlo';
        } else {
          this.users = response.users;
          console.log(this.users);
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
