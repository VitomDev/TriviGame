import { Component } from '@angular/core';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css'],
})
export class JuegoComponent {
  torn:boolean = true;
  numP:number = 1;
  porcentajeAnimacion: number = this.numP * 10;
  // porcentajeAnimacion: number = 100;

  activarAnimacion: boolean = true;

  toggleAnimacion() {
    this.activarAnimacion = !this.activarAnimacion;
  }

  nextQuestion() {
    this.torn = !this.torn;
    // this.numP++;
  }

  respondida() {
    this.torn = !this.torn;
    this.numP++;
    this.porcentajeAnimacion = this.numP * 10;
    this.toggleAnimacion();
  }

  redHome(){
    
  }
}