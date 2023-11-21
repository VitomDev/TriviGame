import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './services/login/login.component';
import { RegisterComponent } from './authentication/register/register/register.component';
import { HomeComponent } from './home/home/home.component';
import { PerfilComponent } from './perfil/perfil/perfil.component';
import { JuegoComponent } from './juego/juego/juego.component';
import { FinalJuegoComponent } from './juego/final-juego/final-juego.component';
import { AddPreguntaComponent } from './preguntas/add-pregunta/add-pregunta.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    PerfilComponent,
    JuegoComponent,
    FinalJuegoComponent,
    AddPreguntaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
