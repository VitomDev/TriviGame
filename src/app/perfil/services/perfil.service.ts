import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, finalize } from 'rxjs';
import { Avatar } from '../../../modelsdedades/Perfil/perfil';
import { modificarPerfil } from 'src/modelsdedades/modificarperfil';
@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  bdPerfil = '/perfil/'
  email: any;
  comodi = "PUNT" // com que Firebase no admet el "." en els identificadors de node fem un artifici canviant-lo per la paraula PUNT en majúscules
  llistaFitxers?: FileList;
  avatarSeleccionat?: Avatar;


  constructor(private bd: AngularFireDatabase, private magatzem: AngularFireStorage) { }
  ngOnInit(): void {
    this.getAvatar()
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


  getAvatar() {
    var id = this.email = this.email = localStorage.getItem("email")?.toString().replace(".", this.comodi)
    return this.bd.object(this.bdPerfil + id).valueChanges();
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

    this.bd.object(this.bdPerfil).update(dades)
    .then(d => { console.log("Dades modificades correctament") })
    .catch(error => { console.log("Error") })
  }


}
