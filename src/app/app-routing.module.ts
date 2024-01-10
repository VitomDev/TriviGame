import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JuegoComponent } from './juego/juego/juego.component';
import { FinalJuegoComponent } from './juego/final-juego/final-juego.component';
import { PerfilComponent } from './perfil/perfil/perfil.component';
import { AddPreguntaComponent } from './preguntas/add-pregunta/add-pregunta.component';
import { LoginComponent } from './authentication/login/login/login.component';
import { RegisterComponent } from './authentication/register/register/register.component';
import { TutorialComponent } from './tutorial/tutorial.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'perfil', component: PerfilComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'add-pregunta', component: AddPreguntaComponent}, //TODO:QUE COINCIDA LA DIRECCION PARA EN PERFIL REDIRECCIONAR CORRECTAMENTE
  {path: 'juego', component: JuegoComponent},
  {path: 'final', component: FinalJuegoComponent},
  {path: 'tutorial', component: TutorialComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
