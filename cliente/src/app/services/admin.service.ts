import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Services
import { GLOBAL } from './global.service';

@Injectable()
export class AdminService {
    public url: string;
    public identity;
    public token;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }
    getIdentity() {
        const identity = JSON.parse(localStorage.getItem('identity'));
        if (identity !== 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getToken() {
        const token = localStorage.getItem('token');
        if (token !== 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }

    getUsers() {
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this.getToken() });

        return this._http.get(this.url + 'get-users', { headers: headers })
            .map(res => res.json());
    }

    getSolicitudes() {
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this.getToken() });

        return this._http.get(this.url + 'get-solicitudes', { headers: headers })
            .map(res => res.json());
    }

    aceptarOwner(solicitud) {
        // Recibe un objeto solicitud, saco el id para mandar como parametro en el link y envio el objeto por body para que el
        // metodo post envie la cabecera de autenticacion, de otra forma no la envia.
        const id = solicitud._id;
        const params = JSON.stringify(solicitud);
        const headers = new Headers({'Content-Type': 'application/json', 'Authorization': this.token});
        return this._http.post(this.url + 'new-owner/' + id, params, {headers: headers} ).map(res => res.json());
    }
}
