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


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  declarations: [
    ListarUsuariosComponent,
    MainComponent,
    ListarComplejosComponent
  ]
})
export class AdminModule { }
