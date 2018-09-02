import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { MainComponent } from './components/main/main.component';
import { MiComplejoComponent } from './components/mi-complejo/mi-complejo.component';
import { ReservasComponent } from './components/reservas/reservas.component';

// Guards
import { AdminGuard } from './../services/admin.guard';

const ownerRoutes: Routes = [
    { path: 'mi-complejo', component: MainComponent, children: [
        {path: '', redirectTo: 'reservas', pathMatch: 'full'},
        {path: '**', redirectTo: 'reservas', pathMatch: 'full'},
        {path: 'reservas', component: ReservasComponent},
        {path: 'complejo', component: MiComplejoComponent},
      ]}
  ];

@NgModule({
    imports: [RouterModule.forChild(ownerRoutes)],
    exports: [RouterModule]
})
export class OwnerRoutingModule {}
