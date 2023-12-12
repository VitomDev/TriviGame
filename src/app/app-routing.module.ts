import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from './perfil/perfil/perfil.component';
import { AddPreguntaComponent } from './preguntas/add-pregunta/add-pregunta.component';

const routes: Routes = [
  { path: 'perfil', component: PerfilComponent},
  { path: 'add-pregunta', component: AddPreguntaComponent}, //TODO:QUE COINCIDA LA DIRECCION PARA EN PERFIL REDIRECCIONAR CORRECTAMENTE
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
