import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Servicios
import { GLOBAL } from './../../services/global.service';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-solicitar-owner',
  templateUrl: './solicitar-owner.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService, AdminService]
})
export class SolicitarOwnerComponent implements OnInit {
  public identity;
  public token;
  public status;
  public message;

  constructor(private _userService: UserService, private _router: Router, private _adminService: AdminService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
  }

  solicitarOwner() {
    this._userService.solicitarCancha(this.identity._id).subscribe(response => {
      if (response.type === 'err') {
        this.status = 'err';
        this.message = response.message;
      }
      if (response.type === 'ok') {
        this.status = 'ok';
        this.message = response.message;
      }
      if (response.type === 'okno') {
        this.status = 'okno';
        this.message = response.message;
      }
    }, err => {
      const errorMessage = <any>err;
      if (errorMessage) {
        const body = JSON.parse(err._body);
        this.message = body.message;
        this.status = 'err';
      }
    });
  }

}
