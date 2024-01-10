import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  bdPerfil = '/Usuaris/';
  constructor(private bd: AngularFireDatabase) { }

  ngOnInit(): void {
    this.getUsuari();
  }

  getUsuari() {
    //TODO: CUANDO LO PONGAMOS BIEN COJERA EL USERNAME DEL LOCALSTORAGE NO EL THIS.USUARIO
    return this.bd.object(this.bdPerfil + this.usuario).valueChanges();
  }

  inserirUsuari(usuari: string, email: string, contrasenya: string){
    this.bd
      .object(this.bdPerfil + userId)
      .update({ contrasenya: passwd })
      .then((d) => {
        console.log('Contrasenya modificada correctament');
      })
      .catch((error) => {
        console.log('Error');
      });
  }

  
}
