import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

// Validators
import { EqualValidator } from './components/register/passwordMatch.directive';

// Social Login
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from 'ng4-social-login';
const CONFIG = new AuthServiceConfig([{
  id: FacebookLoginProvider.PROVIDER_ID,
  provider: new FacebookLoginProvider('163872397683863')
}]);
export function provideConfig() {
  return CONFIG;
}
///////

// Rutas
import { routing, appRoutingProviders } from './app.routing';

// Componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MisDatosComponent } from './components/mis-datos/mis-datos.component';
import { EditarMisdatosComponent } from './components/editar-misdatos/editar-misdatos.component';
import { TokenConfirmationComponent } from './components/token-confirmation/token-confirmation.component';
import { TokenResendComponent } from './components/token-resend/token-resend.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    MisDatosComponent,
    EditarMisdatosComponent,
    EqualValidator,
    TokenConfirmationComponent,
    TokenResendComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SocialLoginModule,
    routing
  ],
  providers: [appRoutingProviders, { provide: AuthServiceConfig, useFactory: provideConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }
