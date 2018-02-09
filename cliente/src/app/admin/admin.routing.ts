import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { MainComponent } from './components/main/main.component';
import { ListarUsuariosComponent } from './components/listar-usuarios/listar-usuarios.component';
import { ListarComplejosComponent } from './components/listar-complejos/listar-complejos.component';

const adminRoutes: Routes = [
    { path: 'admin-panel', component: MainComponent, children: [
        {path: '', redirectTo: 'listado-usuarios', pathMatch: 'full'},
        {path: 'listado-usuarios', component: ListarUsuariosComponent},
        {path: 'listado-complejos', component: ListarComplejosComponent},
        {path: '**', redirectTo: 'listado-usuarios', pathMatch: 'full'}
      ]}
  ];

@NgModule({
    imports: [RouterModule.forChild(adminRoutes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}
