import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// Modelos
import { User } from '../../../../app/models/userModel';
import { SolicitudOwner } from '../../../../app/models/solicitudOwnerModel';

// Servicios
import { GLOBAL } from '../../../services/global.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-listar-solicitudes',
  templateUrl: './listar-solicitudes.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
  providers: [AdminService]
})
export class ListarSolicitudesComponent implements OnInit {
  public identity;
  public token;
  public solicitudes = new Array<SolicitudOwner>();
  public status;
  public message;

  constructor(private _adminService: AdminService) {
    this.identity = this._adminService.getIdentity();
    this.token = this._adminService.getToken();
  }

  ngOnInit() {
    this.getSolicitudes();
    // console.log(this.getSolicitudes());
  }

  getSolicitudes() {
    this._adminService.getSolicitudes().subscribe(
      response => {
        if (!response.solicitudes) {
          this.status = 'err';
          this.message = 'Error al actualizar el usuario, vuelve a intentarlo';
        } else {
          this.solicitudes = response.solicitudes;
          // console.log(this.solicitudes);
        }
      },
      err => {
        const errorMessage = <any>err;
        if (errorMessage) {
          const body = JSON.parse(err._body);
          this.message = body.message;
          this.status = 'err';
        }
      }
    );
  }

  aceptarOwner(id) {
    this._adminService.aceptarOwner(id).subscribe(response => {
      if (response.type === 'err') {
        this.status = 'err';
        this.message = response.message;
        console.log(this.message);
      } else {
        this.status = 'ok';
        this.message = response.message;
        console.log(this.message);
        this.getSolicitudes();
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
