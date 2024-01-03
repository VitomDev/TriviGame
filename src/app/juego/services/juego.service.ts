import { Injectable } from '@angular/core';
import { preguntas } from '../modelDades/preguntas';
import { Historial } from '../modelDades/historial';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ods } from '../modelDades/ods';

@Injectable({
  providedIn: 'root',
})
export class JuegoService {
  vPreguntas: preguntas[] = [];
  bdPreguntas = '/Preguntes/';
  bdUsuari = '/Usuaris/';
  bdHistorial = '/Historial/';
  bdOds = '/ODS/';

  constructor(private bd: AngularFireDatabase) {}

  getPreguntes() {
    return this.bd.list(this.bdPreguntas).valueChanges();
  }

  getOds(string : string | undefined){
    return this.bd.list(this.bdOds + string).valueChanges();
  }

  getUsuari() {
    return this.bd.list(this.bdUsuari).valueChanges();
  }

  getUsuari2(username: string) {
    // console.log(username)
    return this.bd.object(this.bdUsuari + username).valueChanges();
  }

  pushPuntsUsuari(username: string, punts: number) {
    const dades = {
      punts: punts,
      username: username,
    };

    this.bd
      .object(this.bdUsuari + dades.username)
      .update(dades)
      .then((d) => {
        console.log('Dades guardades correctament');
      })
      .catch((e) => {
        console.log('Error al guardar dades');
      });
  }

  pushHistorial(
    username: string,
    idPregunta: string,
    qttPistes: number,
    puntsGuanyats: number,
    puntsPerduts: number
  ) {
    const dades = {
      dataTime: new Date().toLocaleString(),
      idUsername: username,
      idPregunta: idPregunta,
      pistes: qttPistes,
      puntsGuanyats: puntsGuanyats,
      puntsPerduts: puntsPerduts,
    };

    // quiero que se guarde asi: 2023-11-16 12:49:13

    dades.dataTime = dades.dataTime.replace('/', '-');
    dades.dataTime = dades.dataTime.replace('/', '-');
    dades.dataTime = dades.dataTime.replace(',', ' ');
    console.log(dades.dataTime);
    this.bd
      .object(this.bdHistorial + dades.dataTime)
      .update(dades)
      .then((d) => {
        console.log('Dades guardades correctament');
      })
      .catch((e) => {
        console.log('Error al guardar dades');
      });
  }
  pushRatxaUsuari(username: string, racha: number) {
    const dades = {
      racha: racha,
      username: username,
    };

    this.bd
      .object(this.bdUsuari + dades.username)
      .update(dades)
      .then((d) => {
        console.log('Dades guardades correctament');
      })
      .catch((e) => {
        console.log('Error al guardar dades');
      });
  }

  pushPreguntesDiaries(username: string, preguntesDiaries: number) {
    const dades = {
      username: username,
      preguntesDiaries: preguntesDiaries,
    };

    this.bd
      .object(this.bdUsuari + dades.username)
      .update(dades)
      .then((d) => {
        console.log('Dades guardades correctament');
      })
      .catch((e) => {
        console.log('Error al guardar dades');
      });
  }
}
