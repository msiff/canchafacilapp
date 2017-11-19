import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Modelos
import { User } from './../../models/userModel';

// Servicios
import { UserService } from '../../services/user.service';
import { GLOBAL } from './../../services/global.service';
import { UploadService } from './../../services/upload.service';


@Component({
  selector: 'app-editar-misdatos',
  templateUrl: './editar-misdatos.component.html',
  styleUrls: ['./editar-misdatos.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService, UploadService]
})
export class EditarMisdatosComponent implements OnInit {
  public user: User;
  public identity;
  public token;
  public url;
  public status;
  public message;
  public filesToUpload: Array<File>;
  public imgurl;

  constructor(private _userService: UserService, private _uploadService: UploadService,
    private _router: Router, ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    // console.log(this.user);
  }

  // Este metodo es para actualizar un usuario.
  onSubmit() {
    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.user) {
          this.status = 'error';
          this.message = 'Error al actualizar el usuario, vuelve a intentarlo';
        } else {
          // En este momento ya se actualizo los datos del usuario, compruebo si hay imagen para subir si no
          // envio cartel que se actualizaron los datos.
          if (this.filesToUpload) {
            // Subida de la imagen
            // Le paso la direccion de la API, los paarmetros en este caso vacios, los archivos a subir, el token y el nombre del campo
            // que voy a subir.
            this._uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload,
              this.token, 'image').then((result: any) => {
                if (result.newImage) {
                  // New image es lo que devuelve la api si se actualiza la imagen.
                  this.user.image = result.newImage;
                  this.user.photoUrl = 'Null';
                  // console.log(result.newImage);
                  // console.log(this.user);
                  localStorage.setItem('identity', JSON.stringify(this.user));
                  // console.log(this.user);
                  this.status = 'ok';
                  this.message = 'Datos e imagen actualizados correctamente!';
                  this._router.navigate(['/mis-datos']);
                } else {
                  localStorage.setItem('identity', JSON.stringify(this.user));
                  this.status = 'error';
                  this.message = 'Imagen no subida, datos actualizados';
                  this._router.navigate(['/mis-datos']);
                }
              }, (error) => {
                this.status = 'error';
                this.message = 'Error al actualizar imagen!';
              });
          } else {
            // Aqui paso el usuario actualizado localmente y no el que nos devuelve la API
            // porque la API esta configurada para psarnos el objeto antiguo y no el nuevo.
            // Lo hice asi para al momento de subir la imagen poder borrar la anterior. Hay
            // una forma de poder pasar el nuevo objeto {new: true}.
            // Si entra aca es porque no hay imagen para subir!!
            localStorage.setItem('identity', JSON.stringify(this.user));
            this.status = 'ok';
            this.message = 'Datos actualizados correctamente!';
            this._router.navigate(['/mis-datos']);
          }
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

  // Esta funcion se va a encargar se recoger los datos que vamos a subir, la llamamos desde el html con un evento (change).
  fileChangeEvent(fileInput: any) {
    // Asigno a mi variable el nombre del archivo que seleccione. File input es lo que me llega, target es el archivo en si y file
    // es el nombre.
    this.filesToUpload = <Array<File>>fileInput.target.files;
    // console.log(this.filesToUpload);
  }
}
