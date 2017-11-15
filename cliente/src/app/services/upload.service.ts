import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Servicios
import { GLOBAL } from './global.service';

@Injectable()
export class UploadService {
    public url: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: String) {
        return new Promise( function(resolve, reject) {
            const formData: any = new FormData();
            const xhr = new XMLHttpRequest();

            // Aca en este for podriamos recorrer varios archivos y añadirlselos al formulario
            for (let index = 0; index < files.length; index++) {
                // Por cada elemento que nos llegue lo vamos a agregar al formData. Name que llega por la funcion principal,
                // ficcheros en si y por ultimo el nombre
                formData.append(name, files[index], files[index].name);
            }
            xhr.onreadystatechange = function() {
                if ( xhr.readyState === 4 ) {
                    if ( xhr.status === 200) {
                        // Si se realizo correctamente la peticion
                        resolve(JSON.parse(xhr.response));
                    } else {
                        // Si NO se realizo correctamente la peticion
                        reject(xhr.response);
                    }
                }
            };
            // 1) Abro la peticion, le indico que metodo voy a utilizar, url a la que voy a hacer la peticion y true para que realize
            // la peticion
            // 2) Le pongo cabeceras de autenticacion
            // 3) Envia mos el formdata
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}
