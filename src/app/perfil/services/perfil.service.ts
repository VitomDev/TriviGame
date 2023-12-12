import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { modificarPerfil } from 'src/modelsdedades/Perfil/modificarperfil';
@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  bdPerfil = '/Usuaris/'
  email: any;
  psw = ''
  comodi = "PUNT" // com que Firebase no admet el "." en els identificadors de node fem un artifici canviant-lo per la paraula PUNT en majúscules
  usuario="adminPrueba";
  avatar="/avatar";

  constructor(private bd: AngularFireDatabase, private magatzem: AngularFireStorage) { }
  ngOnInit(): void {
    this.getUsuari()
  }

  getUsuari() {
    /* TODO: CUANDO LO PONGAMOS BIEN COJERA EL USERNAME DEL LOCALSTORAGE NO EL THIS.USUARIO */
    return this.bd.object(this.bdPerfil + this.usuario).valueChanges();
  }

//TODO: mirar el username y comprobar que no este vacio y poner min 8 caracteres dos letras como minimo y una mayus etc en el passwd
  modificarPerfil(entrada: modificarPerfil, userId: string){
    const dades = {
      username: entrada.username,
      contrasenya: entrada.contrasenya,
    }  

    const contrasenyaActual = entrada.contrasenyaActual;
    
//TODO:mirar si el user esta empty
//todo:mirar la new passwd esta empty
//todo:restringir tod a nombre mas de 2 caracteres y paswd a mas de 8 caracteres
//TODO:comprobar que la passwd coincida con la de la bbdd

    if (dades.username && dades.username.trim() !== '') {
      
      if ( contrasenyaActual == localStorage.getItem("contrasenya")) {
      
        this.bd.object(`${this.bdPerfil}/${userId}`).update(dades)
        .then(d => { console.log("Dades modificades correctament") })
        .catch(error => { console.log("Error") })
      } else{
        console.log("La contrasenya no es vàlida")
      }
    }else{
      console.log("L'usuari o la contrasenya no són vàlids")
    }
  } 

  uploadAvatarBase64(base64Image: string, userId: string): Observable<any> {
    return new Observable(subscriber => {
      this.bd.object(`${this.bdPerfil}/${userId}`).update({ avatar: base64Image })
        .then(() => {
          subscriber.next(100); // Indica un progreso del 100%
          subscriber.complete();
        })
        .catch(error => {
          subscriber.error(error);
        });
    });
  }

donarseDeBaixa(userId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const avui = new Date();
    const dataExpiracio = this.addDays(avui, 15); 
    const solicitudBaja = avui; 
  
    // Formatea las fechas
    const dades = {
      dataExpiracio: this.formatDateToDDMMYYYY(dataExpiracio),
      solicitutBaja: this.formatDateToDDMMYYYY(solicitudBaja), 
    };
    this.bd.object(`${this.bdPerfil}/${userId}`).update(dades)
      .then(() => {
        console.log('Baja y expiración actualizadas con éxito');
        resolve();
      })
      .catch(error => {
        console.error('Error al actualizar la baja y expiración', error);
        reject(error);
      });
  });
}

// Función auxiliar para añadir días a una fecha
private addDays(date: Date, days: number): Date {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Función auxiliar para formatear la fecha en el formato DD/MM/YYYY
private formatDateToDDMMYYYY(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

}