import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

// Componentes
import { MainComponent } from './components/main/main.component';
import { ListarUsuariosComponent } from './components/listar-usuarios/listar-usuarios.component';
import { ListarComplejosComponent } from './components/listar-complejos/listar-complejos.component';
import { ListarSolicitudesComponent } from './components/listar-solicitudes/listar-solicitudes.component';

// Rutas
import { AdminRoutingModule } from './admin.routing';

// Guards
import { AdminGuard } from './../services/admin.guard';

// Servicios
import { AdminService } from './../services/admin.service';

// Pipes
import { SearchPipe } from './pipes/search.pipe';
import { DatePipe } from '@angular/common';

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
  ],
  providers: [AdminGuard, AdminService]
})
export class AdminModule { }
