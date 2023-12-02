import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, finalize } from 'rxjs';
import { Avatar } from '../../../modelsdedades/Perfil/perfil';
import { modificarPerfil } from 'src/modelsdedades/Perfil/modificarperfil';
@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  bdPerfil = '/Usuaris/'
  email: any;
  comodi = "PUNT" // com que Firebase no admet el "." en els identificadors de node fem un artifici canviant-lo per la paraula PUNT en majúscules
  llistaFitxers?: FileList;
  avatarSeleccionat?: Avatar;
  usuario="adminPrueba";

  constructor(private bd: AngularFireDatabase, private magatzem: AngularFireStorage) { }
  ngOnInit(): void {
    this.getUsuari()
  }
  
  pushFitxer(av: Avatar): Observable<number | undefined> {
    const rutaFitxer = this.bdPerfil + av.fitxer.name
    const refMagatzem = this.magatzem.ref(rutaFitxer)
    const pujarFitxer = this.magatzem.upload(rutaFitxer, av.fitxer)
    pujarFitxer.snapshotChanges().pipe(finalize(() => {
    refMagatzem.getDownloadURL().subscribe(url => { // getDownloadURL() ens donarà la URL una vegada s'ha pujat el fitxer a l'Storage
    // ho fem per a guardar-lo en la base de dades en el camp url
    av.usuari = this.email = localStorage.getItem("email")! // obtenim l'email que hem guardat al localStorage al fer login
    // el signe ! és per a evitar l'error de que el valor pot ser null o undefined
    av.url = url
    av.nomfitxer = av.fitxer.name
    this.bd.object(this.bdPerfil + av.usuari?.replace(".", this.comodi)).update(av)
    .then(d => { console.log("Dades inserides correctament") })
    .catch(error => { console.log("Error accedint als Avatars") })
    });
    })
  ).subscribe();
  return pujarFitxer.percentageChanges();
  }


  getUsuari() {
    return this.bd.object(this.bdPerfil + this.usuario).valueChanges();
  }

  eliminarFitxer(pe: Avatar, fitxerVell: string): void {
    var id = pe.usuari?.toString().replace(".", this.comodi)
    this.eliminarFitxerDelMagatzem(fitxerVell);
    this.eliminarAvatarBaseDades(id)
      .then(() => {
      })
      .catch(error => console.log(error));
  }

  // treiem l'avatar de la base de dades
  private eliminarAvatarBaseDades(id: string): Promise<void> {
    return this.bd.list(this.bdPerfil).remove(id);
  }

  // treiem el fitxer de l'Storage (magatzem)
  private eliminarFitxerDelMagatzem(nomFitxer: string): void {
    const refMagatzem = this.magatzem.ref(this.bdPerfil);
    refMagatzem.child('/' + nomFitxer).delete();
  }

  modificarPerfil(entrada: modificarPerfil){
    const dades = {
      usuari: entrada.usuari,
      passwd: entrada.passwd,
      passwdActual: entrada.passwdActual
    }  
    /* Comparar contraseñas  */
  /*   if (dades.passwdActual == ) {
      
    } */
    this.bd.object(this.bdPerfil).update(dades)
    .then(d => { console.log("Dades modificades correctament") })
    .catch(error => { console.log("Error") })
  } 

/*   sHaDesConnectat() {
    const dades = {
        op: 'logout',
        usuari: this.usuario.email,
        data: Date() 
      }
      localStorage.removeItem("datosUsuario")
      this.bd.object(this.bdPerfil+Date().toString()).update(dades) // update equival a insert si no existeix l'element
      .then( d => { console.log("Dades inserides correctament") })
      .catch( error => { console.log("Error accedint al Log") })
    }  */

}
