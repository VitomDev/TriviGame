import { Injectable, OnInit } from '@angular/core';
import { entradaAddPregunta } from '../add-pregunta/entradaAddPregunta';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';


@Injectable({
  providedIn: 'root'
})
export class PreguntasService {
  
  bdPreguntas = '/Preguntes/';

  constructor(
    private bd: AngularFireDatabaseModule
  ) {}
 

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

// falta afegir el tema usuari
  getEntradaAddPregunta(entrada: entradaAddPregunta){
    
    const dades = {
      idDificultad: entrada.dificultad,
      idODS: entrada.categoria,
      pregunta: entrada.pregunta,   
      respostaCorrecta: entrada.opcioCorrecta,
      respostaIncorrecta1: entrada.opcioIncorrecta1,
      orespostaIncorrecta2: entrada.opcioIncorrecta2,
      respostaIncorrecta3: entrada.opcioIncorrecta3
    };
    
    this.bd
      .object(this.bdPreguntas + entrada.pregunta)
      .update(dades)
      .then((d) => {
        console.log('Dades modificades correctament');
      })
      .catch((error) => {
        console.log('Error accedint al Log');
      });
  }

}