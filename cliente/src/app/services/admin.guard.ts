import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';

// Servicios
import { AdminService  } from './admin.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private _router: Router, private _adminService: AdminService) { }

    // Este guard comprueba que el usuario sea ADMIN, lo implementamos en el modulo de admin-panel. En las rutas,
    // va a comprobar que cualquiera sea la ruta especificada ahi, el usuario que intenta entrar sea admin.
    // Hay que declararlo en las rutas y en el app.module, tambien hay que declarar el userService en el module.
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const identity = this._adminService.getIdentity();
        if (identity && identity.role === 'admin') {
            return true;
        } else {
            this._router.navigate(['/home']);
            return false;
        }
    }
}
