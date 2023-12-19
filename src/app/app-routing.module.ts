import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JuegoComponent } from './juego/juego/juego.component';
import { FinalJuegoComponent } from './juego/final-juego/final-juego.component';

const routes: Routes = [
  {path: 'juego', component: JuegoComponent},
  {path: 'final', component: FinalJuegoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
