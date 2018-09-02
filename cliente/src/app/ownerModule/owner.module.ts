import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

// Componentes
import { MainComponent } from './components/main/main.component';
import { MiComplejoComponent } from './components/mi-complejo/mi-complejo.component';
import { ReservasComponent } from './components/reservas/reservas.component';

// Rutas
import { OwnerRoutingModule } from './owner.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OwnerRoutingModule
  ],
  declarations: [
    MainComponent,
    MiComplejoComponent,
    ReservasComponent
  ]
})
export class OwnerModule { }
