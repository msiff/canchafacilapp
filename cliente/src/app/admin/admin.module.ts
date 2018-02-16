import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

// Componentes
import { MainComponent } from './components/main/main.component';
import { ListarUsuariosComponent } from './components/listar-usuarios/listar-usuarios.component';
import { ListarComplejosComponent } from './components/listar-complejos/listar-complejos.component';

// Rutas
import { AdminRoutingModule } from './admin.routing';

// Pipes
import { SearchPipe } from './pipes/search.pipe';
import { DatePipe } from '@angular/common';
import { ListarSolicitudesComponent } from './components/listar-solicitudes/listar-solicitudes.component';


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ],
  declarations: [
    ListarUsuariosComponent,
    MainComponent,
    ListarComplejosComponent,
    SearchPipe,
    ListarSolicitudesComponent
  ]
})
export class AdminModule { }
