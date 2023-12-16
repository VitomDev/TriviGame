import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map } from 'rxjs';
import { modificarPerfil } from 'src/modelsdedades/Perfil/modificarperfil';
import { usuarios } from 'src/modelsdedades/Perfil/usuario';
@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  bdPerfil = '/Usuaris/';
  usuario = 'adminPrueba';//TODO:SI CAMBIAS EL USERNAME TIENES QUE VERIFICAR QUE COJA EL CORRECTO
  avatar = '/avatar';
  username = '/username';
  usuari: usuarios | undefined;

  constructor(
    private bd: AngularFireDatabase,
    private magatzem: AngularFireStorage
  ) {}
  ngOnInit(): void {
    this.getUsuari();
  }

  getUsuari() {
    //TODO: CUANDO LO PONGAMOS BIEN COJERA EL USERNAME DEL LOCALSTORAGE NO EL THIS.USUARIO
    return this.bd.object(this.bdPerfil + this.usuario).valueChanges();
  }

  modificarPerfilContrasenya(passwd: string, userId: string) {
    console.log('userid', this.bdPerfil + userId);
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

  uploadAvatarBase64(base64Image: string, userId: string): Observable<any> {
    return new Observable((subscriber) => {
      this.bd
        .object(`${this.bdPerfil}/${userId}`)
        .update({ avatar: base64Image })
        .then(() => {
          subscriber.next(100); // Indica un progreso del 100%
          subscriber.complete();
        })
        .catch((error) => {
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
      this.bd
        .object(`${this.bdPerfil}/${userId}`)
        .update(dades)
        .then(() => {
          console.log('Baja y expiración actualizadas con éxito');
          resolve();
        })
        .catch((error) => {
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
