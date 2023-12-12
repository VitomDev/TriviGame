import { Injectable } from '@angular/core';
import { usuarios } from '../modelDades/usuarios';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  
  vUsuarios: usuarios[] = [];
  bdUsuari = '/Usuaris/'
  
  constructor(private bd: AngularFireDatabase) { }

  getUsuari(){
    return this.bd.list(this.bdUsuari).valueChanges();
  }


  getUsuari2(username: string){
    // console.log(username)
    return this.bd.object(this.bdUsuari + username).valueChanges();
  }

  pushPuntsUsuari(username: string, punts: number) {
    const dades = {
      username: username,
      punts: punts,
    }

    this.bd.object(this.bdUsuari + dades.username).update(dades)
      .then(d => {console.log("Dades guardades correctament")}) 
      .catch(e => {console.log("Error al guardar dades")})
  }
}
