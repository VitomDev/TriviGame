import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { PreguntasService } from '../services/preguntas.service';
import { entradaAddPregunta } from './entradaAddPregunta';
@Component({
  selector: 'app-add-pregunta',
  templateUrl: './add-pregunta.component.html',
  styleUrls: ['./add-pregunta.component.css']
})
export class AddPreguntaComponent {

entrada: entradaAddPregunta = {pregunta: '', categoria: '', dificultad: '', opcioCorrecta: '', opcioIncorrecta1: '', opcioIncorrecta2: '', opcioIncorrecta3: ''}

 
  constructor(private preguntasService: PreguntasService) { }

  

guardarEntrada(){
  this.preguntasService.getEntradaAddPregunta(this.entrada);
}

}