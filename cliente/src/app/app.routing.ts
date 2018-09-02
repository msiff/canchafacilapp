import { Routes, RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';

// Componentes
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MisDatosComponent } from './components/mis-datos/mis-datos.component';
import { EditarMisdatosComponent } from './components/editar-misdatos/editar-misdatos.component';
import { TokenConfirmationComponent } from './components/token-confirmation/token-confirmation.component';
import { TokenResendComponent } from './components/token-resend/token-resend.component';
import { SolicitarOwnerComponent } from './components/solicitar-owner/solicitar-owner.component';
// import { MiComplejoComponent } from './components/mi-complejo/mi-complejo.component';

// Guards
import { UserGuard } from './services/user.guard';
import { AdminGuard } from './services/admin.guard';
import { OwnerGuard } from './services/owner.guard';


const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'mis-datos', component: MisDatosComponent },
    { path: 'editar-datos', component: EditarMisdatosComponent },
    { path: 'confirmar-cuenta/:token', component: TokenConfirmationComponent},
    { path: 'enviar-codigo', component: TokenResendComponent},
    { path: 'solicitud-cancha', component: SolicitarOwnerComponent, canActivate: [UserGuard]},
    // { path: 'mi-complejo', component: MiComplejoComponent, canActivate: [OwnerGuard]},
    { path: '**', component: HomeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureRoutingModule {}

export const appRoutingProviders: any [] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
